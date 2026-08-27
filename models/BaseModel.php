<?php

require_once __DIR__ . '/../config/config.php';

class BaseModel
{
    protected string $table;
    protected string $dataFile;

    public function __construct(string $table)
    {
        $this->table = $table;
        $dataDir = __DIR__ . '/../database/data';
        if (!is_dir($dataDir)) {
            mkdir($dataDir, 0777, true);
        }
        $this->dataFile = $dataDir . '/' . $table . '.json';
    }

    /**
     * Get all records from Supabase with fallback to local store
     */
    public function all(array $filters = []): array
    {
        // 1. Try Supabase REST
        $queryStr = $this->table;
        if (!empty($filters)) {
            $params = [];
            foreach ($filters as $key => $val) {
                $params[] = urlencode($key) . '=eq.' . urlencode($val);
            }
            $queryStr .= '?' . implode('&', $params);
        }

        $res = supabaseRequest($queryStr, 'GET', null, true);
        if ($res['status'] === 200 && is_array($res['data'])) {
            return $res['data'];
        }

        // 2. Fallback to Local Seed/Data Store
        return $this->getLocalData($filters);
    }

    /**
     * Find single record by ID
     */
    public function find(string $id): ?array
    {
        $res = supabaseRequest($this->table . '?id=eq.' . urlencode($id), 'GET', null, true);
        if ($res['status'] === 200 && !empty($res['data'][0])) {
            return $res['data'][0];
        }

        $all = $this->getLocalData();
        foreach ($all as $item) {
            if (($item['id'] ?? '') === $id) {
                return $item;
            }
        }
        return null;
    }

    /**
     * Create record
     */
    public function create(array $data): array
    {
        if (empty($data['id'])) {
            $data['id'] = 'gen-' . substr(bin2hex(random_bytes(6)), 0, 8);
        }
        if (empty($data['created_at'])) {
            $data['created_at'] = date('c');
        }

        // Attempt write to Supabase
        supabaseRequest($this->table, 'POST', $data, true);

        // Always sync with local data store
        $all = $this->getLocalData();
        $all[] = $data;
        $this->saveLocalData($all);

        return $data;
    }

    /**
     * Update record by ID
     */
    public function update(string $id, array $data): ?array
    {
        $data['updated_at'] = date('c');

        // Attempt update on Supabase
        $res = supabaseRequest($this->table . '?id=eq.' . urlencode($id), 'PATCH', $data, true);
        if ($res['status'] >= 200 && $res['status'] < 300 && !empty($res['data'])) {
            $updatedItem = is_array($res['data']) && isset($res['data'][0]) ? $res['data'][0] : $res['data'];
            // Sync with local store
            $all = $this->getLocalData();
            $found = false;
            foreach ($all as &$item) {
                if ((string)($item['id'] ?? '') === (string)$id) {
                    $item = array_merge($item, $updatedItem);
                    $found = true;
                    break;
                }
            }
            if (!$found) {
                $all[] = $updatedItem;
            }
            $this->saveLocalData($all);
            return $updatedItem;
        }

        // If PATCH affected 0 rows in Supabase because the record didn't exist in Supabase yet, POST it!
        if ($res['status'] >= 200 && $res['status'] < 300 && empty($res['data'])) {
            $all = $this->getLocalData();
            $existing = null;
            foreach ($all as $item) {
                if ((string)($item['id'] ?? '') === (string)$id) {
                    $existing = $item;
                    break;
                }
            }
            $fullRecord = $existing ? array_merge($existing, $data) : array_merge(['id' => $id], $data);
            $createRes = supabaseRequest($this->table, 'POST', $fullRecord, true);
            if ($createRes['status'] >= 200 && $createRes['status'] < 300 && !empty($createRes['data'])) {
                $updatedItem = is_array($createRes['data']) && isset($createRes['data'][0]) ? $createRes['data'][0] : $createRes['data'];
                $found = false;
                foreach ($all as &$item) {
                    if ((string)($item['id'] ?? '') === (string)$id) {
                        $item = array_merge($item, $updatedItem);
                        $found = true;
                        break;
                    }
                }
                if (!$found) {
                    $all[] = $updatedItem;
                }
                $this->saveLocalData($all);
                return $updatedItem;
            }
        }

        // Update in local data store
        $all = $this->getLocalData();
        $updatedItem = null;
        foreach ($all as &$item) {
            if ((string)($item['id'] ?? '') === (string)$id) {
                $item = array_merge($item, $data);
                $updatedItem = $item;
                break;
            }
        }
        if ($updatedItem !== null) {
            $this->saveLocalData($all);
        }
        return $updatedItem;
    }

    /**
     * Delete record by ID
     */
    public function delete(string $id): bool
    {
        supabaseRequest($this->table . '?id=eq.' . urlencode($id), 'DELETE', null, true);

        $all = $this->getLocalData();
        $filtered = array_values(array_filter($all, fn($item) => ($item['id'] ?? '') !== $id));
        $this->saveLocalData($filtered);
        return true;
    }

    /**
     * Seed initial data if store is empty
     */
    public function seedIfEmpty(array $initialData): void
    {
        if (!file_exists($this->dataFile) || filesize($this->dataFile) === 0) {
            $this->saveLocalData($initialData);
        }
    }

    /**
     * Read local json file with optional key-value filtering
     */
    protected function getLocalData(array $filters = []): array
    {
        if (!file_exists($this->dataFile)) {
            return [];
        }
        $content = file_get_contents($this->dataFile);
        $data = json_decode($content, true);
        if (!is_array($data)) {
            return [];
        }

        if (empty($filters)) {
            return $data;
        }

        return array_values(array_filter($data, function ($item) use ($filters) {
            foreach ($filters as $k => $v) {
                if (!isset($item[$k]) || (string)$item[$k] !== (string)$v) {
                    return false;
                }
            }
            return true;
        }));
    }

    /**
     * Write data to local JSON file
     */
    protected function saveLocalData(array $data): void
    {
        file_put_contents($this->dataFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    }
}
