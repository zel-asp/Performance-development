<?php

require_once __DIR__ . '/../models/PerformanceGoalModel.php';
require_once __DIR__ . '/../models/PerformanceMonitoringModel.php';
require_once __DIR__ . '/../models/PerformanceTaskModel.php';
require_once __DIR__ . '/../models/PerformanceEvaluationModel.php';
require_once __DIR__ . '/../models/AuthModel.php';
require_once __DIR__ . '/../models/NotificationModel.php';

class PerformanceController
{
    private PerformanceGoalModel $goalModel;
    private PerformanceMonitoringModel $monitoringModel;
    private PerformanceTaskModel $taskModel;
    private PerformanceEvaluationModel $evaluationModel;
    private AuthModel $authModel;
    private NotificationModel $notificationModel;

    public function __construct()
    {
        $this->goalModel = new PerformanceGoalModel();
        $this->monitoringModel = new PerformanceMonitoringModel();
        $this->taskModel = new PerformanceTaskModel();
        $this->evaluationModel = new PerformanceEvaluationModel();
        $this->authModel = new AuthModel();
        $this->notificationModel = new NotificationModel();
    }

    /**
     * Helper to attach dynamic task stats & progress to goals
     */
    private function enrichGoalsWithTasks(array $goals): array
    {
        foreach ($goals as &$g) {
            $goalId = $g['id'] ?? null;
            $tasks = $goalId ? $this->taskModel->getTasksForGoal($goalId) : [];
            $totalTasks = count($tasks);
            $completedTasks = count(array_filter($tasks, fn($t) => ($t['status'] ?? '') === 'completed'));
            $generalTasks = array_values(array_filter($tasks, fn($t) => ($t['task_type'] ?? '') === 'general'));
            $specificTasks = array_values(array_filter($tasks, fn($t) => ($t['task_type'] ?? '') === 'specific'));

            $taskProgress = $totalTasks > 0 ? (int)round(($completedTasks / $totalTasks) * 100) : 0;

            $g['tasks'] = $tasks;
            $g['general_tasks'] = $generalTasks;
            $g['specific_tasks'] = $specificTasks;
            $g['total_tasks'] = $totalTasks;
            $g['completed_tasks'] = $completedTasks;
            $g['task_progress'] = $taskProgress;
            $g['progress'] = $taskProgress; // Dynamic Goal Progress strictly based on completed tasks
        }
        return $goals;
    }

    /**
     * Get list of goals with optional filters (status, employee_id, department)
     */
    public function getGoals(array $payload): array
    {
        $filters = [];
        if (!empty($payload['employee_id'])) {
            $filters['employee_id'] = $payload['employee_id'];
        }
        if (!empty($payload['department'])) {
            $filters['department'] = $payload['department'];
        }
        if (!empty($payload['status'])) {
            $filters['status'] = $payload['status'];
        }

        $goals = $this->goalModel->getGoals($filters);
        $enrichedGoals = $this->enrichGoalsWithTasks($goals);

        return [
            'success' => true,
            'data'    => $enrichedGoals,
            'count'   => count($enrichedGoals),
            'message' => 'Performance goals retrieved successfully.'
        ];
    }

    /**
     * Create a new performance objective & insert it into the database
     */
    public function createGoal(array $payload): array
    {
        // 1. Validation
        $title = trim($payload['title'] ?? '');
        $department = trim($payload['department'] ?? '');
        $targetMetric = trim($payload['target_metric'] ?? $payload['kpi'] ?? '');
        $targetDate = trim($payload['target_date'] ?? '');

        if (empty($title)) {
            return [
                'success' => false,
                'data'    => null,
                'message' => 'Validation error: Objective / Goal Title is required.'
            ];
        }

        if (empty($targetMetric)) {
            return [
                'success' => false,
                'data'    => null,
                'message' => 'Validation error: Target / Success Metric is required.'
            ];
        }

        // 2. Prepare Data & Resolve Real Author from users table
        $employeeId = $payload['employee_id'] ?? 'emp-101';
        $user = $this->authModel->find($employeeId) ?: $this->authModel->findByEmployeeCode($employeeId);

        if ($user) {
            $authorName = $user['full_name'];
            $role = $user['role'];
            $employeeId = $user['id'];
            if (empty($department)) {
                $department = $user['department'] ?? 'Front Office & Guest Experience';
            }
        } else {
            $authorName = $payload['author_name'] ?? 'Staff Member';
            $role = $payload['role'] ?? 'Associate';
        }

        // Check if employee already has an active (non-completed) goal
        $existingGoals = $this->goalModel->getGoalsByEmployee($employeeId);
        $activeGoals = array_filter($existingGoals, function($g) {
            $status = strtolower(trim($g['status'] ?? ''));
            return $status !== 'completed';
        });

        if (!empty($activeGoals)) {
            return [
                'success' => false,
                'data'    => null,
                'message' => "Employees can create only 1 max in-progress goal. Complete or finish existing active goals before setting a new one."
            ];
        }

        $targetScope = $payload['target_scope'] ?? 'single';

        $data = [
            'employee_id'   => $employeeId,
            'role'          => $role,
            'target_scope'  => $targetScope,
            'title'         => $title,
            'department'    => $department ?: 'Front Office & Guest Experience',
            'target_date'   => $targetDate ?: date('Y-m-d', strtotime('+30 days')),
            'target_metric' => $targetMetric,
            'weight'        => $payload['weight'] ?? 'Medium Priority (20% Weight)',
            'evidence'      => $payload['evidence'] ?? null,
            'status'        => $payload['status'] ?? 'Pending Approval',
            'supervisor_id' => $payload['supervisor_id'] ?? null,
            'supervisor_notes' => $payload['supervisor_notes'] ?? null
        ];

        $created = $this->goalModel->createGoal($data);

        // Auto-assign general tasks matrix checklist to newly set goal
        if (!empty($created['id'])) {
            try {
                $this->taskModel->assignGeneralTasksToGoal($created['id'], $employeeId, $data['target_date']);
            } catch (\Throwable $e) {
                error_log('Task assignment error: ' . $e->getMessage());
            }
        }

        // 3. Dynamic Notification based on real author role
        try {
            $goalId = !empty($created['id']) && is_numeric($created['id']) ? (int)$created['id'] : null;
            if (strcasecmp($role, 'Supervisor') === 0 || strcasecmp($role, 'Manager') === 0) {
                // If Supervisor created a goal, notify department associates
                $this->notificationModel->createNotification([
                    'recipient_role' => 'Associate',
                    'user_id'        => 'emp-101',
                    'type'           => 'goal_created',
                    'title'          => 'New Department Objective Set 📋',
                    'message'        => "Supervisor {$authorName} established new target \"{$title}\" ({$data['department']}).",
                    'related_id'     => $created['id'] ?? null,
                    'goal_id'        => $goalId
                ]);
            } else {
                // If Associate created a goal, notify Supervisor
                $this->notificationModel->createNotification([
                    'recipient_role' => 'Supervisor',
                    'user_id'        => 'emp-102',
                    'type'           => 'goal_created',
                    'title'          => 'New Performance Objective Submitted',
                    'message'        => "Associate {$authorName} submitted a new performance target: \"{$title}\" ({$data['department']}). Awaiting supervisor calibration.",
                    'related_id'     => $created['id'] ?? null,
                    'goal_id'        => $goalId
                ]);
            }
        } catch (\Throwable $e) {
            error_log('Notification creation error: ' . $e->getMessage());
        }

        return [
            'success' => true,
            'data'    => $created,
            'message' => "Performance objective \"{$title}\" successfully set and saved to database."
        ];
    }

