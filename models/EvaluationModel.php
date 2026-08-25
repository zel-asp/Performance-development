<?php

require_once __DIR__ . '/BaseModel.php';

class EvaluationModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct('training_evaluations');
        $this->seedInitialEvaluations();
    }

    public function getEvaluations(array $filters = []): array
    {
        return $this->all($filters);
    }

    public function createEvaluation(array $data): array
    {
        if (empty($data['id'])) {
            $data['id'] = 'res-' . substr(bin2hex(random_bytes(3)), 0, 6);
        }
        if (empty($data['completionDate'])) {
            $data['completionDate'] = date('M d, Y');
        }
        return $this->create($data);
    }

    private function seedInitialEvaluations(): void
    {
        $initial = [
            [
                'id' => 'res-901',
                'sessionId' => 'sess-101',
                'programId' => 'prog-1',
                'programTitle' => 'Hospitality Crisis Diplomacy & Guest De-escalation',
                'category' => 'Skill Gap: Service Excellence',
                'dept' => 'Front Office',
                'associateId' => 'emp-102',
                'associateName' => 'Carlos Gomez',
                'associateRole' => 'Concierge Lead',
                'associateAvatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                'trainerName' => 'Elena Vance & FOM John Marco',
                'completionDate' => 'Aug 24, 2026',
                'attendanceRate' => '100%',
                'quizScore' => 95,
                'passingThreshold' => 80,
                'resultStatus' => 'Passed & Certified',
                'feedbackRating' => 5.0,
                'certificateReference' => 'OXF-CERT-2026-0889',
                'competencyTarget' => 'Frontline Conflict De-escalation',
                'competencyKey' => 'de_escalation',
                'competencyScoreBefore' => 3.8,
                'competencyScoreAfter' => 4.8,
                'syncedToProfile' => true,
                'xpAwarded' => 150
            ],
            [
                'id' => 'res-899',
                'sessionId' => 'sess-prev',
                'programId' => 'prog-2',
                'programTitle' => 'HACCP Level 3 Food Safety & Cold-Chain Mastery',
                'category' => 'Mandatory Compliance',
                'dept' => 'Culinary',
                'associateId' => 'emp-101',
                'associateName' => 'Maria Santos',
                'associateRole' => 'Front Desk Host (Cross-Training)',
                'associateAvatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                'trainerName' => 'Chef Marco Rossi',
                'completionDate' => 'Jul 15, 2026',
                'attendanceRate' => '100%',
                'quizScore' => 98,
                'passingThreshold' => 85,
                'resultStatus' => 'Passed & Certified',
                'feedbackRating' => 5.0,
                'certificateReference' => 'OXF-CERT-2026-0742',
                'competencyTarget' => 'HACCP Safety & Sanitation',
                'competencyKey' => 'haccp_safety',
                'competencyScoreBefore' => 4.0,
                'competencyScoreAfter' => 4.8,
                'syncedToProfile' => true,
                'xpAwarded' => 150
            ]
        ];
        $this->seedIfEmpty($initial);
    }
}
