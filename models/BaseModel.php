<?php

require_once __DIR__ . '/../config/config.php';

class BaseModel
{
    protected string $table;

    public function __construct(string $table)
    {
        $this->table = $table;
    }

    /**
     * Get all records from Supabase PostgreSQL Database
     */
    public function all(array $filters = []): array
    {
        // 1. Filter out API-specific routing parameters
        $ignoredParams = ['action', 'controller', 'csrf_token', '_', 'apiKey'];
        $cleanFilters = array_diff_key($filters, array_flip($ignoredParams));

        // 2. Query Supabase REST
        $queryStr = $this->table;
        if (!empty($cleanFilters)) {
            $params = [];
            foreach ($cleanFilters as $key => $val) {
                if ($val !== null && $val !== '') {
                    $snakeKey = strtolower(preg_replace('/([a-z\d])([A-Z])/', '$1_$2', (string)$key));
                    $params[] = urlencode($snakeKey) . '=eq.' . urlencode($val);
                }
            }
            if (!empty($params)) {
                $queryStr .= '?' . implode('&', $params);
            }
        }

        $res = supabaseRequest($queryStr, 'GET', null, true);
        if ($res['status'] === 200 && is_array($res['data'])) {
            return array_map([$this, 'normalizeRecord'], $res['data']);
        }

        return [];
    }

    /**
     * Find single record by ID
     */
    public function find(string $id): ?array
    {
        $res = supabaseRequest($this->table . '?id=eq.' . urlencode($id), 'GET', null, true);
        if ($res['status'] === 200 && !empty($res['data'][0])) {
            return $this->normalizeRecord($res['data'][0]);
        }

        return null;
    }

    /**
     * Create record in Supabase PostgreSQL Database
     */
    public function create(array $data): array
    {
        if (empty($data['id'])) {
            $data['id'] = 'gen-' . substr(bin2hex(random_bytes(6)), 0, 8);
        }
        if (empty($data['created_at'])) {
            $data['created_at'] = date('c');
        }

        $supabasePayload = $this->toSnakeCaseKeys($data);
        $res = supabaseRequest($this->table, 'POST', $supabasePayload, true);
        if ($res['status'] >= 200 && $res['status'] < 300 && !empty($res['data'][0])) {
            return $this->normalizeRecord($res['data'][0]);
        }

        return $this->normalizeRecord($data);
    }

    /**
     * Update record by ID in Supabase PostgreSQL Database
     */
    public function update(string $id, array $data): ?array
    {
        $data['updated_at'] = date('c');
        $supabasePayload = $this->toSnakeCaseKeys($data);
        $res = supabaseRequest($this->table . '?id=eq.' . urlencode($id), 'PATCH', $supabasePayload, true);
        if ($res['status'] >= 200 && $res['status'] < 300 && !empty($res['data'])) {
            $rawUpdated = is_array($res['data']) && isset($res['data'][0]) ? $res['data'][0] : $res['data'];
            return $this->normalizeRecord($rawUpdated);
        }

        return $this->find($id);
    }

    /**
     * Delete record by ID from Supabase PostgreSQL Database
     */
    public function delete(string $id): bool
    {
        $res = supabaseRequest($this->table . '?id=eq.' . urlencode($id), 'DELETE', null, true);
        return ($res['status'] >= 200 && $res['status'] < 300);
    }

    /**
     * Convert camelCase keys to snake_case for Supabase PostgreSQL
     */
    protected function toSnakeCaseKeys(array $data): array
    {
        $ignored = ['action', 'controller', 'csrf_token', '_', 'apiKey', 'createdAt', 'updatedAt'];
        $clean = array_diff_key($data, array_flip($ignored));

        $result = [];
        foreach ($clean as $key => $value) {
            $snakeKey = strtolower(preg_replace('/([a-z\d])([A-Z])/', '$1_$2', (string)$key));
            $result[$snakeKey] = $value;
        }
        return $result;
    }

    /**
     * Normalize record ensuring both camelCase and snake_case properties are accessible
     */
    public function normalizeRecord(array $row): array
    {
        $normalized = $row;
        foreach ($row as $key => $value) {
            $camelKey = lcfirst(str_replace(' ', '', ucwords(str_replace('_', ' ', (string)$key))));
            if (!array_key_exists($camelKey, $normalized)) {
                $normalized[$camelKey] = $value;
            }
        }
        if (isset($row['session_date']) && !isset($normalized['date'])) {
            $normalized['date'] = $row['session_date'];
        }
        if (isset($row['time_slot']) && !isset($normalized['time'])) {
            $normalized['time'] = $row['time_slot'];
        }
        if (isset($row['date']) && !isset($normalized['session_date'])) {
            $normalized['session_date'] = $row['date'];
        }
        if (isset($row['time']) && !isset($normalized['time_slot'])) {
            $normalized['time_slot'] = $row['time'];
        }
        return $normalized;
    }
}