    /**
     * Update status of a goal (Approve, Needs Revision, Completed)
     */
    public function updateGoalStatus(array $payload): array
    {
        $id = $payload['id'] ?? null;
        $status = $payload['status'] ?? '';
        $notes = $payload['supervisor_notes'] ?? null;

        if (empty($id) || empty($status)) {
            return [
                'success' => false,
                'data'    => null,
                'message' => 'Validation error: Goal ID and new status are required.'
            ];
        }

        $updated = $this->goalModel->updateStatus((string)$id, $status, $notes);

        if (!$updated) {
            return [
                'success' => false,
                'data'    => null,
                'message' => "Goal with ID {$id} not found."
            ];
        }

        // When approved, verify that general tasks are assigned
        if (strcasecmp($status, 'Approved') === 0) {
            try {
                $this->taskModel->assignGeneralTasksToGoal(
                    $id,
                    $updated['employee_id'] ?? 'emp-101',
                    $updated['target_date'] ?? date('Y-m-d', strtotime('+30 days'))
                );
            } catch (\Throwable $e) {
                error_log('Task assignment error on approval: ' . $e->getMessage());
            }
        }

        // Look up owner dynamically from users table
        $ownerId = $updated['employee_id'] ?? 'emp-101';
        $owner = $this->authModel->find($ownerId) ?: $this->authModel->findByEmployeeCode($ownerId);
        $ownerName = $owner['full_name'] ?? 'Associate';

        // Create Notification for Associate when approved
        if (strcasecmp($status, 'Approved') === 0) {
            try {
                $this->notificationModel->createNotification([
                    'recipient_role' => $owner['role'] ?? 'Associate',
                    'user_id'        => $ownerId,
                    'type'           => 'goal_approved',
                    'title'          => 'Objective Approved & Tasks Assigned! 🎉',
                    'message'        => "Performance objective \"{$updated['title']}\" for {$ownerName} was approved. Task checklist is active.",
                    'related_id'     => $id,
                    'goal_id'        => is_numeric($id) ? (int)$id : null
                ]);
            } catch (\Throwable $e) {
                error_log('Notification error: ' . $e->getMessage());
            }
        }

        return [
            'success' => true,
            'data'    => $updated,
            'message' => "Goal status successfully updated to '{$status}'."
        ];
    }

    /**
     * Revise / Update full goal details in database
     */
    public function updateGoal(array $payload): array
    {
        $id = $payload['id'] ?? null;
        if (empty($id)) {
            return [
                'success' => false,
                'data'    => null,
                'message' => 'Goal ID is required to perform update/revision.'
            ];
        }

        $updated = $this->goalModel->updateGoal((string)$id, $payload);

        if (!$updated) {
            return [
                'success' => false,
                'data'    => null,
                'message' => "Failed to update goal with ID '{$id}' in database."
            ];
        }

        // Look up owner dynamically from users table
        $ownerId = $updated['employee_id'] ?? 'emp-101';
        $owner = $this->authModel->find($ownerId) ?: $this->authModel->findByEmployeeCode($ownerId);

        // Create Notification for Associate when goal is revised
        try {
            $notesMsg = !empty($updated['supervisor_notes']) ? " Note: \"{$updated['supervisor_notes']}\"" : "";
            $this->notificationModel->createNotification([
                'recipient_role' => $owner['role'] ?? 'Associate',
                'user_id'        => $ownerId,
                'type'           => 'goal_revised',
                'title'          => 'Performance Objective Revised ✍️',
                'message'        => "Your performance objective \"{$updated['title']}\" was revised. Target Metric: {$updated['target_metric']}.{$notesMsg}",
                'related_id'     => $id,
                'goal_id'        => is_numeric($id) ? (int)$id : null
            ]);
        } catch (\Throwable $e) {
            error_log('Notification error: ' . $e->getMessage());
        }

        return [
            'success' => true,
            'data'    => $updated,
            'message' => 'Performance goal objectives successfully revised and updated in database.'
        ];
    }

