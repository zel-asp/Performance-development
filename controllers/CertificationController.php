<?php

require_once __DIR__ . '/../models/CertificateModel.php';

class CertificationController
{
    private CertificateModel $certificateModel;

    public function __construct()
    {
        $this->certificateModel = new CertificateModel();
    }

    /**
     * Get all certificates or single certificate by number
     */
    public function getCertificates(array $filters = []): array
    {
        $certNumber = $filters['cert_number'] ?? $filters['certificate_number'] ?? null;
        if (!empty($certNumber)) {
            $cert = $this->certificateModel->getCertificateByNumber($certNumber);
            if (!$cert) {
                return [
                    'success' => false,
                    'message' => "Certificate '{$certNumber}' not found."
                ];
            }
            return [
                'success' => true,
                'data'    => $cert
            ];
        }

        $all = $this->certificateModel->getCertificates($filters);
        return [
            'success' => true,
            'data'    => $all
        ];
    }
}
