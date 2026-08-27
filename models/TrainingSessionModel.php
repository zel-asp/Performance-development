<?php

require_once __DIR__ . '/BaseModel.php';

class TrainingSessionModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct('training_sessions');
        $this->seedInitialSessions();
    }

    public function getSessions(array $filters = []): array
    {
        return $this->all($filters);
    }

    public function getSessionById(string $sessionId): ?array
    {
        return $this->find($sessionId);
    }

    public function createSession(array $data): array
    {
        if (empty($data['id'])) {
            $data['id'] = 'sess-' . substr(bin2hex(random_bytes(3)), 0, 6);
        }
        if (empty($data['status'])) {
            $data['status'] = 'Scheduled';
        }
        if (!isset($data['roster'])) {
            $data['roster'] = [];
        }

        // Map frontend key names to Supabase schema columns
        if (isset($data['date']) && !isset($data['session_date'])) {
            $data['session_date'] = $data['date'];
        }
        if (isset($data['time']) && !isset($data['time_slot'])) {
            $data['time_slot'] = $data['time'];
        }
        if (isset($data['programId']) && !isset($data['program_id'])) {
            $data['program_id'] = $data['programId'];
        }
        if (isset($data['trainerName']) && !isset($data['trainer_name'])) {
            $data['trainer_name'] = $data['trainerName'];
        }
        if (isset($data['trainerTitle']) && !isset($data['trainer_title'])) {
            $data['trainer_title'] = $data['trainerTitle'];
        }
        if (isset($data['trainerAvatar']) && !isset($data['trainer_avatar'])) {
            $data['trainer_avatar'] = $data['trainerAvatar'];
        }

        return $this->create($data);
    }

    public function updateRosterParticipant(string $sessionId, string $associateId, array $participantData): ?array
    {
        $session = $this->find($sessionId);
        if (!$session) {
            return null;
        }

        $roster = $session['roster'] ?? [];
        $found = false;
        foreach ($roster as &$p) {
            if (($p['associateId'] ?? '') === $associateId) {
                $p = array_merge($p, $participantData);
                $found = true;
                break;
            }
        }
        if (!$found) {
            $roster[] = $participantData;
        }

        return $this->update($sessionId, ['roster' => $roster]);
    }

    private function seedInitialSessions(): void
    {
        $initial = [
            [
                'id' => 'sess-101',
                'programId' => 'prog-1',
                'title' => 'Hospitality Crisis Diplomacy & Guest De-escalation - Cohort A',
                'dept' => 'Front Office',
                'trainerName' => 'Elena Vance & FOM John Marco',
                'trainerTitle' => 'Internal Master Hospitality Trainer',
                'trainerAvatar' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
                'location' => 'Executive Boardroom & Front Desk Mockup',
                'date' => 'Aug 26, 2026',
                'time' => '14:00 - 17:30',
                'status' => 'In Progress',
                'roster' => [
                    [
                        'associateId' => 'emp-101',
                        'name' => 'Maria Santos',
                        'role' => 'Front Desk Host',
                        'dept' => 'Front Office',
                        'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                        'attendanceStatus' => 'Attended',
                        'attendanceRate' => 100,
                        'checkInTime' => '13:52',
                        'evaluationStatus' => 'Pending',
                        'score' => null,
                        'resultId' => null
                    ],
                    [
                        'associateId' => 'emp-102',
                        'name' => 'Carlos Gomez',
                        'role' => 'Concierge Lead',
                        'dept' => 'Front Office',
                        'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                        'attendanceStatus' => 'Completed',
                        'attendanceRate' => 100,
                        'checkInTime' => '13:58',
                        'evaluationStatus' => 'Completed',
                        'score' => 95,
                        'resultId' => 'res-901'
                    ],
                    [
                        'associateId' => 'emp-103',
                        'name' => 'Angela Reyes',
                        'role' => 'Guest Relations Officer',
                        'dept' => 'Front Office',
                        'avatar' => 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
                        'attendanceStatus' => 'Attended',
                        'attendanceRate' => 100,
                        'checkInTime' => '14:01',
                        'evaluationStatus' => 'Pending',
                        'score' => null,
                        'resultId' => null
                    ]
                ]
            ],
            [
                'id' => 'sess-102',
                'programId' => 'prog-2',
                'title' => 'HACCP Food Safety Level 3 - Hygiene Intensive',
                'dept' => 'Culinary',
                'trainerName' => 'Chef Marco Rossi (Exec Sous Chef)',
                'trainerTitle' => 'Certified Food Hygiene Auditor',
                'trainerAvatar' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
                'location' => 'Main Culinary Kitchen & Training Cold Room',
                'date' => 'Aug 27, 2026',
                'time' => '09:00 - 13:00',
                'status' => 'Scheduled',
                'roster' => [
                    [
                        'associateId' => 'emp-104',
                        'name' => 'Chef Marco S.',
                        'role' => 'Line Cook Lead',
                        'dept' => 'Culinary',
                        'avatar' => 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=150&auto=format&fit=crop&q=80',
                        'attendanceStatus' => 'Attended',
                        'attendanceRate' => 100,
                        'checkInTime' => '08:55',
                        'evaluationStatus' => 'Pending',
                        'score' => null,
                        'resultId' => null
                    ],
                    [
                        'associateId' => 'emp-105',
                        'name' => 'Tanya Morales',
                        'role' => 'Pastry Chef de Partie',
                        'dept' => 'Culinary',
                        'avatar' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
                        'attendanceStatus' => 'Attended',
                        'attendanceRate' => 100,
                        'checkInTime' => '08:58',
                        'evaluationStatus' => 'Pending',
                        'score' => null,
                        'resultId' => null
                    ]
                ]
            ],
            [
                'id' => 'sess-103',
                'programId' => 'prog-3',
                'title' => 'Sommelier Wine Pairing & Fine Dining Service Masterclass',
                'dept' => 'F&B Service',
                'trainerName' => 'Pierre Dubois',
                'trainerTitle' => 'Master Sommelier',
                'trainerAvatar' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
                'location' => 'The Oxford Cellar & Fine Dining Room',
                'date' => 'Aug 28, 2026',
                'time' => '15:00 - 18:00',
                'status' => 'Scheduled',
                'roster' => [
                    [
                        'associateId' => 'emp-106',
                        'name' => 'David Lee',
                        'role' => 'F&B Server Lead',
                        'dept' => 'F&B Service',
                        'avatar' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
                        'attendanceStatus' => 'Attended',
                        'attendanceRate' => 100,
                        'checkInTime' => '14:50',
                        'evaluationStatus' => 'Pending',
                        'score' => null,
                        'resultId' => null
                    ]
                ]
            ]
        ];
        $this->seedIfEmpty($initial);
    }
}
