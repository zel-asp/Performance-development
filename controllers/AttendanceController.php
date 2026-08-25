<?php

require_once __DIR__ . '/../models/TrainingSessionModel.php';

class AttendanceController
{
    private TrainingSessionModel $sessionModel;

    public function __construct()
    {
        $this->sessionModel = new TrainingSessionModel();
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
