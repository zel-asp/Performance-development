<?php

require_once __DIR__ . '/BaseModel.php';

class PerformanceTaskModel extends BaseModel
{
    private BaseModel $generalTaskStore;

    public function __construct()
    {
        parent::__construct('performance_tasks');
        $this->generalTaskStore = new BaseModel('performance_general_tasks');
    }

    // =========================================================================
    // 1. General Tasks Management (Supervisor Template Matrix)
    // =========================================================================

    public function getGeneralTasks(): array
    {
        $tasks = $this->generalTaskStore->all();
        if (!is_array($tasks)) {
            return [];
        }
        usort($tasks, fn($a, $b) => strcmp($a['category'] ?? '', $b['category'] ?? '') ?: strcmp($a['title'] ?? '', $b['title'] ?? ''));
        return $tasks;
    }

    public function createGeneralTask(array $data): array
    {
        $record = [
            'id'                 => !empty($data['id']) ? trim($data['id']) : ('gtask-' . substr(bin2hex(random_bytes(4)), 0, 6)),
            'title'              => trim($data['title'] ?? 'Standard Hospitality Task'),
            'description'        => trim($data['description'] ?? ''),
            'category'           => trim($data['category'] ?? 'Operational Excellence'),
            'target_days_offset' => isset($data['target_days_offset']) ? (int)$data['target_days_offset'] : 7,
            'weight'             => trim($data['weight'] ?? 'Standard'),
            'status'             => 'active',
            'created_at'         => date('c'),
            'updated_at'         => date('c')
        ];

        return $this->generalTaskStore->create($record);
    }

    public function updateGeneralTask(string $id, array $data): ?array
    {
        $update = [
            'updated_at' => date('c')
        ];
        if (isset($data['title'])) $update['title'] = trim($data['title']);
        if (isset($data['description'])) $update['description'] = trim($data['description']);
        if (isset($data['category'])) $update['category'] = trim($data['category']);
        if (isset($data['target_days_offset'])) $update['target_days_offset'] = (int)$data['target_days_offset'];
        if (isset($data['weight'])) $update['weight'] = trim($data['weight']);
        if (isset($data['status'])) $update['status'] = trim($data['status']);

        return $this->generalTaskStore->update($id, $update);
    }

    public function deleteGeneralTask(string $id): bool
    {
        return $this->generalTaskStore->delete($id);
    }

    // =========================================================================
    // 2. Concrete Goal Tasks (General + Specific Checklists)
    // =========================================================================

    public function getTasksForGoal(string|int $goalId): array
    {
        $all = $this->all();
        $filtered = array_filter($all, fn($t) => (string)($t['goal_id'] ?? '') === (string)$goalId);
        return array_values($filtered);
    }

    public function getTasksForEmployee(string $employeeId): array
    {
        $all = $this->all();
        $filtered = array_filter($all, fn($t) => strtolower(trim($t['employee_id'] ?? '')) === strtolower(trim($employeeId)));
        return array_values($filtered);
    }

    /**
     * Automatically populate general tasks for a newly created or approved goal
     */
    public function assignGeneralTasksToGoal(string|int $goalId, string $employeeId, string $goalTargetDate): array
    {
        $generalTemplates = $this->getGeneralTasks();
        $createdTasks = [];
        $existing = $this->getTasksForGoal($goalId);
        $existingGenIds = array_column($existing, 'general_task_id');

        $goalTime = strtotime($goalTargetDate ?: '+30 days');

        foreach ($generalTemplates as $gt) {
            if (($gt['status'] ?? 'active') !== 'active') continue;
            if (in_array($gt['id'], $existingGenIds)) continue;

            $offsetDays = (int)($gt['target_days_offset'] ?? 7);
            $taskDueTime = $goalTime - ($offsetDays * 86400);
            if ($taskDueTime < time()) {
                $taskDueTime = min($goalTime, time() + (3 * 86400));
            }
            $targetDateStr = date('Y-m-d', $taskDueTime);

            $task = [
                'id'                      => 'task-gen-' . substr(bin2hex(random_bytes(4)), 0, 8),
                'goal_id'                 => $goalId,
                'employee_id'             => $employeeId,
                'task_type'               => 'general',
                'general_task_id'         => $gt['id'],
                'title'                   => $gt['title'],
                'description'             => $gt['description'] ?? '',
                'target_date'             => $targetDateStr,
                'status'                  => 'pending',
                'completed_at'            => null,
                'employee_learnings'      => null,
                'employee_feedback'       => null,
                'supervisor_feedback'     => null,
                'supervisor_accomplishment' => null,
                'created_at'              => date('c'),
                'updated_at'              => date('c')
            ];

            $this->create($task);
            $createdTasks[] = $task;
        }

        return $createdTasks;
    }