    /**
     * Get aggregate Planning Stage Data (Goals + Summary KPIs)
     */
    public function getPlanningData(array $payload = []): array
    {
        $goals = $this->goalModel->getGoals();
        $enrichedGoals = $this->enrichGoalsWithTasks($goals);
        $generalTasks = $this->taskModel->getGeneralTasks();

        $activeCount = count($enrichedGoals);
        $approvedCount = 0;
        $pendingCount = 0;

        foreach ($enrichedGoals as $g) {
            if (($g['status'] ?? '') === 'Approved') {
                $approvedCount++;
            } else {
                $pendingCount++;
            }
        }

        return [
            'success' => true,
            'data'    => [
                'goals'          => $enrichedGoals,
                'general_tasks'  => $generalTasks,
                'total_goals'    => $activeCount,
                'approved_count' => $approvedCount,
                'pending_count'  => $pendingCount,
                'calibration'    => $activeCount > 0 ? round(($approvedCount / $activeCount) * 100) . '%' : '100%'
            ],
            'message' => 'Performance planning data loaded.'
        ];
    }

    // =========================================================================
    // General Tasks CRUD (Supervisor Matrix)
    // =========================================================================

    public function getGeneralTasks(array $payload = []): array
    {
        $tasks = $this->taskModel->getGeneralTasks();
        return [
            'success' => true,
            'data'    => $tasks,
            'count'   => count($tasks),
            'message' => 'General tasks matrix retrieved successfully.'
        ];
    }

    public function createGeneralTask(array $payload): array
    {
        $title = trim($payload['title'] ?? '');
        if (empty($title)) {
            return [
                'success' => false,
                'data'    => null,
                'message' => 'Validation error: Task title is required.'
            ];
        }

        $created = $this->taskModel->createGeneralTask($payload);

        // Optionally distribute to all active goals
        $goals = $this->goalModel->getGoals();
        foreach ($goals as $g) {
            $goalId = $g['id'] ?? null;
            $empId = $g['employee_id'] ?? 'emp-101';
            $gDate = $g['target_date'] ?? date('Y-m-d', strtotime('+30 days'));
            if ($goalId) {
                $this->taskModel->assignGeneralTasksToGoal($goalId, $empId, $gDate);
            }
        }

        return [
            'success' => true,
            'data'    => $created,
            'message' => "General task \"{$title}\" created and added to the employee checklist matrix."
        ];
    }

    public function updateGeneralTask(array $payload): array
    {
        $id = $payload['id'] ?? null;
        if (empty($id)) {
            return [
                'success' => false,
                'data'    => null,
                'message' => 'Task ID is required for update.'
            ];
        }

        $updated = $this->taskModel->updateGeneralTask((string)$id, $payload);
        if (!$updated) {
            return [
                'success' => false,
                'data'    => null,
                'message' => "General task with ID {$id} not found."
            ];
        }

        return [
            'success' => true,
            'data'    => $updated,
            'message' => 'General task updated successfully.'
        ];
    }

    public function deleteGeneralTask(array $payload): array
    {
        $id = $payload['id'] ?? null;
        if (empty($id)) {
            return [
                'success' => false,
                'data'    => null,
                'message' => 'Task ID is required for deletion.'
            ];
        }

        $deleted = $this->taskModel->deleteGeneralTask((string)$id);
        return [
            'success' => $deleted,
            'message' => $deleted ? 'General task removed from matrix.' : 'Failed to delete general task.'
        ];
    }

    // =========================================================================
    // Concrete Goal Tasks (General + Specific Checklists & Completion)
    // =========================================================================

    public function getGoalTasks(array $payload): array
    {
        $goalId = $payload['goal_id'] ?? $payload['id'] ?? null;
        $employeeId = $payload['employee_id'] ?? null;

        if ($goalId) {
            $tasks = $this->taskModel->getTasksForGoal($goalId);
        } elseif ($employeeId) {
            $tasks = $this->taskModel->getTasksForEmployee($employeeId);
        } else {
            $tasks = $this->taskModel->all();
        }

        return [
            'success' => true,
            'data'    => $tasks,
            'count'   => count($tasks),
            'message' => 'Goal tasks retrieved successfully.'
        ];
    }

