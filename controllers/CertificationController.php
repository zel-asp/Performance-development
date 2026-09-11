<?php

require_once __DIR__ . '/../models/CertificateModel.php';

class CertificationController
{
    private CertificateModel $certificateModel;

    public function __construct()
    {
        $this->certificateModel = new CertificateModel();
    }

    private function isSupervisor(string $role): bool
    {
        $r = strtolower(trim($role));
        return in_array($r, ['supervisor', 'manager', 'depthead'], true);
    }

    private function getSupervisorDepartment(string $userId, string $role): ?string
    {
        if (empty($userId)) return null;

        $endpoints = [
            'users?id=eq.' . urlencode($userId) . '&select=department',
            'employees?id=eq.' . urlencode($userId) . '&select=department',
            'users?id=eq.' . urlencode($userId) . '&select=dept',
            'employees?id=eq.' . urlencode($userId) . '&select=dept',
        ];

        foreach ($endpoints as $ep) {
            $res = supabaseRequest($ep, 'GET', null, true);
            if ($res['status'] === 200 && is_array($res['data']) && !empty($res['data'][0])) {
                $dept = $res['data'][0]['department'] ?? $res['data'][0]['dept'] ?? null;
                if ($dept) return $dept;
            }
        }

        try {
            $pdo = getSupabaseDb();
            if ($pdo) {
                $stmt = $pdo->prepare('SELECT department, dept FROM public.users WHERE id = :id LIMIT 1');
                $stmt->execute([':id' => $userId]);
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($row) {
                    $dept = $row['department'] ?? $row['dept'] ?? null;
                    if ($dept) return $dept;
                }
            }
        } catch (Throwable $e) {
            error_log('[CertificationController] PDO department fallback failed for user ' . $userId . ': ' . $e->getMessage());
        }

        return null;
    }

    private function matchesDepartment(array $item, ?string $dept): bool
    {
        if (!$dept) return true;
        $itemDept = strtolower(trim($item['dept'] ?? $item['department'] ?? ''));
        $supervisorDept = strtolower(trim($dept));
        if ($itemDept === '' || $supervisorDept === '') return true;
        if (stripos($itemDept, $supervisorDept) !== false || stripos($supervisorDept, $itemDept) !== false) return true;

        $deptAliases = [
            'culinary & f&b' => ['culinary', 'f&b service', 'f & b service', 'food & beverage'],
            'front office' => ['front office', 'fo'],
            'human resources' => ['human resources', 'hr'],
            'executive office' => ['executive office', 'gm'],
        ];

        foreach (($deptAliases[$supervisorDept] ?? []) as $alias) {
            if (stripos($itemDept, $alias) !== false) return true;
        }
        foreach (($deptAliases[$itemDept] ?? []) as $alias) {
            if (stripos($supervisorDept, $alias) !== false) return true;
        }

        return false;
    }

    private function filterForSupervisor(array $items, string $userId, string $role): array
    {
        if (!$this->isSupervisor($role)) return $items;
        $dept = $this->getSupervisorDepartment($userId, $role);
        if (!$dept) return [];
        return array_values(array_filter($items, fn($item) => $this->matchesDepartment($item, $dept)));
    }

    /**
     * Get all certificates or single certificate by number
     */
    public function getCertificates(array $filters = []): array
    {
        $role = strtolower(trim($filters['role'] ?? ($filters['user_role'] ?? 'Associate')));
        $userId = trim($filters['user_id'] ?? ($filters['userId'] ?? ''));
        $certNumber = $filters['cert_number'] ?? $filters['certificate_number'] ?? null;

        if (!empty($certNumber)) {
            $cert = $this->certificateModel->getCertificateByNumber($certNumber);
            if (!$cert) {
                return [
                    'success' => false,
                    'message' => "Certificate '{$certNumber}' not found."
                ];
            }
            $certs = $this->filterForSupervisor([$cert], $userId, $role);
            return [
                'success' => true,
                'data'    => !empty($certs) ? $certs[0] : null
            ];
        }

        $all = $this->certificateModel->getCertificates($filters);
        $all = $this->filterForSupervisor($all, $userId, $role);
        return [
            'success' => true,
            'data'    => $all
        ];
    }
}