    /**
     * Create a specific task for a goal, ensuring the deadline is before/by the goal target date
     */
    public function createSpecificTask(array $data, ?string $goalTargetDate = null): array
    {
        $taskTargetDate = !empty($data['target_date']) ? date('Y-m-d', strtotime($data['target_date'])) : date('Y-m-d', strtotime('+14 days'));

        // If goal target date is provided, enforce taskTargetDate <= goalTargetDate
        if (!empty($goalTargetDate)) {
            $goalTime = strtotime($goalTargetDate);
            $taskTime = strtotime($taskTargetDate);
            if ($taskTime > $goalTime) {
                // Adjust to 1 day before or on goal date
                $taskTargetDate = date('Y-m-d', $goalTime - 86400);
            }
        }

        $record = [
            'id'                      => 'task-spec-' . substr(bin2hex(random_bytes(4)), 0, 8),
            'goal_id'                 => $data['goal_id'] ?? null,
            'employee_id'             => trim($data['employee_id'] ?? 'emp-101'),
            'task_type'               => 'specific',
            'general_task_id'         => null,
            'title'                   => trim($data['title'] ?? 'Specific Improvement Task'),
            'description'             => trim($data['description'] ?? ''),
            'target_date'             => $taskTargetDate,
            'status'                  => 'pending',
            'completed_at'            => null,
            'employee_learnings'      => null,
            'employee_feedback'       => null,
            'supervisor_feedback'     => null,
            'supervisor_accomplishment' => null,
            'created_at'              => date('c'),
            'updated_at'              => date('c')
        ];

        return $this->create($record);
    }

    /**
     * Complete a task with employee learnings & feedback (and detected timestamp)
     */
    public function completeTask(string $taskId, string $learnings, string $feedback, ?string $completedAt = null): ?array
    {
        $completedTimestamp = !empty($completedAt) ? $completedAt : date('c');

        $update = [
            'status'             => 'completed',
            'completed_at'       => $completedTimestamp,
            'employee_learnings' => trim($learnings),
            'employee_feedback'  => trim($feedback),
            'updated_at'         => date('c')
        ];

        return $this->update($taskId, $update);
    }

    /**
     * Add supervisor coaching feedback & accomplishment notes to a task
     */
    public function addSupervisorFeedback(string $taskId, ?string $accomplishment, ?string $coachingFeedback): ?array
    {
        $update = [
            'updated_at' => date('c')
        ];
        if ($accomplishment !== null) {
            $update['supervisor_accomplishment'] = trim($accomplishment);
        }
        if ($coachingFeedback !== null) {
            $update['supervisor_feedback'] = trim($coachingFeedback);
        }

        return $this->update($taskId, $update);
    }

    /**
     * Calculate goal progress percentage dynamically strictly from assigned tasks
     */
    public function calculateGoalProgress(string|int $goalId): int
    {
        $tasks = $this->getTasksForGoal($goalId);
        if (empty($tasks)) {
            return 0;
        }

        $completed = count(array_filter($tasks, fn($t) => ($t['status'] ?? '') === 'completed'));
        $total = count($tasks);

        return $total > 0 ? (int)round(($completed / $total) * 100) : 0;
    }
}
