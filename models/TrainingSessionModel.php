<?php

require_once __DIR__ . '/BaseModel.php';

class TrainingSessionModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct('training_sessions');
    }

    public function getSessions(array $filters = []): array
    {
        $all = $this->all($filters);
        foreach ($all as &$s) {
            $s['id'] = $s['id'] ?? '';
            $s['date'] = $s['date'] ?? ($s['session_date'] ?? 'Aug 29, 2026');
            $s['session_date'] = $s['date'];
            $s['time'] = $s['time'] ?? ($s['time_slot'] ?? '14:00 - 17:30');
            $s['time_slot'] = $s['time'];
            $s['programId'] = $s['programId'] ?? ($s['program_id'] ?? '');
            $s['trainerName'] = $s['trainerName'] ?? ($s['trainer_name'] ?? 'Assigned Master Trainer');
            $s['trainerTitle'] = $s['trainerTitle'] ?? ($s['trainer_title'] ?? 'Senior Trainer');
            $s['trainerAvatar'] = $s['trainerAvatar'] ?? ($s['trainer_avatar'] ?? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80');
            if (is_string($s['roster'] ?? null)) {
                $s['roster'] = json_decode($s['roster'], true) ?: [];
            }
            if (!isset($s['roster'])) {
                $s['roster'] = [];
            }
            if (!empty($s['roster']) && count(array_filter($s['roster'], function($m) {
                return ($m['attendanceStatus'] ?? '') === 'Completed' || ($m['evaluationStatus'] ?? '') === 'Completed';
            })) === count($s['roster'])) {
                $s['status'] = 'Completed';
            }
        }
        return $all;
    }

    public function getSessionById(string $sessionId): ?array
    {
        $session = $this->find($sessionId);
        if ($session) {
            $session['date'] = $session['date'] ?? ($session['session_date'] ?? 'Aug 29, 2026');
            $session['time'] = $session['time'] ?? ($session['time_slot'] ?? '14:00 - 17:30');
            $session['programId'] = $session['programId'] ?? ($session['program_id'] ?? '');
            $session['trainerName'] = $session['trainerName'] ?? ($session['trainer_name'] ?? 'Assigned Master Trainer');
            if (is_string($session['roster'] ?? null)) {
                $session['roster'] = json_decode($session['roster'], true) ?: [];
            }
        }
        return $session;
    }

    public function createSession(array $data): array
    {
        $id = $data['id'] ?? ('sess-' . substr(bin2hex(random_bytes(3)), 0, 6));
        $roster = $data['roster'] ?? [];
        if (is_string($roster)) {
            $roster = json_decode($roster, true) ?: [];
        }

        $clean = [
            'id'             => $id,
            'program_id'     => $data['program_id'] ?? ($data['programId'] ?? 'prog-1'),
            'title'          => $data['title'] ?? 'Training Session Cohort',
            'dept'           => $data['dept'] ?? 'Front Office',
            'trainer_name'   => $data['trainer_name'] ?? ($data['trainerName'] ?? 'Assigned Trainer'),
            'trainer_title'  => $data['trainer_title'] ?? ($data['trainerTitle'] ?? 'Lead Trainer'),
            'trainer_avatar' => $data['trainer_avatar'] ?? ($data['trainerAvatar'] ?? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'),
            'location'       => $data['location'] ?? 'Executive Boardroom',
            'session_date'   => $data['session_date'] ?? ($data['date'] ?? date('M d, Y')),
            'time_slot'      => $data['time_slot'] ?? ($data['time'] ?? '14:00 - 17:30'),
            'capacity'       => (int)($data['capacity'] ?? 20),
            'status'         => $data['status'] ?? 'Scheduled',
            'roster'         => $roster,
            'created_at'     => date('c')
        ];

        return $this->create($clean);
    }

    public function updateRosterParticipant(string $sessionId, string $associateId, array $participantData): ?array
    {
        $session = $this->find($sessionId);
        if (!$session) {
            // Create session record if not in db
            $session = [
                'id' => $sessionId,
                'program_id' => $participantData['programId'] ?? 'prog-1',
                'title' => 'Training Cohort Session',
                'dept' => 'Front Office',
                'trainer_name' => 'Assigned Trainer',
                'location' => 'Training Room A',
                'session_date' => date('M d, Y'),
                'time_slot' => '14:00 - 17:30',
                'status' => 'Scheduled',
                'roster' => []
            ];
            $this->createSession($session);
        }

        $roster = $session['roster'] ?? [];
        if (is_string($roster)) {
            $roster = json_decode($roster, true) ?: [];
        }

        $found = false;
        foreach ($roster as &$p) {
            if (($p['associateId'] ?? ($p['employee_id'] ?? '')) === $associateId) {
                $p = array_merge($p, $participantData);
                $found = true;
                break;
            }
        }
        $allCompleted = !empty($roster) && count(array_filter($roster, function($m) {
            return ($m['attendanceStatus'] ?? '') === 'Completed' || ($m['evaluationStatus'] ?? '') === 'Completed';
        })) === count($roster);

        $updatePayload = ['roster' => $roster];
        if ($allCompleted) {
            $updatePayload['status'] = 'Completed';
        }

        return $this->update($sessionId, $updatePayload);
    }
}
