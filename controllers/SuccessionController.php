<?php
require_once __DIR__ . '/../models/SuccessionModel.php';
require_once __DIR__ . '/../config/config.php';

class SuccessionController
{
    private SuccessionModel $successionModel;

    public function __construct()
    {
        $this->successionModel = new SuccessionModel();
    }

    /**
     * Get complete succession planning overview with live database metrics
     */
    public function getSuccessionOverview(): array
    {
        $positions = $this->successionModel->getPositions();
        $candidates = $this->successionModel->getCandidates();
        $nineBoxRoster = $this->successionModel->get9BoxRoster();

        // Calculate KPI summary
        $rolesCount = count($positions);
        $readyNowCount = 0;
        $pipelineCount = 0;

        foreach ($candidates as $c) {
            $flag = $c['hrReadinessFlag'] ?? '';
            if ($flag === 'Ready Now') {
                $readyNowCount++;
            } elseif (in_array($flag, ['Ready in 1–2 years', 'Ready in 1-2 Years'])) {
                $pipelineCount++;
            }
        }

        // Fetch employee and department list for modal dropdowns
        $deptRes = supabaseRequest('departments', 'GET', null, true);
        $depts = is_array($deptRes['data'] ?? null) ? $deptRes['data'] : [];
        $deptMap = [];
        foreach ($depts as $d) {
            $dId = $d['id'] ?? '';
            if ($dId) $deptMap[$dId] = $d['name'] ?? 'Operations';
        }

        $empRes = supabaseRequest('employees?order=full_name.asc', 'GET', null, true);
        $employees = is_array($empRes['data'] ?? null) ? $empRes['data'] : [];
        foreach ($employees as &$e) {
            $dId = $e['department_id'] ?? '';
            $e['department'] = $deptMap[$dId] ?? ($e['department'] ?? 'Operations');
        }

        // Fetch XP-Ledger powered talent recommendations
        $recommendations = $this->successionModel->getDepartmentXPRecommendations('all');

        return [
            'success' => true,
            'data' => [
                'positions'       => $positions,
                'candidates'      => $candidates,
                'nineBoxRoster'   => $nineBoxRoster,
                'employees'       => $employees,
                'recommendations' => $recommendations,
                'stats' => [
                    'totalRoles'    => $rolesCount,
                    'readyNowCount' => $readyNowCount,
                    'pipelineCount' => $pipelineCount
                ]
            ]
        ];
    }

    /**
     * Calibrate HR Readiness Flag in Supabase
     */
    public function updateHRFlag(string $candidateId, string $flag, string $notes, string $employeeId = '', string $positionId = ''): array
    {
        if (empty($candidateId) && empty($employeeId)) {
            return ['success' => false, 'message' => 'Candidate ID is required'];
        }
        if (empty($flag)) {
            return ['success' => false, 'message' => 'HR Flag is required'];
        }

        $success = $this->successionModel->updateCandidateFlag($candidateId, $flag, $notes, $employeeId, $positionId);
        return [
            'success' => $success,
            'message' => $success ? "HR Readiness Flag calibrated to '{$flag}' & synced to Supabase" : 'Failed to update HR Flag in Supabase'
        ];
    }

    /**
     * Create a new succession position in Supabase
     */
    public function createPosition(array $data): array
    {
        if (empty($data['title'])) {
            return ['success' => false, 'message' => 'Position title is required'];
        }

        $newPosition = $this->successionModel->createSuccessionPosition($data);
        return [
            'success' => !empty($newPosition),
            'message' => !empty($newPosition) ? 'Succession role created successfully in Supabase' : 'Failed to create succession role',
            'data'    => $newPosition
        ];
    }

    /**
     * Delete a succession position
     */
    public function deletePosition(string $positionId): array
    {
        if (empty($positionId)) {
            return ['success' => false, 'message' => 'Position ID is required'];
        }

        $success = $this->successionModel->deletePosition($positionId);
        return [
            'success' => $success,
            'message' => $success ? 'Position deleted from succession database' : 'Failed to delete position'
        ];
    }

    /**
     * Get department talent recommendations based on XP ledger
     */
    public function getRecommendations(string $dept = 'all'): array
    {
        $recommendations = $this->successionModel->getDepartmentXPRecommendations($dept);
        return [
            'success' => true,
            'data' => $recommendations
        ];
    }

    /**
     * Assign recommended candidate to a succession position
     */
    public function assignSuccessor(array $payload): array
    {
        $positionId = $payload['positionId'] ?? ($payload['position_id'] ?? '');
        $employeeId = $payload['employeeId'] ?? ($payload['employee_id'] ?? '');
        $type = $payload['type'] ?? 'primary';

        if (empty($positionId) || empty($employeeId)) {
            return ['success' => false, 'message' => 'Position ID and Employee ID are required'];
        }

        $success = $this->successionModel->assignSuccessorToPosition($positionId, $employeeId, $type);
        return [
            'success' => $success,
            'message' => $success ? 'Candidate successfully designated on the succession bench' : 'Failed to designate candidate'
        ];
    }
}
