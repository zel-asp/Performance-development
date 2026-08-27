<?php

require_once __DIR__ . '/BaseModel.php';

class PerformanceEvaluationModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct('performance_evaluations');
    }

    /**
     * Fetch all evaluations with optional filtering
     */
    public function getEvaluations(array $filters = []): array
    {
        $all = $this->all($filters);

        if (!is_array($all) || empty($all)) {
            $all = $this->getLocalData($filters);
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
     * Get active evaluation for a specific employee
     */
    public function getEvaluationByEmployee(string $empId): ?array
    {
        $normalizedId = strtolower(trim($empId));
        $all = $this->all();

        if (empty($all)) {
            $all = $this->getLocalData();
        }

        foreach ($all as $item) {
            if (isset($item['employee_id']) && strtolower(trim($item['employee_id'])) === $normalizedId) {
                return $item;
            }
            // Support alias IDs
            if ($normalizedId === 'emp-101' && in_array(strtolower(trim($item['employee_id'] ?? '')), ['emp-1', 'oxf-emp-1001'])) {
                return $item;
            }
            if ($normalizedId === 'emp-102' && in_array(strtolower(trim($item['employee_id'] ?? '')), ['emp-2', 'oxf-sup-2001'])) {
                return $item;
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

        $evalId = $existing['id'] ?? ($data['id'] ?? ('eval-' . bin2hex(random_bytes(4))));
        $cycle = $data['cycle_period'] ?? ($existing['cycle_period'] ?? '2026 Q3');
        $evaluatorId = $data['evaluator_id'] ?? ($existing['evaluator_id'] ?? 'emp-102');

        $supervisorRating = isset($data['supervisor_rating']) ? (float)$data['supervisor_rating'] : 4.60;
        $selfRating = isset($data['self_rating']) ? (float)$data['self_rating'] : ($existing['self_rating'] ?? 4.30);
        $calibratedScore = isset($data['calibrated_score']) ? (float)$data['calibrated_score'] : ($existing['calibrated_score'] ?? $supervisorRating);

        $tierLabel = 'Proficient';
        if ($supervisorRating >= 4.5) {
            $tierLabel = 'Master Tier';
        } elseif ($supervisorRating >= 4.0) {
            $tierLabel = 'Advanced';
        } elseif ($supervisorRating >= 3.0) {
            $tierLabel = 'Proficient';
        } else {
            $tierLabel = 'Developing';
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
            'self_rating'       => $selfRating,
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

        // If exists, update; else create
        if ($existing) {
            $this->update($evalId, $record);
        } else {
            $this->create($record);
        }

        return $record;
    }

    /**
     * Save Employee Self-Assessment
     */
    public function saveSelfAssessment(array $data): array
    {
        $empId = $data['employee_id'] ?? 'emp-101';
        $existing = $this->getEvaluationByEmployee($empId);

        $evalId = $existing['id'] ?? ($data['id'] ?? ('eval-' . bin2hex(random_bytes(4))));
        $selfRating = isset($data['self_rating']) ? (float)$data['self_rating'] : 4.30;
        $selfBreakdown = !empty($data['self_breakdown']) ? $data['self_breakdown'] : ($existing['self_breakdown'] ?? []);

        $record = [
            'id'             => $evalId,
            'employee_id'    => $empId,
            'evaluator_id'   => $existing['evaluator_id'] ?? 'emp-102',
            'cycle_period'   => $existing['cycle_period'] ?? '2026 Q3',
            'self_rating'    => $selfRating,
            'self_breakdown' => $selfBreakdown,
            'updated_at'     => date('c')
        ];

        if ($existing) {
            $this->update($evalId, $record);
            return array_merge($existing, $record);
        } else {
            $record['supervisor_rating'] = 0.00;
            $record['calibrated_score'] = 0.00;
            $record['tier_label'] = 'Pending Supervisor Review';
            $record['status'] = 'Pending';
            $record['criteria_scores'] = [];
            $record['supervisor_notes'] = '';
            $record['peer_feedback'] = [];
            $record['digital_signoffs'] = ['employee_signed' => true, 'employee_signed_at' => date('c')];
            $record['created_at'] = date('c');

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

        $calibratedScore = isset($data['calibrated_score']) ? (float)$data['calibrated_score'] : ($existing['supervisor_rating'] ?? 4.60);
        $discussionMinutes = $data['discussion_minutes'] ?? '1-on-1 performance calibration completed.';

        $digitalSignoffs = $existing['digital_signoffs'] ?? [];
        $digitalSignoffs['hr_recorded'] = true;
        $digitalSignoffs['hr_recorded_at'] = date('c');
        $digitalSignoffs['discussion_minutes'] = $discussionMinutes;

        $record = [
            'calibrated_score' => $calibratedScore,
            'status'           => 'Calibrated',
            'digital_signoffs' => $digitalSignoffs,
            'updated_at'       => date('c')
        ];

        $this->update($existing['id'], $record);
        return array_merge($existing, $record);
    }
}
