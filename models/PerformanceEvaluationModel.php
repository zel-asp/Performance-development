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
        $calibratedScore = isset($data['calibrated_score']) ? round((float)$data['calibrated_score'], 2) : ($existing['calibrated_score'] ?? $supervisorRating);

        $tierLabel = 'Proficient';
        if ($supervisorRating >= 4.5) {
            $tierLabel = 'Master Tier';
        } elseif ($supervisorRating >= 3.5) {
            $tierLabel = 'Advanced Tier';
        } elseif ($supervisorRating >= 3.0) {
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
            'id'                => $evalId,
            'employee_id'       => $empId,
            'evaluator_id'      => $evaluatorId,
            'cycle_period'      => $cycle,
            'supervisor_rating' => $supervisorRating,
            'calibrated_score'  => $calibratedScore,
            'tier_label'        => $tierLabel,
            'status'            => 'Rated',
            'criteria_scores'   => $criteriaScores,
            'self_breakdown'    => $selfBreakdown,
            'supervisor_notes'  => $supervisorNotes,
            'peer_feedback'     => $peerFeedback,
            'digital_signoffs'  => $digitalSignoffs,
            'created_at'        => $existing['created_at'] ?? date('c'),
            'updated_at'        => date('c')
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
     * Save 1-on-1 Calibration Discussion
     */
    public function calibrateEvaluation(array $data): array
    {
        $empId = $data['employee_id'] ?? 'emp-101';
        $existing = $this->getEvaluationByEmployee($empId);

        if (!$existing) {
            $existing = $this->saveSupervisorAppraisal($data);
        }

        $calibratedScore = isset($data['calibrated_score']) ? round((float)$data['calibrated_score'], 2) : ($existing['supervisor_rating'] ?? 4.60);
        $discussionMinutes = $data['discussion_minutes'] ?? '1-on-1 performance calibration completed.';
        $tierLabel = $data['tier_label'] ?? ($calibratedScore >= 4.5 ? 'Master Tier' : ($calibratedScore >= 3.5 ? 'Advanced Tier' : ($calibratedScore >= 3.0 ? 'Proficient' : 'Developing (Needs PIP)')));

        $digitalSignoffs = is_array($existing['digital_signoffs']) ? $existing['digital_signoffs'] : [];
        $digitalSignoffs['discussion_minutes'] = $discussionMinutes;

        $record = [
            'calibrated_score' => $calibratedScore,
            'tier_label'       => $tierLabel,
            'status'           => 'Calibrated',
            'digital_signoffs' => $digitalSignoffs,
            'updated_at'       => date('c')
        ];

        $this->update($existing['id'], $record);
        return array_merge($existing, $record);
    }
}