    public function createSpecificTask(array $payload = []): array
    {
        $goalId = $payload['goal_id'] ?? null;
        $empId = trim($payload['employee_id'] ?? 'emp-101');
        $tasksList = $payload['tasks'] ?? [];

        if (empty($goalId)) {
            return [
                'success' => false,
                'data'    => null,
                'message' => 'Validation error: Goal ID is required.'
            ];
        }

        $goal = $this->goalModel->find((string)$goalId);
        $goalTargetDate = $goal['target_date'] ?? null;

        // If multiple tasks submitted as an array
        if (!empty($tasksList) && is_array($tasksList)) {
            $createdTasks = [];
            foreach ($tasksList as $taskItem) {
                $title = trim($taskItem['title'] ?? '');
                if (empty($title)) continue;
                $taskData = [
                    'goal_id'     => $goalId,
                    'employee_id' => $empId,
                    'title'       => $title,
                    'target_date' => $taskItem['target_date'] ?? null,
                    'description' => $taskItem['description'] ?? ''
                ];
                $createdTasks[] = $this->taskModel->createSpecificTask($taskData, $goalTargetDate);
            }

            if (empty($createdTasks)) {
                return [
                    'success' => false,
                    'data'    => null,
                    'message' => 'Validation error: Please provide at least one valid task title.'
                ];
            }

            // Notification
            try {
                $count = count($createdTasks);
                $this->notificationModel->createNotification([
                    'recipient_role' => 'Associate',
                    'user_id'        => $empId,
                    'type'           => 'task_assigned',
                    'title'          => "Specific Action Tasks Assigned ({$count}) 📋",
                    'message'        => "Supervisor assigned {$count} new action tasks to your performance objective.",
                    'related_id'     => $createdTasks[0]['id'] ?? null,
                    'goal_id'        => is_numeric($goalId) ? (int)$goalId : null
                ]);
            } catch (\Throwable $e) {
                error_log('Notification error: ' . $e->getMessage());
            }

            return [
                'success' => true,
                'data'    => $createdTasks,
                'message' => count($createdTasks) . " specific tasks successfully assigned to Goal #{$goalId}."
            ];
        }

        // Single task fallback
        $title = trim($payload['title'] ?? '');
        if (empty($title)) {
            return [
                'success' => false,
                'data'    => null,
                'message' => 'Validation error: Task Title is required.'
            ];
        }

        $created = $this->taskModel->createSpecificTask($payload, $goalTargetDate);

        // Notify employee of specific task assigned by supervisor
        try {
            $this->notificationModel->createNotification([
                'recipient_role' => 'Associate',
                'user_id'        => $empId,
                'type'           => 'task_assigned',
                'title'          => 'Specific Goal Task Assigned 📋',
                'message'        => "Supervisor assigned specific task: \"{$title}\" (Due: {$created['target_date']}).",
                'related_id'     => $created['id'] ?? null,
                'goal_id'        => is_numeric($goalId) ? (int)$goalId : null
            ]);
        } catch (\Throwable $e) {
            error_log('Notification error: ' . $e->getMessage());
        }

        return [
            'success' => true,
            'data'    => $created,
            'message' => "Specific task \"{$title}\" created and assigned to Goal #{$goalId}."
        ];
    }

    /**
     * Complete a task with Employee Learnings, Operational Feedback, and Timestamp
     */
    public function completeTask(array $payload): array
    {
        $taskId = $payload['id'] ?? $payload['task_id'] ?? null;
        $learnings = trim($payload['employee_learnings'] ?? $payload['learnings'] ?? '');
        $feedback = trim($payload['employee_feedback'] ?? $payload['feedback'] ?? '');
        $completedAt = $payload['completed_at'] ?? date('c');

        if (empty($taskId)) {
            return [
                'success' => false,
                'data'    => null,
                'message' => 'Task ID is required to mark task complete.'
            ];
        }

        // Enforce 100% LMS progress check if this task is an LMS module
        $existingTask = $this->taskModel->find($taskId);
        if ($existingTask) {
            $desc = $existingTask['description'] ?? '';
            $title = $existingTask['title'] ?? '';
            $lmsId = null;
            if (preg_match('/\[LMS:([^\]]+)\]/', $desc, $matches)) {
                $lmsId = trim($matches[1]);
            }

            if (!empty($lmsId)) {
                $empId = $existingTask['employee_id'] ?? 'emp-101';
                $checkPres = supabaseRequest('lms_prescribed?employee=eq.' . urlencode($empId) . '&lms_id=eq.' . urlencode($lmsId), 'GET', null, true);
                $presList = is_array($checkPres['data'] ?? null) ? $checkPres['data'] : [];
                $pres = !empty($presList) ? $presList[0] : null;

                $progress = $pres ? (int)($pres['progress'] ?? 0) : 0;
                $status = strtolower($pres['status'] ?? '');
                $isCompleted = ($progress >= 100) || in_array($status, ['passed', 'completed', 'cert']);

                if (!$isCompleted) {
                    return [
                        'success' => false,
                        'data'    => null,
                        'message' => "LMS Progress Requirement: You must achieve 100% progress in the prescribed LMS Handbook (\"{$title}\") before completing this task! (Current progress: {$progress}%)"
                    ];
                }
            }
        }

        $updatedTask = $this->taskModel->completeTask($taskId, $learnings, $feedback, $completedAt);
        if (!$updatedTask) {
            return [
                'success' => false,
                'data'    => null,
                'message' => "Task with ID {$taskId} not found."
            ];
        }

        // Calculate new goal progress
        $goalId = $updatedTask['goal_id'] ?? null;
        $newProgress = $goalId ? $this->taskModel->calculateGoalProgress($goalId) : 100;

        // Auto-log to performance_monitoring stream
        try {
            $this->monitoringModel->logMilestone([
                'goal_id'             => $goalId,
                'employee_id'         => $updatedTask['employee_id'] ?? 'emp-101',
                'milestone_title'     => 'Task Completed: ' . $updatedTask['title'],
                'actual_metric'       => "Goal Progress: {$newProgress}%",
                'progress'            => $newProgress,
                'accomplishments'     => $learnings ?: 'Completed assigned operational checklist.',
                'challenges'          => null,
                'feedback'            => $feedback,
                'supporting_evidence' => 'Task Checklist Verified'
            ]);
        } catch (\Throwable $e) {
            error_log('Auto log milestone error: ' . $e->getMessage());
        }

        // Notify supervisor
        try {
            $this->notificationModel->createNotification([
                'recipient_role' => 'Supervisor',
                'user_id'        => 'emp-102',
                'type'           => 'task_completed',
                'title'          => 'Task Completed with Feedback ✨',
                'message'        => "Employee completed \"{$updatedTask['title']}\" and submitted learnings & feedback.",
                'related_id'     => $taskId,
                'goal_id'        => is_numeric($goalId) ? (int)$goalId : null
            ]);
        } catch (\Throwable $e) {
            error_log('Notification error: ' . $e->getMessage());
        }

        return [
            'success'       => true,
            'data'          => $updatedTask,
            'goal_progress' => $newProgress,
            'message'       => "Task completed successfully! Learnings and feedback logged at {$completedAt}."
        ];
    }

