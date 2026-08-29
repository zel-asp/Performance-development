<?php

require_once __DIR__ . '/BaseModel.php';

class PerformanceEvaluationModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct('performance_evaluations');
    }

    /**
     * Fetch all evaluations directly from Supabase database
     */
    public function all(array $filters = []): array
    {
        $queryStr = $this->table;
        if (!empty($filters)) {
            $params = [];
            foreach ($filters as $key => $val) {
                $params[] = urlencode($key) . '=eq.' . urlencode($val);
            }
            $queryStr .= '?' . implode('&', $params);
        }

        $res = supabaseRequest($queryStr, 'GET', null, true);
        if ($res['status'] === 200 && is_array($res['data'])) {
            return $res['data'];
        }

        return [];
    }

    /**
     * Create record directly in Supabase
     */
    public function create(array $data): array
    {
        if (empty($data['id'])) {
            $data['id'] = 'eval-' . substr(bin2hex(random_bytes(6)), 0, 8);
        }
        if (empty($data['created_at'])) {
            $data['created_at'] = date('c');
        }

        supabaseRequest($this->table, 'POST', $data, true);
        return $data;
    }

    /**
     * Update record directly in Supabase
     */
    public function update(string $id, array $data): ?array
    {
        $data['updated_at'] = date('c');
        $res = supabaseRequest($this->table . '?id=eq.' . urlencode($id), 'PATCH', $data, true);
        if ($res['status'] >= 200 && $res['status'] < 300 && !empty($res['data'])) {
            return is_array($res['data']) && isset($res['data'][0]) ? $res['data'][0] : $res['data'];
        }
        return $data;
    }

    /**
     * Fetch all evaluations with optional filtering directly from database
     */
    public function getEvaluations(array $filters = []): array
    {
        $all = $this->all($filters);

        if (!is_array($all)) {
            return [];
        }

        $filtered = [];
        $empId = !empty($filters['employee_id']) ? strtolower(trim($filters['employee_id'])) : null;
        $status = !empty($filters['status']) ? strtolower(trim($filters['status'])) : null;
        $cycle = !empty($filters['cycle_period']) ? trim($filters['cycle_period']) : null;

        foreach ($all as $item) {
            if ($empId !== null && isset($item['employee_id']) && strtolower(trim($item['employee_id'])) !== $empId) {
                continue;
            }
            if ($status !== null && isset($item['status']) && strtolower(trim($item['status'])) !== $status) {
                continue;
            }
            if ($cycle !== null && isset($item['cycle_period']) && trim($item['cycle_period']) !== $cycle) {
                continue;
            }
            $filtered[] = $item;
        }

        return $filtered;
    }

    /**
     * Get active evaluation for a specific employee from database
     */
    public function getEvaluationByEmployee(string $empId): ?array
    {
        $normalizedId = strtolower(trim($empId));
        $res = supabaseRequest($this->table . '?employee_id=eq.' . urlencode($normalizedId), 'GET', null, true);
        if ($res['status'] === 200 && is_array($res['data']) && !empty($res['data'][0])) {
            return $res['data'][0];
        }

        // Support alias IDs if needed
        if ($normalizedId === 'emp-101') {
            $aliasRes = supabaseRequest($this->table . '?employee_id=in.(emp-1,OXF-EMP-1001)', 'GET', null, true);
            if ($aliasRes['status'] === 200 && !empty($aliasRes['data'][0])) {
                return $aliasRes['data'][0];
            }
        }
        if ($normalizedId === 'emp-102') {
            $aliasRes = supabaseRequest($this->table . '?employee_id=in.(emp-2,OXF-SUP-2001)', 'GET', null, true);
            if ($aliasRes['status'] === 200 && !empty($aliasRes['data'][0])) {
                return $aliasRes['data'][0];
            }
        }

        return null;
    }

    /**
     * Save / Update Supervisor Appraisal Evaluation
     */
    public function saveSupervisorAppraisal(array $data): array
    {
        $empId = $data['employee_id'] ?? 'emp-101';
        $existing = $this->getEvaluationByEmployee($empId);

        $evalId = $existing['id'] ?? ($data['id'] ?? ('eval-' . substr(bin2hex(random_bytes(4)), 0, 8)));
        $cycle = $data['cycle_period'] ?? ($existing['cycle_period'] ?? '2026 Q3');
        $evaluatorId = $data['evaluator_id'] ?? ($existing['evaluator_id'] ?? 'emp-102');

        $supervisorRating = isset($data['supervisor_rating']) ? round((float)$data['supervisor_rating'], 2) : 4.60;
        $selfEvaluation = isset($data['self_evaluation']) ? round((float)$data['self_evaluation'], 2) : ($existing['self_evaluation'] ?? 4.50);
        $calibratedScore = isset($data['calibrated_score']) ? round((float)$data['calibrated_score'], 2) : round(($selfEvaluation + $supervisorRating) / 2, 2);

        $isRetry = !empty($data['is_retry']) || isset($data['new_supervisor_rating']) || isset($data['new_calibrated_score']);
        $newSupervisorRating = isset($data['new_supervisor_rating']) ? round((float)$data['new_supervisor_rating'], 2) : ($isRetry ? $supervisorRating : ($existing['new_supervisor_rating'] ?? null));
        $newCalibratedScore = isset($data['new_calibrated_score']) ? round((float)$data['new_calibrated_score'], 2) : ($isRetry ? $calibratedScore : ($existing['new_calibrated_score'] ?? null));

        $effectiveScore = $isRetry && $newSupervisorRating ? $newSupervisorRating : $supervisorRating;

        $tierLabel = 'Proficient';
        if ($effectiveScore >= 4.5) {
            $tierLabel = 'Master Tier';
        } elseif ($effectiveScore >= 3.5) {
            $tierLabel = 'Advanced Tier';
        } elseif ($effectiveScore >= 3.0) {
            $tierLabel = 'Proficient';
        } else {
            $tierLabel = 'Developing (Needs PIP)';
        }

        $criteriaScores = !empty($data['criteria_scores']) ? $data['criteria_scores'] : ($existing['criteria_scores'] ?? []);
        $selfBreakdown = !empty($data['self_breakdown']) ? $data['self_breakdown'] : ($existing['self_breakdown'] ?? []);
        $supervisorNotes = $data['supervisor_notes'] ?? ($existing['supervisor_notes'] ?? '');
        $peerFeedback = !empty($data['peer_feedback']) ? $data['peer_feedback'] : ($existing['peer_feedback'] ?? []);
        $digitalSignoffs = !empty($data['digital_signoffs']) ? $data['digital_signoffs'] : ($existing['digital_signoffs'] ?? [
            'supervisor_endorsed' => true,
            'supervisor_endorsed_at' => date('c')
        ]);

        $record = [
            'id'                     => $evalId,
            'employee_id'            => $empId,
            'evaluator_id'           => $evaluatorId,
            'cycle_period'           => $cycle,
            'supervisor_rating'      => $supervisorRating,
            'self_evaluation'        => $selfEvaluation,
            'calibrated_score'       => $calibratedScore,
            'new_supervisor_rating'  => $newSupervisorRating,
            'new_calibrated_score'   => $newCalibratedScore,
            'tier_label'             => $tierLabel,
            'status'                 => 'Rated',
            'criteria_scores'        => $criteriaScores,
            'self_breakdown'         => $selfBreakdown,
            'supervisor_notes'       => $supervisorNotes,
            'peer_feedback'          => $peerFeedback,
            'digital_signoffs'       => $digitalSignoffs,
            'created_at'             => $existing['created_at'] ?? date('c'),
            'updated_at'             => date('c')
        ];

        // If exists in Supabase, update; else create
        if ($existing) {
            $this->update($evalId, $record);
        } else {
            $this->create($record);
        }

        return $record;
    }

    /**
     * Save Self-Assessment Evaluation
     */
    public function saveSelfAssessment(array $data): array
    {
        $empId = $data['employee_id'] ?? 'emp-101';
        $existing = $this->getEvaluationByEmployee($empId);

        $selfEvaluation = isset($data['self_evaluation']) ? round((float)$data['self_evaluation'], 2) : 4.50;
        $evalId = $existing['id'] ?? ($data['id'] ?? ('eval-' . substr(bin2hex(random_bytes(4)), 0, 8)));
        $supervisorRating = isset($existing['supervisor_rating']) ? (float)$existing['supervisor_rating'] : (isset($data['supervisor_rating']) ? (float)$data['supervisor_rating'] : 4.60);
        $calibratedScore = round(($selfEvaluation + $supervisorRating) / 2, 2);

        $record = [
            'id'                => $evalId,
            'employee_id'       => $empId,
            'self_evaluation'   => $selfEvaluation,
            'calibrated_score'  => $calibratedScore,
            'updated_at'        => date('c')
        ];

        if (isset($data['self_breakdown'])) {
            $record['self_breakdown'] = $data['self_breakdown'];
        }

        if ($existing) {
            $this->update($evalId, $record);
            return array_merge($existing, $record);
        } else {
            $record['cycle_period'] = $data['cycle_period'] ?? '2026 Q3';
            $record['supervisor_rating'] = $supervisorRating;
            $record['tier_label'] = 'Proficient';
            $record['status'] = 'Pending';
            $this->create($record);
            return $record;
        }
    }

    /**
     * Save 1-on-1 Calibration Discussion
     */
    public function calibrateEvaluation(array $data): array
    {
        $empId = $data['employee_id'] ?? 'emp-101';
        $existing = $this->getEvaluationByEmployee($empId);

        if (!$existing) {
            $existing = $this->saveSupervisorAppraisal($data);
        }

        $selfEvaluation = isset($data['self_evaluation']) ? round((float)$data['self_evaluation'], 2) : (isset($existing['self_evaluation']) ? (float)$existing['self_evaluation'] : 4.50);
        $supervisorRating = isset($existing['supervisor_rating']) ? (float)$existing['supervisor_rating'] : 4.60;

        $isRetry = !empty($data['is_retry']) || isset($data['new_calibrated_score']);
        $defaultCalibrated = round(($selfEvaluation + $supervisorRating) / 2, 2);
        $calibratedScore = isset($data['calibrated_score']) ? round((float)$data['calibrated_score'], 2) : $defaultCalibrated;
        $newCalibratedScore = isset($data['new_calibrated_score']) ? round((float)$data['new_calibrated_score'], 2) : ($isRetry ? $calibratedScore : ($existing['new_calibrated_score'] ?? null));

        $effectiveScore = $isRetry && $newCalibratedScore ? $newCalibratedScore : $calibratedScore;
        $tierLabel = $data['tier_label'] ?? ($effectiveScore >= 4.5 ? 'Master Tier' : ($effectiveScore >= 3.5 ? 'Advanced Tier' : ($effectiveScore >= 3.0 ? 'Proficient' : 'Developing (Needs PIP)')));

        $record = [
            'self_evaluation'       => $selfEvaluation,
            'calibrated_score'      => $calibratedScore,
            'new_calibrated_score'  => $newCalibratedScore,
            'tier_label'            => $tierLabel,
            'status'                => 'Calibrated',
            'updated_at'            => date('c')
        ];

        $this->update($existing['id'], $record);
        return array_merge($existing, $record);
    }
}

