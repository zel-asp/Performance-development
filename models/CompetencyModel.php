<?php

require_once __DIR__ . '/BaseModel.php';
require_once __DIR__ . '/../config/config.php';

class CompetencyModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct('employee_competencies');
    }

    /**
     * Get an employee's competency record by key from Supabase/database
     */
    public function getEmployeeCompetency(string $employeeId, string $competencyKey): ?array
    {
        // 1. Fetch competency record by key from Supabase
        $compRes = supabaseRequest('competencies?key=eq.' . urlencode($competencyKey), 'GET', null, true);
        $comps = is_array($compRes['data']) ? $compRes['data'] : [];
        if (empty($comps)) {
            // Also try case-insensitive or name match
            $compRes = supabaseRequest('competencies', 'GET', null, true);
            $allComps = is_array($compRes['data']) ? $compRes['data'] : [];
            foreach ($allComps as $c) {
                if (strcasecmp($c['key'] ?? '', $competencyKey) === 0 || strcasecmp($c['name'] ?? '', $competencyKey) === 0) {
                    $comps[] = $c;
                    break;
                }
            }
        }

        $competencyId = !empty($comps[0]['id']) ? $comps[0]['id'] : null;

        // 2. Check competency_assessments table in Supabase
        if ($competencyId) {
            $assessRes = supabaseRequest('competency_assessments?employee_id=eq.' . urlencode($employeeId) . '&competency_id=eq.' . urlencode($competencyId) . '&order=assessment_date.desc&limit=1', 'GET', null, true);
            if (!empty($assessRes['data'][0])) {
                $assessment = $assessRes['data'][0];
                return [
                    'id' => $assessment['id'],
                    'employee_id' => $employeeId,
                    'competency_id' => $competencyId,
                    'competency_key' => $competencyKey,
                    'current_score' => (float)($assessment['score'] ?? 0),
                    'target_score' => (float)($comps[0]['benchmark_score'] ?? 4.50),
                    'last_assessed_at' => $assessment['assessment_date'] ?? date('c'),
                    'updated_at' => $assessment['updated_at'] ?? date('c')
                ];
            }
        }

        // 3. Fallback to employee_competencies table in Supabase
        if ($competencyId) {
            $records = $this->all([
                'employee_id' => $employeeId,
                'competency_id' => $competencyId
            ]);
            if (!empty($records)) {
                return $records[0];
            }
        }

        return null;
    }

    /**
     * Set / Elevate an employee's competency score directly in Supabase
     */
    public function setScore(string $employeeId, string $competencyKey, float $newScore): ?array
    {
        // 1. Resolve Competency ID
        $compRes = supabaseRequest('competencies', 'GET', null, true);
        $allComps = is_array($compRes['data']) ? $compRes['data'] : [];
        $targetComp = null;
        $searchClean = strtolower(str_replace(['_', '-'], '', $competencyKey));

        foreach ($allComps as $c) {
            $cClean = strtolower(str_replace(['_', '-'], '', $c['key'] ?? ''));
            $cName = strtolower($c['name'] ?? '');
            if (
                strcasecmp($c['key'] ?? '', $competencyKey) === 0 ||
                strcasecmp($c['name'] ?? '', $competencyKey) === 0 ||
                $cClean === $searchClean ||
                str_contains($cName, strtolower($competencyKey)) ||
                str_contains(strtolower($competencyKey), $cName)
            ) {
                $targetComp = $c;
                break;
            }
        }

        $now = date('c');

        if ($targetComp) {
            $compId = $targetComp['id'];

            // A. Update/Insert in competency_assessments
            $assessRes = supabaseRequest('competency_assessments?employee_id=eq.' . urlencode($employeeId) . '&competency_id=eq.' . urlencode($compId) . '&limit=1', 'GET', null, true);
            if (!empty($assessRes['data'][0])) {
                $assessId = $assessRes['data'][0]['id'];
                supabaseRequest('competency_assessments?id=eq.' . urlencode($assessId), 'PATCH', [
                    'score' => $newScore,
                    'assessment_date' => $now,
                    'comments' => 'Elevated via certified training session completion & evaluation.',
                    'updated_at' => $now
                ], true);
            } else {
                supabaseRequest('competency_assessments', 'POST', [
                    'employee_id' => $employeeId,
                    'competency_id' => $compId,
                    'score' => $newScore,
                    'assessment_date' => $now,
                    'comments' => 'Certified and upgraded via Training Management program.',
                    'created_at' => $now,
                    'updated_at' => $now
                ], true);
            }

            // B. Update/Insert in employee_competencies
            $empCompRes = supabaseRequest('employee_competencies?employee_id=eq.' . urlencode($employeeId) . '&competency_id=eq.' . urlencode($compId) . '&limit=1', 'GET', null, true);
            if (!empty($empCompRes['data'][0])) {
                $ecId = $empCompRes['data'][0]['id'];
                supabaseRequest('employee_competencies?id=eq.' . urlencode($ecId), 'PATCH', [
                    'current_score' => $newScore,
                    'last_assessed_at' => $now,
                    'updated_at' => $now
                ], true);
            } else {
                supabaseRequest('employee_competencies', 'POST', [
                    'employee_id' => $employeeId,
                    'competency_id' => $compId,
                    'current_score' => $newScore,
                    'target_score' => (float)($targetComp['benchmark_score'] ?? 4.50),
                    'last_assessed_at' => $now,
                    'created_at' => $now,
                    'updated_at' => $now
                ], true);
            }
        }

        // Trigger live TNA / Skill Gap scan for this employee
        $this->scanAndGenerateTrainingNeeds($employeeId);

        return [
            'employee_id' => $employeeId,
            'competency_key' => $competencyKey,
            'current_score' => $newScore,
            'updated_at' => $now
        ];
    }

    /**
     * Elevate all assessed low scores (< 3.80) for an employee to 4.80 upon passing training certification
     */
    public function elevateAllDeficitsForEmployee(string $employeeId, float $targetScore = 4.80): int
    {
        $now = date('c');
        $updatedCount = 0;

        // 1. Fetch all low assessments for this employee
        $assessRes = supabaseRequest('competency_assessments?employee_id=eq.' . urlencode($employeeId), 'GET', null, true);
        $assessments = is_array($assessRes['data']) ? $assessRes['data'] : [];

        foreach ($assessments as $a) {
            $score = (float)($a['score'] ?? 0);
            if ($score < 3.80) {
                $aId = $a['id'] ?? null;
                $compId = $a['competency_id'] ?? null;
                if ($aId) {
                    supabaseRequest('competency_assessments?id=eq.' . urlencode($aId), 'PATCH', [
                        'score' => $targetScore,
                        'assessment_date' => $now,
                        'comments' => 'Elevated from deficit (Passed & Certified via training program).',
                        'updated_at' => $now
                    ], true);
                    $updatedCount++;
                }
                if ($compId) {
                    $empCompRes = supabaseRequest('employee_competencies?employee_id=eq.' . urlencode($employeeId) . '&competency_id=eq.' . urlencode($compId) . '&limit=1', 'GET', null, true);
                    if (!empty($empCompRes['data'][0])) {
                        $ecId = $empCompRes['data'][0]['id'];
                        supabaseRequest('employee_competencies?id=eq.' . urlencode($ecId), 'PATCH', [
                            'current_score' => $targetScore,
                            'last_assessed_at' => $now,
                            'updated_at' => $now
                        ], true);
                    }
                }
            }
        }

        // 2. Also check performance_evaluations table and upgrade any low/PIP rating
        $evalRes = supabaseRequest('performance_evaluations?employee_id=eq.' . urlencode($employeeId), 'GET', null, true);
        $evals = is_array($evalRes['data']) ? $evalRes['data'] : [];
        foreach ($evals as $ev) {
            $evId = $ev['id'] ?? null;
            $evRating = (float)($ev['supervisor_rating'] ?? ($ev['calibrated_score'] ?? 0));
            if ($evId && ($evRating < 3.80 || str_contains(strtolower($ev['tier_label'] ?? ''), 'pip') || str_contains(strtolower($ev['tier_label'] ?? ''), 'developing'))) {
                supabaseRequest('performance_evaluations?id=eq.' . urlencode($evId), 'PATCH', [
                    'supervisor_rating' => $targetScore,
                    'calibrated_score' => $targetScore,
                    'tier_label' => 'Master Tier (Passed & Certified)',
                    'status' => 'Calibrated',
                    'updated_at' => $now
                ], true);
            }
        }

        return $updatedCount;
    }

    /**
     * Get an employee's overall competency average across assessments
     */
    public function getEmployeeOverallRating(string $employeeId): float
    {
        $assessRes = supabaseRequest('competency_assessments?employee_id=eq.' . urlencode($employeeId), 'GET', null, true);
        $assessments = is_array($assessRes['data']) ? $assessRes['data'] : [];

        if (!empty($assessments)) {
            $total = 0.0;
            $count = 0;
            foreach ($assessments as $a) {
                if (isset($a['score']) && is_numeric($a['score'])) {
                    $total += (float)$a['score'];
                    $count++;
                }
            }
            if ($count > 0) {
                return round($total / $count, 2);
            }
        }

        // Fallback to employee_competencies
        $records = $this->all(['employee_id' => $employeeId]);
        if (!empty($records)) {
            $total = 0.0;
            foreach ($records as $r) {
                $total += (float)($r['current_score'] ?? 0);
            }
            return round($total / count($records), 2);
        }

        return 0.0;
    }

    /**
     * Relational Database Scanner: Scans all competency assessments (< 3.8 Skill Gap / Needs TNA),
     * matches with training programs, and populates / synchronizes training needs queue in Supabase.
     */
    public function scanAndGenerateTrainingNeeds(string $employeeId): array
    {
        require_once __DIR__ . '/TrainingNeedModel.php';
        $needModel = new TrainingNeedModel();
        return $needModel->syncDeficitsFromAssessments($employeeId);
    }
}
