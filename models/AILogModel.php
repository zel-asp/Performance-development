<?php

require_once __DIR__ . '/BaseModel.php';

class AILogModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct('ai_request_log');
    }

    /**
     * Log an AI request for compliance and audit trail
     */
    public function logRequest(array $data): array
    {
        $id = 'ailog-' . substr(bin2hex(random_bytes(4)), 0, 8);
        $record = [
            'id'              => $id,
            'user_id'         => $data['user_id'] ?? 'anonymous',
            'role'            => $data['role'] ?? 'Supervisor',
            'feature'         => $data['feature'] ?? 'sbi_refiner',
            'input_reference' => substr($data['input_reference'] ?? '', 0, 500),
            'tokens_used'     => (int)($data['tokens_used'] ?? 0),
            'status'          => $data['status'] ?? 'SUCCESS',
            'created_at'      => date('c')
        ];

        return $this->create($record);
    }

    /**
     * Get recent audit logs for HR compliance inspection
     */
    public function getLogs(int $limit = 50): array
    {
        $res = supabaseRequest("ai_request_log?order=created_at.desc&limit={$limit}", 'GET', null, true);
        return is_array($res['data'] ?? null) && !isset($res['data']['code']) ? $res['data'] : [];
    }
}
