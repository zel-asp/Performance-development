<?php

require_once __DIR__ . '/BaseModel.php';

class CertificateModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct('certificates');
        $this->seedInitialCertificates();
    }

    public function getCertificates(array $filters = []): array
    {
        return $this->all($filters);
    }

    public function getCertificateByNumber(string $certNumber): ?array
    {
        $all = $this->all();
        foreach ($all as $cert) {
            if (($cert['certificate_number'] ?? '') === $certNumber) {
                return $cert;
            }
        }
        return null;
    }

    public function issueCertificate(array $data): array
    {
        if (empty($data['id'])) {
            $data['id'] = 'cert-' . substr(bin2hex(random_bytes(3)), 0, 6);
        }
        if (empty($data['certificate_number'])) {
            $data['certificate_number'] = 'OXF-CERT-' . date('Y') . '-' . str_pad(rand(100, 9999), 4, '0', STR_PAD_LEFT);
        }
        if (empty($data['issue_date'])) {
            $data['issue_date'] = date('M d, Y');
        }
        if (empty($data['verification_seal_code'])) {
            $data['verification_seal_code'] = 'OXF-SEAL-' . strtoupper(substr(md5(uniqid()), 0, 12));
        }
        if (empty($data['gm_signature'])) {
            $data['gm_signature'] = 'General Manager, Oxford Suites';
        }
        return $this->create($data);
    }

    private function seedInitialCertificates(): void
    {
        $initial = [
            [
                'id' => 'cert-1',
                'certificate_number' => 'OXF-CERT-2026-0889',
                'employee_id' => 'emp-102',
                'associate_name' => 'Carlos Gomez',
                'program_title' => 'Hospitality Crisis Diplomacy & Guest De-escalation',
                'category' => 'Service Excellence',
                'dept' => 'Front Office',
                'score' => 95,
                'issue_date' => 'Aug 24, 2026',
                'gm_signature' => 'General Manager, Oxford Suites',
                'verification_seal_code' => 'OXF-SEAL-889-VERIFIED'
            ],
            [
                'id' => 'cert-2',
                'certificate_number' => 'OXF-CERT-2026-0742',
                'employee_id' => 'emp-101',
                'associate_name' => 'Maria Santos',
                'program_title' => 'HACCP Level 3 Food Safety & Cold-Chain Mastery',
                'category' => 'Mandatory Compliance',
                'dept' => 'Culinary',
                'score' => 98,
                'issue_date' => 'Jul 15, 2026',
                'gm_signature' => 'General Manager, Oxford Suites',
                'verification_seal_code' => 'OXF-SEAL-742-VERIFIED'
            ]
        ];
        $this->seedIfEmpty($initial);
    }
}
