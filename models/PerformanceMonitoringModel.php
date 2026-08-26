<?php

require_once __DIR__ . '/BaseModel.php';

class PerformanceMonitoringModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct('performance_monitoring');
    }

    /**
     * Get all monitoring logs with foreign key filtering (by goal_id or employee_id)
     */
    public function getMonitoringLogs(array $filters = []): array
    {
        $all = $this->all($filters);

        if (!is_array($all)) {
            return [];
        }

        $filtered = [];
        $goalId = !empty($filters['goal_id']) ? (int)$filters['goal_id'] : null;
        $empId = !empty($filters['employee_id']) ? strtolower(trim($filters['employee_id'])) : null;

        foreach ($all as $item) {
            if ($goalId !== null && isset($item['goal_id']) && (int)$item['goal_id'] !== $goalId) {
                continue;
            }
            if ($empId !== null && isset($item['employee_id']) && strtolower(trim($item['employee_id'])) !== $empId) {
                continue;
            }
            $filtered[] = $item;
        }

        // Sort by created_at DESC
        usort($filtered, function ($a, $b) {
            $tA = strtotime($a['created_at'] ?? 'now');
            $tB = strtotime($b['created_at'] ?? 'now');
            return $tB - $tA;
        });

        return $filtered;
    }

    /**
     * Log a shift milestone with foreign keys (goal_id, employee_id)
     */
    public function logMilestone(array $data): array
    {
        $goalId = null;
        if (!empty($data['goal_id']) && is_numeric($data['goal_id'])) {
            $goalId = (int)$data['goal_id'];
        } elseif (!empty($data['id']) && is_numeric($data['id'])) {
            $goalId = (int)$data['id'];
        }

        $record = [
            'id'                  => $data['id'] ?? ('mon-' . bin2hex(random_bytes(4))),
            'goal_id'             => $goalId,
            'employee_id'         => trim($data['employee_id'] ?? 'emp-101'),
            'milestone_title'     => trim($data['milestone_title'] ?? $data['title'] ?? 'Shift Milestone'),
            'actual_metric'       => trim($data['actual_metric'] ?? 'Metric Logged'),
            'progress'            => isset($data['progress']) ? (int)$data['progress'] : 85,
            'accomplishments'     => !empty($data['accomplishments']) ? trim($data['accomplishments']) : null,
            'challenges'          => !empty($data['challenges']) ? trim($data['challenges']) : null,
            'feedback'            => !empty($data['feedback']) ? trim($data['feedback']) : null,
            'supporting_evidence' => !empty($data['supporting_evidence']) ? trim($data['supporting_evidence']) : (!empty($data['evidence']) ? trim($data['evidence']) : null),
            'supervisor_notes'    => !empty($data['supervisor_notes']) ? trim($data['supervisor_notes']) : (!empty($data['notes']) ? trim($data['notes']) : null),
            'created_at'          => date('c'),
            'updated_at'          => date('c')
        ];

        return $this->create($record);
    }
}
