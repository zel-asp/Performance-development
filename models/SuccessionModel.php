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
        $positions = $this->all();
        if (empty($positions)) {
            $this->seedInitialPositions();
            $positions = $this->all();
        }
        return $positions;
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
            'primary_successor_id'   => $data['primarySuccessorId'] ?? null,
            'emergency_backup_id'    => $data['emergencyBackupId'] ?? null,
            'status'                 => $data['status'] ?? 'Bench Ready'
        ];

        return $this->create($record);
    }

    public function seedInitialPositions(): void
    {
        $initial = [
            [
                'id'                     => 'role-fo-mgr',
                'title'                  => 'Front Office Assistant Manager',
                'dept'                   => 'Front Office',
                'incumbent_name'         => 'John Marco',
                'planned_transition'     => 'Q1 2027 (6 Months)',
                'risk_of_loss'           => 'Medium (Overseas Transfer)',
                'bench_strength'         => 'Strong (2 Successors)',
                'required_competencies'  => json_encode([
                    'guest_relations'  => 4.8,
                    'pms_systems'       => 4.5,
                    'de_escalation'     => 4.5,
                    'shift_leadership'  => 4.0
                ]),
                'min_performance_rating' => 4.5,
                'primary_successor_id'   => 'emp-101',
                'emergency_backup_id'    => 'emp-102',
                'status'                 => 'Bench Ready'
            ],
            [
                'id'                     => 'role-exec-sous',
                'title'                  => 'Executive Sous Chef',
                'dept'                   => 'Culinary',
                'incumbent_name'         => 'Chef Marco Rossi',
                'planned_transition'     => 'Q3 2027 (12 Months)',
                'risk_of_loss'           => 'Low',
                'bench_strength'         => 'Moderate (1 Successor)',
                'required_competencies'  => json_encode([
                    'haccp_safety'       => 4.8,
                    'culinary_technique' => 4.8,
                    'kitchen_costing'    => 4.2,
                    'shift_leadership'   => 4.2
                ]),
                'min_performance_rating' => 4.5,
                'primary_successor_id'   => 'emp-104',
                'emergency_backup_id'    => 'emp-105',
                'status'                 => 'Pipeline Active'
            ],
            [
                'id'                     => 'role-fb-mgr',
                'title'                  => 'Restaurant Operations Manager',
                'dept'                   => 'F&B Service',
                'incumbent_name'         => 'Antoine Laurent',
                'planned_transition'     => 'Q4 2027 (18 Months)',
                'risk_of_loss'           => 'High (Retirement)',
                'bench_strength'         => 'Emerging (1 Successor)',
                'required_competencies'  => json_encode([
                    'revenue_upsell'      => 4.8,
                    'sommelier_standards' => 4.5,
                    'guest_relations'     => 4.5,
                    'shift_leadership'    => 4.0
                ]),
                'min_performance_rating' => 4.2,
                'primary_successor_id'   => 'emp-106',
                'emergency_backup_id'    => null,
                'status'                 => 'Development Phase'
            ],
            [
                'id'                     => 'role-housekeeping-mgr',
                'title'                  => 'Executive Housekeeper',
                'dept'                   => 'Housekeeping',
                'incumbent_name'         => 'Theresa Ramos',
                'planned_transition'     => 'Q2 2028 (24 Months)',
                'risk_of_loss'           => 'Low',
                'bench_strength'         => 'Developing (2 Successors)',
                'required_competencies'  => json_encode([
                    'room_standards'   => 4.8,
                    'crisis_mgmt'      => 4.5,
                    'inventory_control'=> 4.2,
                    'shift_leadership' => 4.0
                ]),
                'min_performance_rating' => 4.2,
                'primary_successor_id'   => 'emp-107',
                'emergency_backup_id'    => null,
                'status'                 => 'Bench Ready'
            ]
        ];

        foreach ($initial as $pos) {
            $this->create($pos);
        }
    }

    public function seedInitialCandidates(): void
    {
        $initial = [
            [
                'id'                         => 'cand-101',
                'position_id'                => 'role-fo-mgr',
                'employee_id'                => 'emp-101',
                'closed_performance_score'   => 4.8,
                'target_competency_match_pct'=> 95,
                'hr_readiness_flag'          => 'Ready Now',
                'nine_box_grid'              => 'Star Track (Next Lead)',
                'notes'                      => 'Completed Crisis Diplomacy training and demonstrated outstanding leadership during night shift escalations.'
            ],
            [
                'id'                         => 'cand-102',
                'position_id'                => 'role-fo-mgr',
                'employee_id'                => 'emp-102',
                'closed_performance_score'   => 4.6,
                'target_competency_match_pct'=> 88,
                'hr_readiness_flag'          => 'Ready in 1-2 Years',
                'nine_box_grid'              => 'High Performer',
                'notes'                      => 'Strong guest relations skills. Needs additional shift scheduling and PMS audit exposure.'
            ],
            [
                'id'                         => 'cand-104',
                'position_id'                => 'role-exec-sous',
                'employee_id'                => 'emp-104',
                'closed_performance_score'   => 4.5,
                'target_competency_match_pct'=> 86,
                'hr_readiness_flag'          => 'Ready in 1-2 Years',
                'nine_box_grid'              => 'Core Performer',
                'notes'                      => 'Exceptional kitchen technique. Enrolled in F&B Costing and Inventory Leadership module.'
            ],
            [
                'id'                         => 'cand-106',
                'position_id'                => 'role-fb-mgr',
                'employee_id'                => 'emp-106',
                'closed_performance_score'   => 4.2,
                'target_competency_match_pct'=> 74,
                'hr_readiness_flag'          => 'Not Ready',
                'nine_box_grid'              => 'Enigma / Growth',
                'notes'                      => 'Requires Sommelier Certification and Revenue Upselling workshop completion.'
            ]
        ];

        $localFile = __DIR__ . '/../database/data/succession_candidates.json';
        file_put_contents($localFile, json_encode($initial, JSON_PRETTY_PRINT));

        foreach ($initial as $cand) {
            supabaseRequest('succession_candidates', 'POST', $cand);
        }
    }
}
