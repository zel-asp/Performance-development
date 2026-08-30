<?php

require_once __DIR__ . '/BaseModel.php';

class CoachingNoteModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct('coaching_notes');
    }

    /**
     * Fetch coaching notes with optional filters (employee_id, supervisor_id, source)
     */
    public function getNotes(array $filters = []): array
    {
        $all = $this->all();
        if (!is_array($all)) {
            return [];
        }

        $filtered = [];
        $employeeId = $filters['employee_id'] ?? null;
        $supervisorId = $filters['supervisor_id'] ?? null;
        $source = $filters['source'] ?? null;

        foreach ($all as $item) {
            if ($employeeId && ($item['employee_id'] ?? '') !== $employeeId) {
                continue;
            }
            if ($supervisorId && ($item['supervisor_id'] ?? '') !== $supervisorId) {
                continue;
            }
            if ($source && ($item['source'] ?? '') !== $source) {
                continue;
            }
            $filtered[] = $item;
        }

        // Sort by created_at DESC
        usort($filtered, function ($a, $b) {
            $tA = strtotime($a['created_at'] ?? 'now');
            $tB = strtotime($b['created_at'] ?? 'now');
            return $tB - $tA;
        });

        return $filtered;
    }

    /**
     * Create a human-reviewed and saved coaching note
     */
    public function createNote(array $data): array
    {
        $id = $data['id'] ?? ('coach-' . substr(bin2hex(random_bytes(4)), 0, 8));
        $record = [
            'id'              => $id,
            'employee_id'     => trim($data['employee_id'] ?? ($data['employeeId'] ?? '')),
            'supervisor_id'   => trim($data['supervisor_id'] ?? ($data['supervisorId'] ?? 'sup-101')),
            'situation'       => trim($data['situation'] ?? ''),
            'behavior'        => trim($data['behavior'] ?? ''),
            'impact'          => trim($data['impact'] ?? ''),
            'source'          => in_array($data['source'] ?? '', ['ai_refined', 'manual']) ? $data['source'] : 'manual',
            'tone_tag'        => $data['tone_tag'] ?? ($data['tone'] ?? 'balanced'),
            'visibility_flag' => isset($data['visibility_flag']) ? (bool)$data['visibility_flag'] : true,
            'created_at'      => date('c'),
            'updated_at'      => date('c')
        ];

        return $this->create($record);
    }
}