    /**
     * Add supervisor coaching feedback & recorded accomplishment
     */
    public function addSupervisorTaskFeedback(array $payload): array
    {
        $taskId = $payload['id'] ?? $payload['task_id'] ?? null;
        $accomplishment = $payload['supervisor_accomplishment'] ?? $payload['accomplishments'] ?? null;
        $coachingFeedback = $payload['supervisor_feedback'] ?? $payload['coaching_feedback'] ?? null;

        if (empty($taskId)) {
            return [
                'success' => false,
                'data'    => null,
                'message' => 'Task ID is required.'
            ];
        }

        $updated = $this->taskModel->addSupervisorFeedback($taskId, $accomplishment, $coachingFeedback);
        if (!$updated) {
            return [
                'success' => false,
                'data'    => null,
                'message' => "Task with ID {$taskId} not found."
            ];
        }

        return [
            'success' => true,
            'data'    => $updated,
            'message' => 'Supervisor coaching feedback and accomplishments recorded successfully.'
        ];
    }

    /**
     * Delete a task from a goal
     */
    public function deleteTask(array $payload): array
    {
        $taskId = $payload['id'] ?? $payload['task_id'] ?? null;
        if (empty($taskId)) {
            return [
                'success' => false,
                'data'    => null,
                'message' => 'Task ID is required to delete task.'
            ];
        }

        $deleted = $this->taskModel->deleteTask((string)$taskId);
        return [
            'success' => $deleted,
            'data'    => ['id' => $taskId],
            'message' => $deleted ? 'Task successfully deleted.' : 'Failed to delete task.'
        ];
    }

    /**
     * Reset a task back to pending so employee can re-do it
     */
    public function resetTask(array $payload): array
    {
        $taskId = $payload['id'] ?? $payload['task_id'] ?? null;
        if (empty($taskId)) {
            return [
                'success' => false,
                'data'    => null,
                'message' => 'Task ID is required to reset task.'
            ];
        }

        $updated = $this->taskModel->resetTask((string)$taskId);
        if (!$updated) {
            return [
                'success' => false,
                'data'    => null,
                'message' => "Task with ID {$taskId} not found."
            ];
        }

        return [
            'success' => true,
            'data'    => $updated,
            'message' => 'Task reset to pending. Employee can now re-execute.'
        ];
    }

    /**
     * Log a shift milestone & actual KPI progress for a goal (Stage 3 Monitoring)
     */
    public function logMilestone(array $payload): array
    {
        $id = $payload['id'] ?? $payload['goal_id'] ?? null;
        $milestoneTitle = trim($payload['milestone_title'] ?? $payload['title'] ?? '');
        $actualMetric = trim($payload['actual_metric'] ?? '');
        $progress = isset($payload['progress']) ? (int)$payload['progress'] : 85;
        $accomplishments = trim($payload['accomplishments'] ?? '');
        $challenges = trim($payload['challenges'] ?? '');
        $feedback = trim($payload['feedback'] ?? '');
        $supportingEvidence = trim($payload['supporting_evidence'] ?? $payload['evidence'] ?? '');
        $notes = trim($payload['notes'] ?? $payload['supervisor_notes'] ?? '');
        $empId = trim($payload['employee_id'] ?? 'emp-101');

        if (empty($id)) {
            return [
                'success' => false,
                'data'    => null,
                'message' => 'Goal ID is required to log a milestone.'
            ];
        }

        $existing = $this->goalModel->find((string)$id);
        $evidenceUpdate = $actualMetric ? "Milestone: {$milestoneTitle} | Actual: {$actualMetric}" : $milestoneTitle;
        if (!empty($accomplishments)) {
            $evidenceUpdate .= " | Accomplishment: {$accomplishments}";
        }
        if (!empty($supportingEvidence)) {
            $evidenceUpdate .= " | Evidence: {$supportingEvidence}";
        }
        if (!empty($existing['evidence'])) {
            $evidenceUpdate = $existing['evidence'] . "\n• " . $evidenceUpdate;
        }

        $updateData = [
            'evidence' => $evidenceUpdate
        ];
        if (!empty($notes) || !empty($feedback)) {
            $updateData['supervisor_notes'] = $notes ?: $feedback;
        }
        if ($progress >= 100) {
            $updateData['status'] = 'Completed';
        }

        $updated = $this->goalModel->update((string)$id, $updateData);

        // Insert milestone record into performance_monitoring table with foreign keys
        try {
            $this->monitoringModel->logMilestone([
                'goal_id'             => $id,
                'employee_id'         => $empId,
                'milestone_title'     => $milestoneTitle,
                'actual_metric'       => $actualMetric,
                'progress'            => $progress,
                'accomplishments'     => $accomplishments,
                'challenges'          => $challenges,
                'feedback'            => $feedback,
                'supporting_evidence' => $supportingEvidence,
                'supervisor_notes'    => $notes
            ]);
        } catch (\Throwable $e) {
            error_log('Error logging to performance_monitoring: ' . $e->getMessage());
        }

        // Send real-time notification to Associate & Supervisor
        try {
            $this->notificationModel->createNotification([
                'recipient_role' => 'Associate',
                'user_id'        => $empId,
                'type'           => 'milestone_logged',
                'title'          => 'Shift Milestone Logged 🎯',
                'message'        => "Milestone \"{$milestoneTitle}\" recorded with metric \"{$actualMetric}\" ({$progress}% Target Progress).",
                'related_id'     => $id,
                'goal_id'        => is_numeric($id) ? (int)$id : null
            ]);
        } catch (\Throwable $e) {
            error_log('Milestone notification error: ' . $e->getMessage());
        }

        return [
            'success' => true,
            'data'    => $updated,
            'message' => "Milestone successfully recorded for Goal #{$id}."
        ];
    }

