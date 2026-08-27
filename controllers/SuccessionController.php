<?php
require_once __DIR__ . '/../models/SuccessionModel.php';

class SuccessionController
{
    private SuccessionModel $successionModel;

    public function __construct()
    {
        $this->successionModel = new SuccessionModel();
    }

    public function getSuccessionOverview(): array
    {
        $positions = $this->successionModel->getPositions();
        $candidates = $this->successionModel->getCandidates();

        return [
            'success' => true,
            'data' => [
                'positions'  => $positions,
                'candidates' => $candidates
            ]
        ];
    }

    public function updateHRFlag(string $candidateId, string $flag, string $notes): array
    {
        if (empty($candidateId) || empty($flag)) {
            return ['success' => false, 'message' => 'Candidate ID and HR Flag are required'];
        }

        $success = $this->successionModel->updateCandidateFlag($candidateId, $flag, $notes);
        return [
            'success' => $success,
            'message' => $success ? 'HR Readiness Flag calibrated successfully' : 'Failed to update HR Flag in Supabase'
        ];
    }

    public function createPosition(array $data): array
    {
        if (empty($data['title'])) {
            return ['success' => false, 'message' => 'Position title is required'];
        }

        $newPosition = $this->successionModel->createSuccessionPosition($data);
        return [
            'success' => !empty($newPosition),
            'message' => !empty($newPosition) ? 'Succession role created successfully' : 'Failed to create succession role',
            'data'    => $newPosition
        ];
    }
}
