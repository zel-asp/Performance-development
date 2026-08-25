<?php

require_once __DIR__ . '/BaseModel.php';

class TrainingNeedModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct('training_needs');
        $this->seedInitialNeeds();
    }

    public function getNeeds(array $filters = []): array
    {
        return $this->all($filters);
    }

    public function createNeed(array $data): array
    {
        if (empty($data['id'])) {
            $data['id'] = 'need-' . substr(bin2hex(random_bytes(4)), 0, 6);
        }
        if (empty($data['dateIdentified'])) {
            $data['dateIdentified'] = date('M d, Y');
        }
        if (empty($data['status'])) {
            $data['status'] = 'Identified';
        }
        return $this->create($data);
    }

    public function updateStatus(string $needId, string $status, ?string $linkedProgramId = null): ?array
    {
        $update = ['status' => $status];
        if ($linkedProgramId !== null) {
            $update['linkedProgramId'] = $linkedProgramId;
        }
        return $this->update($needId, $update);
    }

    private function seedInitialNeeds(): void
    {
        $initial = [
            [
                'id' => 'need-1',
                'title' => 'Frontline Conflict De-escalation Deficit',
                'sourceType' => 'competency_gap',
                'sourceLabel' => 'Skill Gap',
                'category' => 'Service Excellence',
                'dept' => 'Front Office',
                'associateName' => 'Maria Santos',
                'associateRole' => 'Front Desk Host',
                'associateAvatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                'targetCompetency' => 'Frontline Conflict De-escalation',
                'competencyKey' => 'de_escalation',
                'currentScore' => 3.5,
                'requiredScore' => 5.0,
                'gap' => -1.5,
                'urgency' => 'High',
                'status' => 'Program Linked',
                'linkedProgramId' => 'prog-1',
                'dateIdentified' => 'Aug 18, 2026',
                'notes' => 'Identified during Q3 Supervisor Review and Front Office guest friction logs.'
            ],
            [
                'id' => 'need-2',
                'title' => 'HACCP Level 3 Mandatory Annual Recertification',
                'sourceType' => 'compliance',
                'sourceLabel' => 'Mandatory Compliance',
                'category' => 'Food Safety & Hygiene',
                'dept' => 'Culinary',
                'associateName' => 'Carlos Gomez & Culinary Team (5 Associates)',
                'associateRole' => 'Kitchen & Concierge Staff',
                'associateAvatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                'targetCompetency' => 'HACCP Safety & Sanitation',
                'competencyKey' => 'haccp_safety',
                'currentScore' => 4.0,
                'requiredScore' => 4.8,
                'gap' => -0.8,
                'urgency' => 'Critical',
                'status' => 'Scheduled',
                'linkedProgramId' => 'prog-2',
                'dateIdentified' => 'Aug 12, 2026',
                'notes' => 'Statutory hospitality requirement for all food handling staff.'
            ],
            [
                'id' => 'need-3',
                'title' => 'Sommelier Wine Upselling & Vintage Storytelling',
                'sourceType' => 'competency_gap',
                'sourceLabel' => 'Skill Gap',
                'category' => 'Revenue Optimization',
                'dept' => 'F&B Service',
                'associateName' => 'David Lee',
                'associateRole' => 'F&B Server Lead',
                'associateAvatar' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
                'targetCompetency' => 'Revenue & Wine Upsell',
                'competencyKey' => 'revenue_upsell',
                'currentScore' => 3.8,
                'requiredScore' => 4.8,
                'gap' => -1.0,
                'urgency' => 'Medium',
                'status' => 'Identified',
                'linkedProgramId' => 'prog-3',
                'dateIdentified' => 'Aug 20, 2026',
                'notes' => 'Average wine check is 18% below restaurant benchmark for dinner shift.'
            ],
            [
                'id' => 'need-4',
                'title' => 'Fire Safety & Crisis Evacuation Protocol',
                'sourceType' => 'compliance',
                'sourceLabel' => 'Mandatory Compliance',
                'category' => 'Safety & Security',
                'dept' => 'Housekeeping',
                'associateName' => 'Housekeeping Staff (12 Associates)',
                'associateRole' => 'Room Attendants',
                'associateAvatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
                'targetCompetency' => 'Crisis Management & Evacuation',
                'competencyKey' => 'crisis_mgmt',
                'currentScore' => 4.1,
                'requiredScore' => 5.0,
                'gap' => -0.9,
                'urgency' => 'High',
                'status' => 'Identified',
                'linkedProgramId' => 'prog-4',
                'dateIdentified' => 'Aug 22, 2026',
                'notes' => 'Annual mandatory hotel evacuation drill and extinguisher handling.'
            ]
        ];
        $this->seedIfEmpty($initial);
    }
}
