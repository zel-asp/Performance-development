<?php

require_once __DIR__ . '/../models/TrainingNeedModel.php';
require_once __DIR__ . '/../models/CompetencyModel.php';
require_once __DIR__ . '/../mailer.php';

class TrainingIntegrationController
{
    private TrainingNeedModel $needModel;
    private CompetencyModel $competencyModel;

    public function __construct()
    {
        $this->needModel = new TrainingNeedModel();
        $this->competencyModel = new CompetencyModel();
    }

    /**
     * Trigger all closed-loop ecosystem updates on successful training certification
     */
    public function handleCertificationSuccess(array $evaluationData, array $certificateData): array
    {
        $associateId = $evaluationData['associateId'] ?? ($evaluationData['associate_id'] ?? '');
        $associateName = $evaluationData['associateName'] ?? ($evaluationData['associate_name'] ?? 'Associate');
        $programTitle = $evaluationData['programTitle'] ?? ($evaluationData['program_title'] ?? 'Training Program');
        $certNumber = $certificateData['certificate_number'] ?? ($evaluationData['certificateReference'] ?? '');
        $competencyKey = $evaluationData['competencyKey'] ?? ($evaluationData['competency_key'] ?? '');
        $scoreAfter = (float)($evaluationData['competencyScoreAfter'] ?? ($evaluationData['competency_score_after'] ?? 4.80));
        $xpAwarded = (int)($evaluationData['xpAwarded'] ?? ($evaluationData['xp_awarded'] ?? 150));

        $results = [
            'competency_elevated' => false,
            'xp_awarded'          => $xpAwarded,
            'need_resolved'       => false,
            'email_dispatched'    => false,
            'certificate_number'  => $certNumber,
            'new_competency_score'=> $scoreAfter
        ];

        // 1. Resolve matching training need in Supabase
        $allNeeds = $this->needModel->getNeeds();
        foreach ($allNeeds as $need) {
            $nEmpId = $need['employeeId'] ?? ($need['employee_id'] ?? '');
            $nCompKey = $need['competencyKey'] ?? ($need['competency_key'] ?? '');
            $nAssocName = $need['associateName'] ?? ($need['associate_name'] ?? '');

            $isMatch = false;
            if ($nEmpId && $associateId && $nEmpId === $associateId) {
                if (!$competencyKey || strcasecmp($nCompKey, $competencyKey) === 0) {
                    $isMatch = true;
                }
            } elseif ($nAssocName && $associateName && str_contains(strtolower($nAssocName), strtolower($associateName))) {
                $isMatch = true;
            }

            if ($isMatch) {
                $this->needModel->updateStatus($need['id'], 'Resolved');
                $results['need_resolved'] = true;
            }
        }

        // 2. Mark all assessed competency deficits as elevated (>= 4.80 Benchmark Met) in Supabase
        if (!empty($associateId)) {
            if (!empty($competencyKey)) {
                $this->competencyModel->setScore($associateId, $competencyKey, $scoreAfter);
            }
            $this->competencyModel->elevateAllDeficitsForEmployee($associateId, $scoreAfter);
            $results['competency_elevated'] = true;
        }

        // 3. Email dispatch omitted as per requirement
        $results['email_dispatched'] = false;

        return $results;
    }
}
