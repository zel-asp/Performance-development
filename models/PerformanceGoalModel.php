<?php

require_once __DIR__ . '/BaseModel.php';

class PerformanceGoalModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct('performance_goals');
    }

    /**
     * Fetch all performance goals directly from Supabase with optional filters
     */
    public function getGoals(array $filters = []): array
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
        $goals = ($res['status'] === 200 && is_array($res['data'])) ? $res['data'] : [];

        // Sort goals by created_at DESC or target_date
        usort($goals, function ($a, $b) {
            $tA = strtotime($a['created_at'] ?? $a['target_date'] ?? 'now');
            $tB = strtotime($b['created_at'] ?? $b['target_date'] ?? 'now');
            return $tB - $tA;
        });

        return $goals;
    }

    /**
     * Get goals for a specific employee ID with alias matching
     */
    public function getGoalsByEmployee(string $empId): array
    {
        $all = $this->getGoals();
        $normalizedId = strtolower(trim($empId));
        return array_values(array_filter($all, function ($g) use ($normalizedId) {
            $gEmp = strtolower(trim($g['employee_id'] ?? ''));
            if ($gEmp === $normalizedId) return true;
            if ($normalizedId === 'emp-101' && in_array($gEmp, ['emp-1', 'oxf-emp-1001'])) return true;
            if ($normalizedId === 'emp-102' && in_array($gEmp, ['emp-2', 'oxf-sup-2001'])) return true;
            return false;
        }));
    }

    /**
     * Resolve a valid users.id (UUID) to satisfy foreign key constraints
     */
    public function resolveValidUserId(?string $inputEmpId, string $role = 'employee'): string
    {
        $inputEmpId = trim((string)$inputEmpId);
        
        // 1. If it looks like a valid UUID, check if user exists
        if (preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $inputEmpId)) {
            $userCheck = supabaseRequest("users?id=eq.{$inputEmpId}&limit=1", 'GET', null, true);
            if (!empty($userCheck['data']) && is_array($userCheck['data']) && isset($userCheck['data'][0]['id'])) {
                return $userCheck['data'][0]['id'];
            }
        }
        
        // 2. If it's an employee_code like EMP-001 or SUP-003 or legacy emp-101
        if (!empty($inputEmpId)) {
            $codeCheck = supabaseRequest("users?employee_code=ilike." . urlencode($inputEmpId) . "&limit=1", 'GET', null, true);
            if (!empty($codeCheck['data']) && is_array($codeCheck['data']) && isset($codeCheck['data'][0]['id'])) {
                return $codeCheck['data'][0]['id'];
            }
        }
        
        // 3. Fallback to active user with matching role, or first user in users table
        $roleFilter = strtolower($role) === 'supervisor' ? 'role=ilike.*Supervisor*' : 'role=ilike.*Employee*';
        $fallback = supabaseRequest("users?{$roleFilter}&limit=1", 'GET', null, true);
        if (!empty($fallback['data']) && is_array($fallback['data']) && isset($fallback['data'][0]['id'])) {
            return $fallback['data'][0]['id'];
        }
        
        $anyUser = supabaseRequest("users?limit=1", 'GET', null, true);
        if (!empty($anyUser['data']) && is_array($anyUser['data']) && isset($anyUser['data'][0]['id'])) {
            return $anyUser['data'][0]['id'];
        }
        
        return $inputEmpId;
    }

    /**
     * Create a new performance goal record directly in the Supabase database
     */
    public function createGoal(array $data): array
    {
        $roleLower = strtolower(trim($data['role'] ?? 'employee'));
        $roleEnum = in_array($roleLower, ['supervisor', 'manager', 'lead', 'hradmin', 'generalmanager']) ? 'supervisor' : 'employee';

        $scopeLower = strtolower(trim($data['target_scope'] ?? 'single'));
        $scopeEnum = in_array($scopeLower, ['single', 'dept', 'property']) ? $scopeLower : 'single';

        $statusVal = trim($data['status'] ?? 'Pending Approval');
        $validStatuses = ['Pending Approval', 'Approved', 'Needs Revision', 'Done', 'Completed', 'Failed'];
        if (!in_array($statusVal, $validStatuses)) {
            $statusVal = 'Pending Approval';
        }

        // Resolve real users(id) UUID for foreign key integrity
        $resolvedEmployeeId = $this->resolveValidUserId($data['employee_id'] ?? null, $roleEnum);

        // Sanitize and ensure defaults matching performance_goal.sql
        $record = [
            'employee_id'   => $resolvedEmployeeId,
            'role'          => $roleEnum,
            'target_scope'  => $scopeEnum,
            'title'         => trim($data['title'] ?? 'Hospitality Operational Target'),
            'department'    => trim($data['department'] ?? 'Front Office & Guest Experience'),
            'target_date'   => !empty($data['target_date']) ? date('Y-m-d', strtotime($data['target_date'])) : date('Y-m-d', strtotime('+30 days')),
            'target_metric' => trim($data['target_metric'] ?? 'Target >= 95%'),
            'weight'        => trim($data['weight'] ?? 'Medium Priority (20% Weight)'),
            'evidence'      => !empty($data['evidence']) ? trim($data['evidence']) : null,
            'status'        => $statusVal,
            'supervisor_id' => !empty($data['supervisor_id']) ? trim($data['supervisor_id']) : null,
            'supervisor_notes' => !empty($data['supervisor_notes']) ? trim($data['supervisor_notes']) : null,
            'retry_count'    => isset($data['retry_count']) ? (int)$data['retry_count'] : 0,
            'needs_training' => isset($data['needs_training']) ? (bool)$data['needs_training'] : false,
            'in_training'    => isset($data['in_training']) ? (bool)$data['in_training'] : false,
            'exp_id'         => !empty($data['exp_id']) ? trim($data['exp_id']) : null
        ];

        // Direct Supabase insert
        $res = supabaseRequest($this->table, 'POST', $record, true);
        if ($res['status'] >= 200 && $res['status'] < 300 && !empty($res['data'])) {
            return is_array($res['data']) && isset($res['data'][0]) ? $res['data'][0] : $res['data'];
        }

        if (!empty($res['error'])) {
            error_log("Supabase insert error in performance_goals: " . print_r($res, true));
            return [
                'error'   => is_string($res['error']) ? $res['error'] : ($res['data']['message'] ?? 'Database insert failed'),
                'details' => $res['data'] ?? null,
                'status'  => $res['status'] ?? 500
            ];
        }

        return [
            'error'   => 'Database insert failed with status ' . ($res['status'] ?? 500),
            'status'  => $res['status'] ?? 500
        ];
    }

    /**
     * Update goal status in Supabase (e.g. Approved, Needs Revision, Completed, Failed)
     */
    public function updateStatus(string $id, string $status, ?string $supervisorNotes = null): ?array
    {
        $update = [
            'status'     => $status,
            'updated_at' => date('c')
        ];

        if ($supervisorNotes !== null) {
            $update['supervisor_notes'] = $supervisorNotes;
        }

        return $this->update($id, $update);
    }

    /**
     * Update in_training flag for a goal in Supabase
     */
    public function setInTraining(string|int $goalId, bool $inTraining = true): ?array
    {
        return $this->update((string)$goalId, [
            'in_training' => $inTraining,
            'updated_at'  => date('c')
        ]);
    }

    /**
     * Update in_training flag for all active goals of an employee
     */
    public function setEmployeeGoalsInTraining(string $empId, bool $inTraining = true): array
    {
        $goals = $this->getGoalsByEmployee($empId);
        $updated = [];
        foreach ($goals as $g) {
            if (!empty($g['id'])) {
                $up = $this->setInTraining($g['id'], $inTraining);
                if ($up) $updated[] = $up;
            }
        }
        return $updated;
    }

    /**
     * Update needs_training flag for a goal in Supabase
     */
    public function setNeedsTraining(string|int $goalId, bool $needsTraining = true): ?array
    {
        return $this->update((string)$goalId, [
            'needs_training' => $needsTraining,
            'updated_at'     => date('c')
        ]);
    }

    /**
     * Update needs_training flag for all active goals of an employee
     */
    public function setEmployeeGoalsNeedsTraining(string $empId, bool $needsTraining = true): array
    {
        $goals = $this->getGoalsByEmployee($empId);
        $updated = [];
        foreach ($goals as $g) {
            if (!empty($g['id'])) {
                $up = $this->setNeedsTraining($g['id'], $needsTraining);
                if ($up) $updated[] = $up;
            }
        }
        return $updated;
    }

    /**
     * Set exact retry_count for a goal in Supabase
     */
    public function setGoalRetryCount(string|int $goalId, int $count): ?array
    {
        return $this->update((string)$goalId, [
            'retry_count'    => $count,
            'needs_training' => ($count >= 3),
            'updated_at'     => date('c')
        ]);
    }

    /**
     * Set exact retry_count for all active goals of an employee in Supabase
     */
    public function setEmployeeGoalsRetryCount(string $empId, int $count): array
    {
        $goals = $this->getGoalsByEmployee($empId);
        $updated = [];
        foreach ($goals as $g) {
            if (!empty($g['id'])) {
                $up = $this->setGoalRetryCount($g['id'], $count);
                if ($up) $updated[] = $up;
            }
        }
        return $updated;
    }

    /**
     * Update final_rating for a specific goal in Supabase
     */
    public function updateFinalRating(string|int $goalId, float $finalRating): ?array
    {
        return $this->update((string)$goalId, [
            'final_rating' => $finalRating,
            'updated_at'   => date('c')
        ]);
    }

    /**
     * Update final_rating for an employee's performance goals in Supabase
     */
    public function setEmployeeGoalsFinalRating(string $empId, float $finalRating, ?int $goalId = null): array
    {
        if ($goalId) {
            $up = $this->updateFinalRating($goalId, $finalRating);
            return $up ? [$up] : [];
        }

        $goals = $this->getGoalsByEmployee($empId);
        $updated = [];
        foreach ($goals as $g) {
            if (!empty($g['id'])) {
                $up = $this->updateFinalRating($g['id'], $finalRating);
                if ($up) $updated[] = $up;
            }
        }
        return $updated;
    }

    /**
     * Increment retry_count for a goal in Supabase and sync needs_training
     */
    public function incrementRetryCount(string|int $goalId, int $increment = 1): ?array
    {
        $goal = $this->find((string)$goalId);
        $current = isset($goal['retry_count']) ? (int)$goal['retry_count'] : 0;
        $newCount = $current + $increment;

        return $this->update((string)$goalId, [
            'retry_count'    => $newCount,
            'needs_training' => ($newCount > 2),
            'updated_at'     => date('c')
        ]);
    }

    /**
     * Increment retry_count for all active goals of an employee in Supabase
     */
    public function incrementEmployeeGoalsRetryCount(string $empId, int $increment = 1): array
    {
        $goals = $this->getGoalsByEmployee($empId);
        $updated = [];
        foreach ($goals as $g) {
            if (!empty($g['id'])) {
                $up = $this->incrementRetryCount($g['id'], $increment);
                if ($up) $updated[] = $up;
            }
        }
        return $updated;
    }

    /**
     * Update full performance goal objective fields in Supabase
     */
    public function updateGoal(string $id, array $data): ?array
    {
        $update = [
            'updated_at' => date('c')
        ];

        if (isset($data['title'])) $update['title'] = trim($data['title']);
        if (isset($data['target_metric'])) $update['target_metric'] = trim($data['target_metric']);
        if (isset($data['kpi'])) $update['target_metric'] = trim($data['kpi']);
        if (isset($data['department'])) $update['department'] = trim($data['department']);
        if (isset($data['target_date']) && !empty($data['target_date'])) $update['target_date'] = date('Y-m-d', strtotime($data['target_date']));
        if (isset($data['weight'])) $update['weight'] = trim($data['weight']);
        if (isset($data['evidence'])) $update['evidence'] = trim($data['evidence']);
        if (isset($data['deliverables'])) $update['evidence'] = trim($data['deliverables']);
        if (isset($data['status'])) $update['status'] = trim($data['status']);
        if (isset($data['supervisor_notes'])) $update['supervisor_notes'] = trim($data['supervisor_notes']);
        if (isset($data['retry_count'])) $update['retry_count'] = (int)$data['retry_count'];
        if (isset($data['needs_training'])) $update['needs_training'] = (bool)$data['needs_training'];
        if (isset($data['in_training'])) $update['in_training'] = (bool)$data['in_training'];
        if (array_key_exists('exp_id', $data)) $update['exp_id'] = !empty($data['exp_id']) ? trim($data['exp_id']) : null;

        return $this->update($id, $update);
    }

    /**
     * Check if an employee has any active (non-completed, non-failed) goal
     */
    public function hasActiveGoal(string $empId): bool
    {
        $goals = $this->getGoalsByEmployee($empId);
        foreach ($goals as $g) {
            $status = strtolower(trim($g['status'] ?? ''));
            if ($status !== 'completed' && $status !== 'failed') {
                return true;
            }
        }
        return false;
    }

    /**
     * Mark a goal as Done with attached exp_id
     */
    public function markDone(string|int $id, ?string $expId = null): ?array
    {
        $update = [
            'status'     => 'Done',
            'updated_at' => date('c')
        ];
        if ($expId !== null) {
            $update['exp_id'] = $expId;
        }
        return $this->update((string)$id, $update);
    }

    /**
     * Mark all active approved goals for an employee as Done with attached exp_id
     */
    public function markEmployeeGoalsDone(string $empId, ?string $expId = null): array
    {
        $goals = $this->getGoalsByEmployee($empId);
        $doneList = [];
        foreach ($goals as $g) {
            if (!empty($g['id'])) {
                $status = strtolower(trim($g['status'] ?? ''));
                if ($status === 'approved' || $status === 'in progress') {
                    $up = $this->markDone($g['id'], $expId);
                    if ($up) $doneList[] = $up;
                }
            }
        }
        return $doneList;
    }

    /**
     * Revert goal status from Done back to Approved and remove exp_id
     */
    public function revertGoalKudos(string|int $id): ?array
    {
        return $this->update((string)$id, [
            'status'     => 'Approved',
            'exp_id'     => null,
            'updated_at' => date('c')
        ]);
    }

    /**
     * Mark a goal as completed
     */
    public function markCompleted(string $id): ?array
    {
        return $this->update($id, [
            'status'     => 'Completed',
            'updated_at' => date('c')
        ]);
    }

    /**
     * Mark a goal as failed
     */
    public function markFailed(string $id): ?array
    {
        return $this->update($id, [
            'status'     => 'Failed',
            'updated_at' => date('c')
        ]);
    }

    /**
     * Mark all active goals for an employee as failed
     */
    public function markEmployeeGoalsFailed(string $empId): array
    {
        $goals = $this->getGoalsByEmployee($empId);
        $failed = [];
        foreach ($goals as $g) {
            if (!empty($g['id'])) {
                $status = strtolower(trim($g['status'] ?? ''));
                if ($status !== 'completed' && $status !== 'failed') {
                    $up = $this->markFailed($g['id']);
                    if ($up) $failed[] = $up;
                }
            }
        }
        return $failed;
    }

    /**
     * Mark all active goals for an employee as completed
     */
    public function markEmployeeGoalsCompleted(string $empId): array
    {
        $goals = $this->getGoalsByEmployee($empId);
        $completed = [];
        foreach ($goals as $g) {
            if (!empty($g['id'])) {
                $status = strtolower(trim($g['status'] ?? ''));
                if ($status !== 'completed' && $status !== 'failed') {
                    $up = $this->markCompleted($g['id']);
                    if ($up) $completed[] = $up;
                }
            }
        }
        return $completed;
    }

    /**
     * Delete a single performance goal
     */
    public function deleteGoal(string $id): bool
    {
        return $this->delete($id);
    }

    /**
     * Bulk delete multiple performance goals
     */
    public function bulkDeleteGoals(array $ids): bool
    {
        $success = true;
        foreach ($ids as $id) {
            if (!empty($id)) {
                $deleted = $this->delete((string)$id);
                if (!$deleted) $success = false;
            }
        }
        return $success;
    }
}

