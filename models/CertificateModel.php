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
        $all = $this->all($filters);
        foreach ($all as &$cert) {
            $cert['certificateNumber'] = $cert['certificate_number'] ?? ($cert['certificateNumber'] ?? '');
            $cert['employeeId'] = $cert['employee_id'] ?? ($cert['employeeId'] ?? '');
            $cert['associateName'] = $cert['associate_name'] ?? ($cert['associateName'] ?? 'Associate');
            $cert['programTitle'] = $cert['program_title'] ?? ($cert['programTitle'] ?? 'Hospitality Mastery Program');
            $cert['category'] = $cert['category'] ?? 'Skill Gap & Service Excellence';
            $cert['dept'] = $cert['dept'] ?? 'Front Office';
            $cert['score'] = (int)($cert['score'] ?? 100);
            $cert['issueDate'] = $cert['issue_date'] ?? ($cert['issueDate'] ?? date('M d, Y'));
            $cert['verificationSealCode'] = $cert['verification_seal_code'] ?? ($cert['verificationSealCode'] ?? 'OXF-SEAL-VERIFIED');
            $cert['gmSignature'] = $cert['gm_signature'] ?? ($cert['gmSignature'] ?? 'General Manager, Oxford Suites');
        }
        return $all;
    }

    public function getCertificateByNumber(string $certNumber): ?array
    {
        $all = $this->getCertificates();
        foreach ($all as $cert) {
            if (($cert['certificate_number'] ?? ($cert['certificateNumber'] ?? '')) === $certNumber) {
                return $cert;
            }
        }
        return null;
    }

    public function issueCertificate(array $data): array
    {
        $clean = [
            'id'                     => $data['id'] ?? ('cert-' . substr(bin2hex(random_bytes(3)), 0, 6)),
            'certificate_number'     => $data['certificate_number'] ?? ($data['certificateNumber'] ?? ('OXF-CERT-' . date('Y') . '-' . str_pad(rand(100, 9999), 4, '0', STR_PAD_LEFT))),
            'employee_id'            => $data['employee_id'] ?? ($data['employeeId'] ?? ($data['associate_id'] ?? 'emp-101')),
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
