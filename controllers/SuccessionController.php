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

        // Fetch employee list for modal dropdowns
        $empRes = supabaseRequest('employees?order=full_name.asc', 'GET', null, true);
        $employees = is_array($empRes['data'] ?? null) ? $empRes['data'] : [];

        return [
            'success' => true,
            'data' => [
                'positions'     => $positions,
                'candidates'    => $candidates,
                'nineBoxRoster' => $nineBoxRoster,
                'employees'     => $employees,
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
    public function updateHRFlag(string $candidateId, string $flag, string $notes): array
    {
        if (empty($candidateId) || empty($flag)) {
            return ['success' => false, 'message' => 'Candidate ID and HR Flag are required'];
        }

        $success = $this->successionModel->updateCandidateFlag($candidateId, $flag, $notes);
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
}
