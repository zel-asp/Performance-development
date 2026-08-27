<?php

require_once __DIR__ . '/BaseModel.php';

class PerformanceGoalModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct('performance_goals');
    }

    /**
     * Fetch all performance goals from Supabase with optional filters
     */
    public function getGoals(array $filters = []): array
    {
        $goals = $this->all($filters);

        if (!is_array($goals)) {
            return [];
        }

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
     * Create a new performance goal record directly in the Supabase database
     */
    public function createGoal(array $data): array
    {
        $roleLower = strtolower(trim($data['role'] ?? 'employee'));
        $roleEnum = in_array($roleLower, ['supervisor', 'manager', 'lead', 'hradmin', 'generalmanager']) ? 'supervisor' : 'employee';

        $scopeLower = strtolower(trim($data['target_scope'] ?? 'single'));
        $scopeEnum = in_array($scopeLower, ['single', 'dept', 'property']) ? $scopeLower : 'single';

        $statusVal = trim($data['status'] ?? 'Pending Approval');
        $validStatuses = ['Pending Approval', 'Approved', 'Needs Revision', 'Completed'];
        if (!in_array($statusVal, $validStatuses)) {
            $statusVal = 'Pending Approval';
        }

        // Sanitize and ensure defaults matching performance_goal.sql
        $record = [
            'employee_id'   => !empty($data['employee_id']) ? trim($data['employee_id']) : 'emp-101',
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
            'supervisor_notes' => !empty($data['supervisor_notes']) ? trim($data['supervisor_notes']) : null
        ];

        // Attempt direct Supabase insert
        $res = supabaseRequest($this->table, 'POST', $record, true);
        if ($res['status'] >= 200 && $res['status'] < 300 && !empty($res['data'])) {
            $inserted = is_array($res['data']) && isset($res['data'][0]) ? $res['data'][0] : $res['data'];
            // Sync with local store
            $local = $this->getLocalData();
            $local[] = $inserted;
            $this->saveLocalData($local);
            return $inserted;
        }

        if (!empty($res['error'])) {
            error_log("Supabase insert error in performance_goals: " . print_r($res, true));
        }

        // Fallback local persistence if offline
        $record['id'] = !empty($res['data']['id']) ? $res['data']['id'] : ('goal-' . substr(bin2hex(random_bytes(4)), 0, 8));
        $record['created_at'] = date('Y-m-d H:i:s');
        $record['updated_at'] = date('Y-m-d H:i:s');
        $local = $this->getLocalData();
        $local[] = $record;
        $this->saveLocalData($local);
        return $record;
    }

    /**
     * Update goal status in Supabase (e.g. Approved, Needs Revision, Completed)
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

        return $this->update($id, $update);
    }
}