    /**
     * Get dynamic Monitoring Stage Data strictly built from approved performance_goals, tasks & monitoring
     */
    public function getMonitoringData(array $payload = []): array
    {
        $allGoals = $this->goalModel->getGoals();
        $enrichedGoals = $this->enrichGoalsWithTasks($allGoals);
        $allLogs = $this->monitoringModel->getMonitoringLogs();
        $allTasks = $this->taskModel->all();
        $users = $this->authModel->all();

        // Filter ONLY approved (active, not completed) goals for Phase 3-7 Monitoring and Evaluation
        $approvedGoals = array_values(array_filter($enrichedGoals, function ($g) {
            $st = strtolower(trim($g['status'] ?? ''));
            return $st === 'approved';
        }));

        // Map users by id and employee_code
        $userMap = [];
        foreach ($users as $u) {
            if (!empty($u['id'])) $userMap[strtolower($u['id'])] = $u;
            if (!empty($u['employee_code'])) $userMap[strtolower($u['employee_code'])] = $u;
        }

        // Group approved goals strictly by employee_id from performance_goals table
        $empGoalsMap = [];
        foreach ($approvedGoals as $g) {
            $eId = strtolower(trim($g['employee_id'] ?? 'emp-101'));
            if (!isset($empGoalsMap[$eId])) {
                $empGoalsMap[$eId] = [];
            }
            $empGoalsMap[$eId][] = $g;
        }

        // Build roster dynamically ONLY for employees with approved performance goals
        $roster = [];
        foreach ($empGoalsMap as $eId => $goals) {
            $user = $userMap[$eId] ?? null;
            $name = $user['full_name'] ?? ($eId === 'emp-101' ? 'Maria Santos' : ($eId === 'emp-102' ? 'Chef Marco Rossi' : ucfirst($eId)));
            $pos = $user['title'] ?? ($goals[0]['department'] ?? 'Associate');
            $dept = $goals[0]['department'] ?? ($user['department'] ?? 'Hotel Operations');
            
            // Calculate dynamic progress directly from task completion ratios of approved goals
            $totalGoalProgress = 0;
            $approvedCount = count($goals);

            foreach ($goals as $g) {
                $totalGoalProgress += ($g['task_progress'] ?? 0);
            }

            $overallProgress = count($goals) > 0 ? (int)round($totalGoalProgress / count($goals)) : 0;
            $statusStr = $overallProgress >= 90 ? 'Exceeding' : ($overallProgress >= 70 ? 'On Track' : 'Needs Support');

            $empLogs = array_values(array_filter($allLogs, fn($l) => strtolower(trim($l['employee_id'] ?? '')) === $eId));
            $empTasks = array_values(array_filter($allTasks, fn($t) => strtolower(trim($t['employee_id'] ?? '')) === $eId));

            $evalRecord = $this->evaluationModel->getEvaluationByEmployee($eId);
            $evalStatus = $evalRecord['status'] ?? 'Pending';
            $selfRating = isset($evalRecord['self_rating']) ? (float)$evalRecord['self_rating'] : ($eId === 'emp-102' ? 4.7 : 4.3);
            $mgrRating = isset($evalRecord['supervisor_rating']) && $evalRecord['supervisor_rating'] > 0 ? (float)$evalRecord['supervisor_rating'] : 4.8;
            $tierLabel = $evalRecord['tier_label'] ?? ($mgrRating >= 4.5 ? 'Master Tier' : 'Proficient');

            $roster[] = [
                    'id'                 => $eId,
                    'name'               => $name,
                    'position'           => $pos,
                    'department'         => $dept,
                    'avatar'             => strtoupper(substr($name, 0, 2)),
                    'avatarBg'           => $eId === 'emp-102' ? 'bg-amber-600' : 'bg-primary',
                    'attendance'         => ['present' => 22, 'absent' => 1, 'total' => 23, 'percentage' => '95.6%'],
                    'selfRating'         => $selfRating,
                    'managerRating'      => $mgrRating,
                    'supervisorRating'   => $mgrRating,
                    'customerRating'     => 4.9,
                    'tierLabel'          => $tierLabel,
                    'goalsCount'         => count($goals),
                    'approvedCount'      => $approvedCount,
                    'goals'              => $goals,
                    'tasks'              => $empTasks,
                    'monitoringLogs'     => $empLogs,
                    'monitoringProgress' => $overallProgress,
                    'monitoringStatus'   => $statusStr,
                    'evaluationStatus'   => $evalStatus,
                    'evaluationRecord'   => $evalRecord
                ];
        }

        return [
            'success' => true,
            'data'    => [
                'roster'          => $roster,
                'total_employees' => count($roster),
                'total_goals'     => count($approvedGoals),
                'tasks'           => $allTasks,
                'logs'            => $allLogs
            ],
            'message' => 'Monitoring data dynamically loaded with approved goals, tasks and live progress calculations.'
        ];
    }

