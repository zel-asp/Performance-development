<?php

require_once __DIR__ . '/BaseModel.php';
require_once __DIR__ . '/../config/config.php';

class TrainingNeedModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct('training_needs');
    }

    /**
     * Get All Training Needs & Skill Gap Deficits from Supabase
     * Synchronizes from competency_assessments where overall score < 3.8 (Skill Gap / Needs TNA)
     */
    public function getNeeds(array $filters = []): array
    {
        // 1. Sync fresh competency assessment deficits (< 3.8) from Supabase
        $this->syncDeficitsFromAssessments();

        // 2. Fetch all training needs from Supabase
        $allNeeds = $this->all($filters);

        // 3. Fetch programs from Supabase for metadata linking
        $programsRes = supabaseRequest('training_programs', 'GET', null, true);
        $programs = is_array($programsRes['data']) ? $programsRes['data'] : [];

        $progMap = [];
        foreach ($programs as $p) {
            $pId = $p['id'] ?? '';
            if ($pId) $progMap[$pId] = $p;
        }

        // 4. Fetch passed evaluations to ensure certified associates are always in Resolved status
        $evalRes = supabaseRequest('training_evaluations?result_status=ilike.*passed*&order=created_at.desc', 'GET', null, true);
        $evals = is_array($evalRes['data'] ?? null) ? $evalRes['data'] : [];
        $evalMap = [];
        foreach ($evals as $ev) {
            $eId = strtolower(trim($ev['associate_id'] ?? ($ev['employee_id'] ?? '')));
            if ($eId && !isset($evalMap[$eId])) {
                $evalMap[$eId] = $ev;
            }
        }

        // 5. Fetch performance_goals to resolve foreign key details for target_goal_id
        $goalsRes = supabaseRequest('performance_goals', 'GET', null, true);
        $goals = (is_array($goalsRes['data'] ?? null) && !isset($goalsRes['data']['code'])) ? $goalsRes['data'] : [];
        $goalsMap = [];
        foreach ($goals as $g) {
            $gId = (string)($g['id'] ?? '');
            if ($gId !== '') {
                $goalsMap[$gId] = $g;
            }
        }

        foreach ($allNeeds as &$need) {
            $linkedId = $need['linkedProgramId'] ?? ($need['linked_program_id'] ?? null);
            $eId = strtolower(trim($need['employee_id'] ?? ($need['employeeId'] ?? '')));

            if ($eId && isset($evalMap[$eId])) {
                $ev = $evalMap[$eId];
                $need['status'] = 'Resolved';
                $need['certificateReference'] = $ev['certificate_reference'] ?? null;
                $need['current_score'] = (float)($ev['competency_score_after'] ?? 4.80);
                $need['currentScore'] = (float)($ev['competency_score_after'] ?? 4.80);
                $need['gap'] = 0;
            }

            if ($linkedId && isset($progMap[$linkedId])) {
                $matchedProg = $progMap[$linkedId];
                $need['linkedProgramId'] = $matchedProg['id'];
                $need['linked_program_id'] = $matchedProg['id'];
                $need['linkedProgramTitle'] = $matchedProg['title'] ?? 'Prescribed Program';
                $need['linked_program_title'] = $matchedProg['title'] ?? 'Prescribed Program';
                $need['programDuration'] = $matchedProg['duration'] ?? '3 Hours';
                $need['programPassingScore'] = $matchedProg['passingScore'] ?? ($matchedProg['passing_score'] ?? 80);
                $need['programFormat'] = $matchedProg['format'] ?? 'Workshop';
                if (empty($need['status']) || $need['status'] === 'Identified') {
                    $need['status'] = 'Program Linked';
                }
            } else {
                $need['linkedProgramId'] = null;
                $need['linked_program_id'] = null;
                $need['linkedProgramTitle'] = null;
                $need['linked_program_title'] = null;
                $need['programDuration'] = null;
                $need['programPassingScore'] = null;
                $need['programFormat'] = null;
                if (($need['status'] ?? '') === 'Program Linked') {
                    $need['status'] = 'Identified';
                }
            }

            // Resolve Performance Goal Foreign Key Details
            $tGoalId = (string)($need['target_goal_id'] ?? ($need['targetGoalId'] ?? ''));
            if ($tGoalId !== '' && isset($goalsMap[$tGoalId])) {
                $linkedGoal = $goalsMap[$tGoalId];
                $need['linkedGoalTitle'] = $linkedGoal['title'] ?? null;
                $need['linked_goal_title'] = $linkedGoal['title'] ?? null;
                $need['linkedGoalMetric'] = $linkedGoal['target_metric'] ?? null;
                $need['linked_goal_metric'] = $linkedGoal['target_metric'] ?? null;
                $need['linkedGoalWeight'] = $linkedGoal['weight'] ?? null;
                $need['linked_goal_weight'] = $linkedGoal['weight'] ?? null;
                $need['linkedGoalStatus'] = $linkedGoal['status'] ?? null;
                $need['linked_goal_status'] = $linkedGoal['status'] ?? null;
                $need['linkedGoalTargetDate'] = $linkedGoal['target_date'] ?? null;
                $need['linked_goal_target_date'] = $linkedGoal['target_date'] ?? null;
                $need['source_label'] = 'Stage 7 Performance IDP Remediation';
                $need['sourceLabel'] = 'Stage 7 Performance IDP Remediation';
            }
        }

        // Group/Deduplicate strictly by unique trigger (employee_id + competency_key + target_goal_id)
        $dedupedNeeds = [];
        $seenKeys = [];
        foreach ($allNeeds as $n) {
            $eId = strtolower(trim($n['employee_id'] ?? ($n['employeeId'] ?? '')));
            $goalId = $n['target_goal_id'] ?? ($n['targetGoalId'] ?? '');
            $compKey = $n['competency_key'] ?? ($n['competencyKey'] ?? ($n['target_competency'] ?? ''));
            $uniqueKey = $eId ? "{$eId}_{$compKey}_{$goalId}" : ($n['id'] ?? uniqid());

            if (!isset($seenKeys[$uniqueKey])) {
                $seenKeys[$uniqueKey] = true;
                $dedupedNeeds[] = $n;
            }
        }
        
        $allNeeds = $dedupedNeeds;

        return $allNeeds;
    }

    /**
     * Assign a specific training program manually to a training need
     */
    public function assignProgram(string $needId, string $programId): ?array
    {
        $payload = [
            'linked_program_id' => $programId,
            'status'            => 'Program Linked',
            'updated_at'        => date('c')
        ];

        return $this->update($needId, $payload);
    }

    /**
     * Create a new training need in database
     */
    public function createNeed(array $data): array
    {
        if (empty($data['id'])) {
            $data['id'] = 'need-' . substr(bin2hex(random_bytes(4)), 0, 6);
        }
        if (empty($data['dateIdentified']) && empty($data['date_identified'])) {
            $data['dateIdentified'] = date('M d, Y');
            $data['date_identified'] = date('M d, Y');
        }
        if (empty($data['status'])) {
            $data['status'] = 'Identified';
        }
        if (empty($data['sourceType']) && empty($data['source_type'])) {
            $data['sourceType'] = 'competency_gap';
            $data['source_type'] = 'competency_gap';
        }
        if (empty($data['sourceLabel']) && empty($data['source_label'])) {
            $data['sourceLabel'] = 'Skill Gap';
            $data['source_label'] = 'Skill Gap';
        }

        return $this->create($data);
    }

    /**
     * Update training need status (e.g. Program Linked, Scheduled, Resolved / Completed)
     */
    public function updateStatus(string $needId, string $status, ?string $linkedProgramId = null): ?array
    {
        $update = [
            'status'     => $status,
            'updated_at' => date('c')
        ];
        if ($linkedProgramId !== null) {
            $update['linked_program_id'] = $linkedProgramId;
        }

        return $this->update($needId, $update);
    }

    /**
     * Real-Time Synchronizer from public.competency_assessments
     * Triggers when Associate Overall Rating < 3.8 (Skill Gap / Needs TNA).
     * Creates ONE unified Associate Skill Gap Profile with detailed diagnosed low competency breakdown.
     * No auto-assignment of programs — Supervisor manually selects the appropriate program.
     */
    public function syncDeficitsFromAssessments(?string $specificEmployeeId = null): array
    {
        // 1. Fetch latest assessments
        $query = 'competency_assessments?order=assessment_date.desc';
        if ($specificEmployeeId) {
            $query .= '&employee_id=eq.' . urlencode($specificEmployeeId);
        }
        $assessRes = supabaseRequest($query, 'GET', null, true);
        $assessments = is_array($assessRes['data']) ? $assessRes['data'] : [];

        if (empty($assessments)) {
            return [];
        }

        // 2. Fetch metadata lookups
        $empRes = supabaseRequest('employees', 'GET', null, true);
        $employees = is_array($empRes['data']) ? $empRes['data'] : [];
        if (empty($employees)) {
            $userRes = supabaseRequest('users', 'GET', null, true);
            $employees = is_array($userRes['data']) ? $userRes['data'] : [];
        }

        $deptRes = supabaseRequest('departments', 'GET', null, true);
        $departments = is_array($deptRes['data']) ? $deptRes['data'] : [];

        $compRes = supabaseRequest('competencies', 'GET', null, true);
        $competencies = is_array($compRes['data']) ? $compRes['data'] : [];

        // Build lookup maps
        $empMap = [];
        foreach ($employees as $e) {
            $empMap[$e['id']] = $e;
        }

        $deptMap = [];
        foreach ($departments as $d) {
            $deptMap[$d['id']] = $d['name'] ?? 'General';
        }

        $compMap = [];
        foreach ($competencies as $c) {
            $compMap[$c['id']] = $c;
        }

        // 3. Fetch existing training_needs from Supabase
        $existingNeedsRes = supabaseRequest('training_needs', 'GET', null, true);
        $existingNeeds = is_array($existingNeedsRes['data']) ? $existingNeedsRes['data'] : [];
        $needsByKey = [];

        foreach ($existingNeeds as $n) {
            $eId = strtolower(trim($n['employee_id'] ?? ($n['employeeId'] ?? '')));
            $cKey = $n['competency_key'] ?? ($n['competencyKey'] ?? '');
            $gId = $n['target_goal_id'] ?? ($n['targetGoalId'] ?? '');
            if ($eId) {
                $k = "{$eId}_{$cKey}_{$gId}";
                if (!isset($needsByKey[$k])) {
                    $needsByKey[$k] = $n;
                }
            }
        }

        // 4. Group latest assessment per employee & competency
        $empAssessments = [];
        foreach ($assessments as $a) {
            $eId = $a['employee_id'] ?? '';
            $cId = $a['competency_id'] ?? '';
            if (!$eId || !$cId) continue;
            if (!isset($empAssessments[$eId])) {
                $empAssessments[$eId] = [];
            }
            if (!isset($empAssessments[$eId][$cId])) {
                $empAssessments[$eId][$cId] = $a;
            }
        }

        $syncedDeficits = [];

        // 5. Evaluate each employee's overall score & low competencies
        foreach ($empAssessments as $eId => $compScores) {
            $emp = $empMap[$eId] ?? [
                'full_name' => 'Associate',
                'title' => 'Staff',
                'dept' => 'Front Office',
                'avatar_url' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            ];

            $deptName = $emp['dept'] ?? ($deptMap[$emp['department_id'] ?? ''] ?? 'Front Office');

            $scoreValues = [];
            $lowCompetencies = [];
            $lowCompSummaries = [];

            foreach ($compScores as $cId => $assessment) {
                $score = (float)($assessment['score'] ?? 0);
                $scoreValues[] = $score;
                $comp = $compMap[$cId] ?? [
                    'name' => 'Core Competency',
                    'key' => 'general',
                    'benchmark_score' => 4.50
                ];
                $benchmark = (float)($comp['benchmark_score'] ?? 4.50);

                if ($score < 3.80) {
                    $lowCompetencies[] = [
                        'id' => $cId,
                        'name' => $comp['name'],
                        'score' => $score,
                        'benchmark' => $benchmark,
                        'gap' => round($score - $benchmark, 2)
                    ];
                    $lowCompSummaries[] = "{$comp['name']} ({$score}/{$benchmark})";
                }
            }

            if (empty($scoreValues)) continue;

            $overallScore = round(array_sum($scoreValues) / count($scoreValues), 2);
            $requiredBenchmark = 4.50;
            $gap = round($overallScore - $requiredBenchmark, 2);

            $existingNeed = $needsByEmp[$eId] ?? null;

            // Trigger Skill Gap / Needs TNA if Overall Score < 3.80 OR has lowest competency deficits < 3.80
            if ($overallScore < 3.80 || !empty($lowCompetencies)) {
                $urgency = ($overallScore < 2.0) ? 'Critical' : (($overallScore < 3.5) ? 'High' : 'Medium');
                $targetCompSummary = !empty($lowCompetencies)
                    ? implode(', ', array_map(fn($c) => $c['name'], array_slice($lowCompetencies, 0, 3))) . (count($lowCompetencies) > 3 ? ' +' . (count($lowCompetencies) - 3) . ' more' : '')
                    : 'Overall Hospitality Proficiency';

                $bulletPoints = [];
                foreach ($lowCompetencies as $lc) {
                    $gapFormatted = $lc['gap'] < 0 ? $lc['gap'] : '+' . $lc['gap'];
                    $bulletPoints[] = "• " . $lc['name'] . ": " . number_format($lc['score'], 1) . " / " . number_format($lc['benchmark'], 1) . " (" . $gapFormatted . " Gap)";
                }

                $diagnosisNote = "Assessed Overall Score: " . number_format($overallScore, 1) . " / 5.0 (Benchmark: " . number_format($requiredBenchmark, 1) . ")\n" . implode("\n", $bulletPoints);

                if ($existingNeed) {
                    // Retain manually assigned program if already configured
                    $currentProgramId = $existingNeed['linked_program_id'] ?? ($existingNeed['linkedProgramId'] ?? null);
                    $isAlreadyResolved = in_array($existingNeed['status'] ?? '', ['Resolved', 'Completed']);
                    $status = $isAlreadyResolved ? 'Resolved' : ($currentProgramId ? 'Program Linked' : 'Identified');

                    $updatePayload = [
                        'title' => 'Skill Gap & TNA Deficit: ' . ($emp['full_name'] ?? 'Associate'),
                        'current_score' => $overallScore,
                        'required_score' => $requiredBenchmark,
                        'gap' => $gap,
                        'urgency' => $urgency,
                        'target_competency' => $targetCompSummary,
                        'status' => $status,
                        'notes' => $diagnosisNote
                    ];

                    $this->update($existingNeed['id'], $updatePayload);
                    $syncedDeficits[] = array_merge($existingNeed, $updatePayload);
                } else {
                    // Create new unified live training need deficit
                    $newNeedId = 'need-' . substr(bin2hex(random_bytes(4)), 0, 6);
                    $newNeed = [
                        'id' => $newNeedId,
                        'title' => 'Skill Gap & TNA Deficit: ' . ($emp['full_name'] ?? 'Associate'),
                        'source_type' => 'competency_gap',
                        'source_label' => 'Skill Gap',
                        'category' => 'Associate Skill Gap',
                        'dept' => $deptName,
                        'employee_id' => $eId,
                        'associate_name' => $emp['full_name'] ?? ($emp['name'] ?? 'Associate'),
                        'associate_role' => $emp['title'] ?? ($emp['role'] ?? 'Staff'),
                        'associate_avatar' => $emp['avatar_url'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                        'target_competency_id' => !empty($lowCompetencies) ? $lowCompetencies[0]['id'] : null,
                        'target_competency' => $targetCompSummary,
                        'competency_key' => 'general_tna',
                        'current_score' => $overallScore,
                        'required_score' => $requiredBenchmark,
                        'gap' => $gap,
                        'urgency' => $urgency,
                        'status' => 'Identified',
                        'linked_program_id' => null,
                        'date_identified' => date('M d, Y'),
                        'notes' => $diagnosisNote
                    ];
                    $created = $this->create($newNeed);
                    $syncedDeficits[] = $created;
                    $needsByEmp[$eId] = $created;
                }
            } else {
                // Associate Overall Score >= 3.80 (Benchmark Met / Standard Approaching)
                // Associate does not need training anymore — resolve deficit in queue
                if ($existingNeed && ($existingNeed['status'] ?? '') !== 'Resolved' && ($existingNeed['status'] ?? '') !== 'Completed') {
                    $this->update($existingNeed['id'], [
                        'status' => 'Resolved',
                        'current_score' => $overallScore,
                        'gap' => $gap,
                        'notes' => "Resolved. Overall score elevated to {$overallScore} / 5.0 (Benchmark Met)."
                    ]);
                }
            }
        }

        return $syncedDeficits;
    }
}
