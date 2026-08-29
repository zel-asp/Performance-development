<?php
require_once __DIR__ . '/BaseModel.php';

class SuccessionModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct('succession_positions');
    }

    public function getPositions(): array
    {
        return $this->all();
    }

    public function getCandidates(): array
    {
        $res = supabaseRequest('succession_candidates', 'GET');
        return (is_array($res['data'] ?? null) && !isset($res['data']['code'])) ? $res['data'] : [];
    }

    public function updateCandidateFlag(string $id, string $flag, string $notes): bool
    {
        $payload = [
            'hr_readiness_flag' => $flag,
            'notes'             => $notes,
            'updated_at'        => date('c')
        ];
        
        $res = supabaseRequest('succession_candidates?id=eq.' . urlencode($id), 'PATCH', $payload);
        return isset($res['status']) && ($res['status'] >= 200 && $res['status'] < 300);
    }

    public function createSuccessionPosition(array $data): array
    {
        $record = [
            'id'                     => $data['id'] ?? ('role-' . substr(bin2hex(random_bytes(3)), 0, 6)),
            'title'                  => $data['title'] ?? 'New Leadership Role',
            'dept'                   => $data['dept'] ?? 'Front Office',
            'incumbent_name'         => $data['incumbentName'] ?? 'Unassigned',
            'planned_transition'     => $data['plannedTransition'] ?? '12 Months',
            'risk_of_loss'           => $data['riskOfLoss'] ?? 'Medium',
            'bench_strength'         => $data['benchStrength'] ?? 'Pipeline Active',
            'required_competencies'  => is_array($data['requiredCompetencies'] ?? null) ? json_encode($data['requiredCompetencies']) : ($data['requiredCompetencies'] ?? '{}'),
            'min_performance_rating' => (float)($data['minPerformanceRating'] ?? 4.0),
            'target_readiness'       => $data['targetReadiness'] ?? 'Ready in 6-12M',
            'criticality'            => $data['criticality'] ?? 'High',
            'created_at'             => date('c'),
            'updated_at'             => date('c')
        ];

        return $this->create($record);
    }
}