    // =========================================================================
    // 10. EVALUATION & MULTI-FACTOR APPRAISAL (DATABASE DRIVEN)
    // =========================================================================

    /**
     * Get all performance evaluations from database
     */
    public function getEvaluations(array $payload = []): array
    {
        $evaluations = $this->evaluationModel->getEvaluations($payload);
        return [
            'success' => true,
            'data'    => [
                'evaluations' => $evaluations,
                'total'       => count($evaluations)
            ],
            'message' => 'Evaluations retrieved successfully from database.'
        ];
    }

    /**
     * Get single employee evaluation with approved goals & criteria
     */
    public function getEvaluation(array $payload): array
    {
        $empId = $payload['employee_id'] ?? $payload['id'] ?? 'emp-101';
        $evaluation = $this->evaluationModel->getEvaluationByEmployee($empId);

        // Fetch employee's approved goals to construct criteria
        $allGoals = $this->enrichGoalsWithTasks($this->goalModel->getGoalsByEmployee($empId));
        $approvedGoals = array_values(array_filter($allGoals, function ($g) {
            $st = strtolower(trim($g['status'] ?? ''));
            return in_array($st, ['approved', 'completed']);
        }));

        return [
            'success' => true,
            'data'    => [
                'evaluation' => $evaluation,
                'goals'      => $approvedGoals
            ],
            'message' => "Evaluation for {$empId} retrieved successfully."
        ];
    }

    /**
     * Submit supervisor appraisal scoring & save to database
     */
    public function submitAppraisal(array $payload): array
    {
        $empId = $payload['employee_id'] ?? 'emp-101';
        $saved = $this->evaluationModel->saveSupervisorAppraisal($payload);

        // Create notification for employee
        $score = $saved['supervisor_rating'] ?? 4.60;
        $this->notificationModel->create([
            'id' => 'notif-' . bin2hex(random_bytes(4)),
            'user_id' => $empId,
            'type' => 'performance',
            'title' => 'Performance Appraisal Endorsed',
            'message' => "Your supervisor has submitted and endorsed your formal performance appraisal with an overall score of {$score} / 5.0 ({$saved['tier_label']}).",
            'is_read' => false,
            'created_at' => date('c')
        ]);

        return [
            'success' => true,
            'data'    => $saved,
            'message' => "Formal appraisal successfully saved to database with score {$score}."
        ];
    }

    /**
     * Submit self-assessment ratings
     */
    public function submitSelfAssessment(array $payload): array
    {
        $empId = $payload['employee_id'] ?? 'emp-101';
        $saved = $this->evaluationModel->saveSelfAssessment($payload);

        return [
            'success' => true,
            'data'    => $saved,
            'message' => "Self-assessment successfully recorded in database."
        ];
    }

    /**
     * Calibrate 1-on-1 performance review
     */
    public function calibrateEvaluation(array $payload): array
    {
        $empId = $payload['employee_id'] ?? 'emp-101';
        $saved = $this->evaluationModel->calibrateEvaluation($payload);

        return [
            'success' => true,
            'data'    => $saved,
            'message' => "1-on-1 performance calibration successfully recorded."
        ];
    }

    /**
     * Increment retry_count for a goal or for all goals of an employee
     */
    public function incrementRetryCount(array $payload): array
    {
        $goalId = $payload['goal_id'] ?? $payload['id'] ?? null;
        $empId = $payload['employee_id'] ?? null;

        if (!empty($goalId)) {
            $updated = $this->goalModel->incrementRetryCount($goalId);
            return [
                'success' => true,
                'data'    => $updated,
                'message' => "Goal retry count incremented."
            ];
        }

        if (!empty($empId)) {
            $updated = $this->goalModel->incrementEmployeeGoalsRetryCount($empId);
            return [
                'success' => true,
                'data'    => $updated,
                'message' => "Employee active goals retry count incremented."
            ];
        }

        return [
            'success' => false,
            'data'    => null,
            'message' => "Goal ID or Employee ID required to increment retry count."
        ];
    }

    /**
     * Execute retry plan: increment retry count and reset completed tasks for re-execution
     */
    public function retryPlan(array $payload): array
    {
        $empId = $payload['employee_id'] ?? 'emp-101';
        $goals = $this->goalModel->getGoalsByEmployee($empId);

        $maxRetry = 0;
        foreach ($goals as $g) {
            $r = isset($g['retry_count']) ? (int)$g['retry_count'] : 0;
            if ($r > $maxRetry) $maxRetry = $r;
        }

        // If retry_count is more than 2 (> 2, i.e. 3 or more), do not allow monitoring loop
        if ($maxRetry >= 2) {
            return [
                'success' => false,
                'needs_formal_training' => true,
                'retry_count' => $maxRetry,
                'message' => "Retry limit exceeded ({$maxRetry}/2). Mandatory formal training required instead of monitoring."
            ];
        }

        // Increment retry count on all goals
        $updatedGoals = $this->goalModel->incrementEmployeeGoalsRetryCount($empId);

        return [
            'success' => true,
            'needs_formal_training' => false,
            'retry_count' => $maxRetry + 1,
            'data'    => $updatedGoals,
            'message' => "Plan retried (Attempt " . ($maxRetry + 1) . "). Tasks prepared for re-monitoring."
        ];
    }

