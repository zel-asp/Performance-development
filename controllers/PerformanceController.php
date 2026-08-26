<?php

require_once __DIR__ . '/../models/PerformanceGoalModel.php';
require_once __DIR__ . '/../models/PerformanceMonitoringModel.php';
require_once __DIR__ . '/../models/PerformanceTaskModel.php';
require_once __DIR__ . '/../models/AuthModel.php';
require_once __DIR__ . '/../models/NotificationModel.php';

class PerformanceController
{
    private PerformanceGoalModel $goalModel;
    private PerformanceMonitoringModel $monitoringModel;
    private PerformanceTaskModel $taskModel;
    private AuthModel $authModel;
    private NotificationModel $notificationModel;

    public function __construct()
    {
        $this->goalModel = new PerformanceGoalModel();
        $this->monitoringModel = new PerformanceMonitoringModel();
        $this->taskModel = new PerformanceTaskModel();
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
     * Get dynamic Monitoring Stage Data strictly built from performance_goals, tasks & monitoring
     */
    public function getMonitoringData(array $payload = []): array
    {
        $allGoals = $this->goalModel->getGoals();
        $enrichedGoals = $this->enrichGoalsWithTasks($allGoals);
        $allLogs = $this->monitoringModel->getMonitoringLogs();
        $allTasks = $this->taskModel->all();
        $users = $this->authModel->all();

        // Map users by id and employee_code
        $userMap = [];
        foreach ($users as $u) {
            if (!empty($u['id'])) $userMap[strtolower($u['id'])] = $u;
            if (!empty($u['employee_code'])) $userMap[strtolower($u['employee_code'])] = $u;
        }

        // Group goals strictly by employee_id from performance_goals table
        $empGoalsMap = [];
        foreach ($enrichedGoals as $g) {
            $eId = strtolower(trim($g['employee_id'] ?? 'emp-101'));
            if (!isset($empGoalsMap[$eId])) {
                $empGoalsMap[$eId] = [];
            }
            $empGoalsMap[$eId][] = $g;
        }

        // Build roster dynamically ONLY for employees with performance goals
        $roster = [];
        foreach ($empGoalsMap as $eId => $goals) {
            $user = $userMap[$eId] ?? null;
            $name = $user['full_name'] ?? ($eId === 'emp-101' ? 'Maria Santos' : ($eId === 'emp-102' ? 'Chef Marco Rossi' : ucfirst($eId)));
            $pos = $user['title'] ?? ($goals[0]['department'] ?? 'Associate');
            $dept = $goals[0]['department'] ?? ($user['department'] ?? 'Hotel Operations');
            
            // Calculate dynamic progress directly from task completion ratios
            $totalGoalProgress = 0;
            $approvedCount = 0;

            foreach ($goals as $g) {
                $status = $g['status'] ?? 'Pending Approval';
                if ($status === 'Approved' || $status === 'Completed') {
                    $approvedCount++;
                }
                $totalGoalProgress += ($g['task_progress'] ?? 0);
            }

            $overallProgress = count($goals) > 0 ? (int)round($totalGoalProgress / count($goals)) : 0;
            $statusStr = $overallProgress >= 90 ? 'Exceeding' : ($overallProgress >= 70 ? 'On Track' : 'Needs Support');

            $empLogs = array_values(array_filter($allLogs, fn($l) => strtolower(trim($l['employee_id'] ?? '')) === $eId));
            $empTasks = array_values(array_filter($allTasks, fn($t) => strtolower(trim($t['employee_id'] ?? '')) === $eId));

            $roster[] = [
                'id'                 => $eId,
                'name'               => $name,
                'position'           => $pos,
                'department'         => $dept,
                'avatar'             => strtoupper(substr($name, 0, 2)),
                'avatarBg'           => $eId === 'emp-102' ? 'bg-amber-600' : 'bg-primary',
                'attendance'         => ['present' => 22, 'absent' => 1, 'total' => 23, 'percentage' => '95.6%'],
                'managerRating'      => 4.8,
                'customerRating'     => 4.9,
                'goalsCount'         => count($goals),
                'approvedCount'      => $approvedCount,
                'goals'              => $goals,
                'tasks'              => $empTasks,
                'monitoringLogs'     => $empLogs,
                'monitoringProgress' => $overallProgress,
                'monitoringStatus'   => $statusStr,
                'evaluationStatus'   => 'Pending Evaluation'
            ];
        }

        return [
            'success' => true,
            'data'    => [
                'roster'          => $roster,
                'total_employees' => count($roster),
                'total_goals'     => count($enrichedGoals),
                'tasks'           => $allTasks,
                'logs'            => $allLogs
            ],
            'message' => 'Monitoring data dynamically loaded with tasks and live progress calculations.'
        ];
    }
}
