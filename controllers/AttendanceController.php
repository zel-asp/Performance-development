<?php

require_once __DIR__ . '/../models/TrainingSessionModel.php';

class AttendanceController
{
    private TrainingSessionModel $sessionModel;

    public function __construct()
    {
        $this->sessionModel = new TrainingSessionModel();
    }

    private function isSupervisor(string $role): bool
    {
        $r = strtolower(trim($role));
        return in_array($r, ['supervisor', 'manager', 'depthead'], true);
    }

    private function getSupervisorDepartment(string $userId, string $role): ?string
    {
        if (empty($userId)) return null;
        $res = supabaseRequest('users?id=eq.' . urlencode($userId) . '&select=department', 'GET', null, true);
        if ($res['status'] === 200 && !empty($res['data'][0]['department'])) {
            return $res['data'][0]['department'];
        }
        return null;
    }

    /**
     * Update participant attendance status in a session
     */
    public function updateAttendance(array $payload): array
    {
        $sessionId = $payload['session_id'] ?? $payload['sessionId'] ?? '';
        $associateId = $payload['employee_id'] ?? $payload['associateId'] ?? '';
        $status = $payload['attendance_status'] ?? $payload['status'] ?? 'Attended';
        $checkInTime = $payload['check_in_time'] ?? $payload['checkInTime'] ?? date('H:i');
        $role = strtolower(trim($payload['role'] ?? ($payload['user_role'] ?? 'Associate')));
        $userId = trim($payload['user_id'] ?? ($payload['userId'] ?? ''));

        if (empty($sessionId) || empty($associateId)) {
            return [
                'success' => false,
                'message' => 'Session ID and Associate ID are required.'
            ];
        }

        $session = $this->sessionModel->getSessionById($sessionId);
        if (!$session) {
            return [
                'success' => false,
                'message' => "Session '{$sessionId}' not found."
            ];
        }

        // Supervisors may only update attendance for their own department
        if ($this->isSupervisor($role)) {
            $supervisorDept = $this->getSupervisorDepartment($userId, $role);
            $sessionDept = strtolower(trim($session['dept'] ?? ''));
            if ($supervisorDept && $sessionDept && $sessionDept !== strtolower($supervisorDept)) {
                return [
                    'success' => false,
                    'message' => 'Access denied: You may only update attendance for sessions in your own department.'
                ];
            }
        }

        $attendanceRate = ($status === 'Absent') ? 0 : 100;

        $updatedSession = $this->sessionModel->updateRosterParticipant($sessionId, $associateId, [
            'attendanceStatus' => $status,
            'attendanceRate'   => $attendanceRate,
            'checkInTime'      => $checkInTime
        ]);

        return [
            'success' => true,
            'message' => "Attendance updated to '{$status}' successfully.",
            'data'    => [
                'sessionId'        => $sessionId,
                'associateId'      => $associateId,
                'attendanceStatus' => $status,
                'attendanceRate'   => $attendanceRate,
                'checkInTime'      => $checkInTime,
                'session'          => $updatedSession
            ]
        ];
    }
}