    /**
     * Delete a single performance goal
     */
    public function deleteGoal(array $payload): array
    {
        $id = $payload['id'] ?? $payload['goal_id'] ?? null;
        if (empty($id)) {
            return [
                'success' => false,
                'data'    => null,
                'message' => 'Validation error: Goal ID is required for deletion.'
            ];
        }

        $deleted = $this->goalModel->deleteGoal((string)$id);
        return [
            'success' => $deleted,
            'data'    => ['id' => $id],
            'message' => $deleted ? "Performance objective #{$id} deleted successfully." : "Failed to delete goal #{$id}."
        ];
    }

    /**
     * Bulk delete multiple performance goals
     */
    public function bulkDeleteGoals(array $payload): array
    {
        $ids = $payload['ids'] ?? [];
        if (empty($ids) || !is_array($ids)) {
            return [
                'success' => false,
                'data'    => null,
                'message' => 'Validation error: List of Goal IDs is required for bulk deletion.'
            ];
        }

        $deleted = $this->goalModel->bulkDeleteGoals($ids);
        $count = count($ids);
        return [
            'success' => $deleted,
            'count'   => $count,
            'message' => "{$count} performance objectives deleted successfully."
        ];
    }

    /**
     * Get list of supervisors/leaders from users table for goal assignment
     */
    public function getSupervisors(array $payload = []): array
    {
        $users = $this->authModel->all();
        $supervisors = array_values(array_filter($users, function ($u) {
            $role = strtolower($u['role'] ?? '');
            $roleKey = strtolower($u['role_key'] ?? '');
            return in_array($role, ['supervisor', 'manager', 'lead', 'hradmin', 'generalmanager', 'depthead', 'director']) ||
                   in_array($roleKey, ['manager', 'hr', 'executive', 'lead']);
        }));

        // If filtered list is empty, fallback to returning all active users
        if (empty($supervisors)) {
            $supervisors = $users;
        }

        return [
            'success' => true,
            'data'    => $supervisors,
            'count'   => count($supervisors),
            'message' => 'Supervisors retrieved successfully from database.'
        ];
    }

    /**
     * Award Performance XP to xp_ledger based on rating
     * 3.0-3.9: 5 pts, 4.0-4.9: 8 pts, 5.0: 20 pts
     */
    public function awardPerformanceXP(array $payload): array
    {
        $employeeId = $payload['employee_id'] ?? 'emp-101';
        $evalId = $payload['performance_eval_id'] ?? $payload['eval_id'] ?? null;
        $rating = isset($payload['rating']) ? (float)$payload['rating'] : 4.5;

        // Deterministic XP calculation:
        // 5 points if 3-3.9 rating, 8 points if 4-4.9, 20 pts if 5.0
        if ($rating >= 5.0) {
            $points = 20;
        } elseif ($rating >= 4.0) {
            $points = 8;
        } elseif ($rating >= 3.0) {
            $points = 5;
        } else {
            $points = 0;
        }

        if (isset($payload['points']) && is_numeric($payload['points'])) {
            $points = (int)$payload['points'];
        }

        // Get employee current balance
        $user = $this->authModel->find($employeeId) ?: $this->authModel->findByEmployeeCode($employeeId);
        $currentXP = isset($user['total_xp']) ? (int)$user['total_xp'] : 450;
        $balanceAfter = $currentXP + $points;

        $ledgerEntry = [
            'id'                  => 'xp-' . substr(bin2hex(random_bytes(6)), 0, 10),
            'employee_id'         => $employeeId,
            'source_type'         => 'performance',
            'performance_eval_id' => $evalId,
            'points'              => $points,
            'balance_after'       => $balanceAfter,
            'description'         => $payload['description'] ?? "Performance appraisal recognition kudos (+{$points} XP)",
            'created_at'          => date('c')
        ];

        // Insert into xp_ledger in Supabase
        $res = supabaseRequest('xp_ledger', 'POST', $ledgerEntry, true);

        // Update user's total_xp
        if ($user && isset($user['id'])) {
            $this->authModel->update($user['id'], [
                'total_xp' => $balanceAfter
            ]);
        }

        // Mark active goals for the employee to 'Completed' in performance_goals
        try {
            $this->goalModel->markEmployeeGoalsCompleted($employeeId);
        } catch (\Throwable $e) {
            error_log('Error marking goals completed during awardPerformanceXP: ' . $e->getMessage());
        }

        return [
            'success'       => true,
            'data'          => $ledgerEntry,
            'points_awarded'=> $points,
            'balance_after' => $balanceAfter,
            'message'       => "Awarded +{$points} XP to {$employeeId} and set performance goal to Completed."
        ];
    }

    /**
     * Mark performance goal as completed (transitions cycle & frees employee to set new goal)
     */
    public function markGoalCompleted(array $payload): array
    {
        $id = $payload['id'] ?? $payload['goal_id'] ?? null;
        $empId = $payload['employee_id'] ?? null;

        if (empty($id)) {
            return [
                'success' => false,
                'data'    => null,
                'message' => 'Goal ID is required to mark as completed.'
            ];
        }

        $updated = $this->goalModel->updateStatus((string)$id, 'Completed', 'Performance cycle finished and archived.');

        return [
            'success' => true,
            'data'    => $updated,
            'message' => "Performance goal #{$id} successfully marked as Completed! Next cycle is now ready."
        ];
    }
}
