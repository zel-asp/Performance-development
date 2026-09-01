<?php

require_once __DIR__ . '/BaseModel.php';

class CertificateModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct('certificates');
    }

    public function getCertificates(array $filters = []): array
    {
        $cleanFilters = [];
        $empId = $filters['employee_id'] ?? ($filters['associate_id'] ?? ($filters['employeeId'] ?? null));
        if (!empty($empId)) {
            $cleanFilters['employee_id'] = $empId;
        }
        if (!empty($filters['certificate_number'])) {
            $cleanFilters['certificate_number'] = $filters['certificate_number'];
        }
        if (!empty($filters['program_id'])) {
            $cleanFilters['program_id'] = $filters['program_id'];
        }

        $all = $this->all($cleanFilters);

        // Alias matching for demo employee IDs (emp-101 vs oxf-emp-1001)
        if (empty($all) && !empty($empId)) {
            $allCerts = $this->all();
            $norm = strtolower(trim($empId));
            $all = array_values(array_filter($allCerts, function($c) use ($norm) {
                $cEmp = strtolower(trim($c['employee_id'] ?? ''));
                if ($cEmp === $norm) return true;
                if ($norm === 'emp-101' && in_array($cEmp, ['emp-1', 'oxf-emp-1001'])) return true;
                if ($norm === 'emp-102' && in_array($cEmp, ['emp-2', 'oxf-sup-2001'])) return true;
                return false;
            }));
        }

        foreach ($all as &$cert) {
            $cert['certificate_number'] = $cert['certificate_number'] ?? ($cert['certificateNumber'] ?? '');
            $cert['employee_id'] = $cert['employee_id'] ?? ($cert['employeeId'] ?? '');
            $cert['associate_name'] = $cert['associate_name'] ?? ($cert['associateName'] ?? '');
            $cert['program_title'] = $cert['program_title'] ?? ($cert['programTitle'] ?? '');
            $cert['category'] = $cert['category'] ?? '';
            $cert['dept'] = $cert['dept'] ?? '';
            $cert['score'] = isset($cert['score']) ? (int)$cert['score'] : null;
            $cert['issue_date'] = $cert['issue_date'] ?? ($cert['issueDate'] ?? '');
            $cert['verification_seal_code'] = $cert['verification_seal_code'] ?? ($cert['verificationSealCode'] ?? '');
            $cert['gm_signature'] = $cert['gm_signature'] ?? ($cert['gmSignature'] ?? 'General Manager, Oxford Suites');
        }
        return $all;
    }

    public function getCertificateByNumber(string $certNumber): ?array
    {
        $all = $this->getCertificates(['certificate_number' => $certNumber]);
        return !empty($all[0]) ? $all[0] : null;
    }

    public function issueCertificate(array $data): array
    {
        $clean = [
            'id'                     => $data['id'] ?? ('cert-' . substr(bin2hex(random_bytes(3)), 0, 6)),
            'certificate_number'     => $data['certificate_number'] ?? ($data['certificateNumber'] ?? ('OXF-CERT-' . date('Y') . '-' . str_pad(rand(100, 9999), 4, '0', STR_PAD_LEFT))),
            'employee_id'            => $data['employee_id'] ?? ($data['employeeId'] ?? ($data['associate_id'] ?? 'emp-101')),
            'program_id'             => !empty($data['program_id']) ? $data['program_id'] : null,
            'evaluation_id'          => !empty($data['evaluation_id']) ? $data['evaluation_id'] : null,
            'associate_name'         => $data['associate_name'] ?? ($data['associateName'] ?? 'Associate'),
            'program_title'          => $data['program_title'] ?? ($data['programTitle'] ?? 'Hospitality Program'),
            'category'               => $data['category'] ?? 'Skill Gap: Service Excellence',
            'dept'                   => $data['dept'] ?? 'Front Office',
            'score'                  => (int)($data['score'] ?? 100),
            'issue_date'             => $data['issue_date'] ?? ($data['issueDate'] ?? date('M d, Y')),
            'verification_seal_code' => $data['verification_seal_code'] ?? ($data['verificationSealCode'] ?? ('OXF-SEAL-' . strtoupper(substr(md5(uniqid()), 0, 12)))),
            'gm_signature'           => $data['gm_signature'] ?? ($data['gmSignature'] ?? 'General Manager, Oxford Suites'),
            'created_at'             => date('c')
        ];

        return $this->create($clean);
    }
}
