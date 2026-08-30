<?php

require_once __DIR__ . '/../models/CoachingNoteModel.php';

class CoachingController
{
    private CoachingNoteModel $model;

    public function __construct()
    {
        $this->model = new CoachingNoteModel();
    }

    /**
     * Get list of coaching notes for an employee or supervisor
     */
    public function getNotes(array $payload): array
    {
        $employeeId = $payload['employee_id'] ?? ($payload['employeeId'] ?? null);
        $supervisorId = $payload['supervisor_id'] ?? ($payload['supervisorId'] ?? null);
        $source = $payload['source'] ?? null;

        $notes = $this->model->getNotes([
            'employee_id'   => $employeeId,
            'supervisor_id' => $supervisorId,
            'source'        => $source
        ]);

        return [
            'success' => true,
            'data'    => $notes,
            'count'   => count($notes)
        ];
    }

    /**
     * Save human-reviewed coaching note to permanent database
     */
    public function createNote(array $payload): array
    {
        $employeeId = trim($payload['employee_id'] ?? ($payload['employeeId'] ?? ''));
        $supervisorId = trim($payload['supervisor_id'] ?? ($payload['supervisorId'] ?? 'sup-101'));
        $situation = trim($payload['situation'] ?? '');
        $behavior = trim($payload['behavior'] ?? '');
        $impact = trim($payload['impact'] ?? '');
        $source = trim($payload['source'] ?? 'manual');
        $toneTag = trim($payload['tone_tag'] ?? ($payload['tone'] ?? 'balanced'));

        if (empty($situation) || empty($behavior) || empty($impact)) {
            http_response_code(400);
            return [
                'success' => false,
                'message' => 'Situation, Behavior, and Impact fields are all required before saving.'
            ];
        }

        $created = $this->model->createNote([
            'employee_id'   => $employeeId ?: 'emp-101',
            'supervisor_id' => $supervisorId,
            'situation'     => $situation,
            'behavior'      => $behavior,
            'impact'        => $impact,
            'source'        => $source === 'ai_refined' ? 'ai_refined' : 'manual',
            'tone_tag'      => $toneTag,
            'visibility_flag' => true
        ]);

        return [
            'success' => true,
            'data'    => $created,
            'message' => 'Coaching feedback note successfully committed to associate timeline.'
        ];
    }
}
