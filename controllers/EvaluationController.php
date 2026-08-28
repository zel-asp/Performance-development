<?php

require_once __DIR__ . '/../models/TrainingProgramModel.php';
require_once __DIR__ . '/../models/TrainingSessionModel.php';
require_once __DIR__ . '/../models/EvaluationModel.php';
require_once __DIR__ . '/../models/CertificateModel.php';
require_once __DIR__ . '/TrainingIntegrationController.php';

class EvaluationController
{
    private TrainingProgramModel $programModel;
    private TrainingSessionModel $sessionModel;
    private EvaluationModel $evaluationModel;
    private CertificateModel $certificateModel;
    private TrainingIntegrationController $integrationController;

    public function __construct()
    {
        $this->programModel = new TrainingProgramModel();
        $this->sessionModel = new TrainingSessionModel();
        $this->evaluationModel = new EvaluationModel();
        $this->certificateModel = new CertificateModel();
        $this->integrationController = new TrainingIntegrationController();
    }

    /**
     * Submit evaluation, auto-grade quiz, evaluate Kirkpatrick, issue certificate, and trigger closed-loop
     */
    public function submitEvaluation(array $payload): array
    {
        $sessionId = $payload['sessionId'] ?? $payload['session_id'] ?? '';
        $programId = $payload['programId'] ?? $payload['program_id'] ?? '';
        $associateId = $payload['associateId'] ?? $payload['associate_id'] ?? '';
        $submittedAnswers = $payload['answers'] ?? []; // e.g. [0 => 1, 1 => 1, ...]
        $kirkpatrickFeedback = $payload['kirkpatrickFeedback'] ?? [];

        if (empty($sessionId) || empty($programId) || empty($associateId)) {
            return [
                'success' => false,
                'message' => 'Session ID, Program ID, and Associate ID are required.'
            ];
        }

        $program = $this->programModel->getProgramById($programId);
        if (!$program) {
            return [
                'success' => false,
                'message' => "Program '{$programId}' not found."
            ];
        }

        $session = $this->sessionModel->getSessionById($sessionId);
        if (!$session) {
            return [
                'success' => false,
                'message' => "Session '{$sessionId}' not found."
            ];
        }

        // 1. Find participant in roster
        $associateName = 'Associate';
        $associateRole = 'Hotel Staff';
        $associateAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
        $roster = $session['roster'] ?? [];
        foreach ($roster as $p) {
            if (($p['associateId'] ?? '') === $associateId) {
                $associateName = $p['name'] ?? $associateName;
                $associateRole = $p['role'] ?? $associateRole;
                $associateAvatar = $p['avatar'] ?? $associateAvatar;
                break;
            }
        }

        // 2. Auto-Grade Quiz Questions
        $quizQuestions = $program['quizQuestions'] ?? $program['quiz_questions'] ?? [];
        if (is_string($quizQuestions)) {
            $quizQuestions = json_decode($quizQuestions, true) ?: [];
        }

        $totalQuestions = is_array($quizQuestions) ? count($quizQuestions) : 0;
        $correctCount = 0;

        if ($totalQuestions > 0) {
            foreach ($quizQuestions as $idx => $q) {
                $correctIndex = (int)($q['correct'] ?? 0);
                if (isset($submittedAnswers[$idx]) && (int)$submittedAnswers[$idx] === $correctIndex) {
                    $correctCount++;
                }
            }
            $calculatedScore = (int)round(($correctCount / $totalQuestions) * 100);
        } else {
            $calculatedScore = 95; // Default score if no quiz questions attached
        }

        $passingThreshold = (int)($program['passingScore'] ?? 80);
        $isPassed = $calculatedScore >= $passingThreshold;
        $resultStatus = $isPassed ? 'Passed & Certified' : 'Needs Retest';

        // 3. Kirkpatrick Level 1 Rating
        $trainerRating = (float)($kirkpatrickFeedback['trainerRating'] ?? 5.0);
        $relevanceRating = (float)($kirkpatrickFeedback['relevanceRating'] ?? 5.0);
        $kirkpatrickAvg = round(($trainerRating + $relevanceRating) / 2, 1);
        $feedbackNotes = $kirkpatrickFeedback['comments'] ?? 'Excellent simulation and practical clarity.';

        // 4. Issue Certificate if Passed
        $certReference = null;
        $issuedCertificate = null;
        if ($isPassed) {
            $issuedCertificate = $this->certificateModel->issueCertificate([
                'employee_id'            => $associateId,
                'associate_name'         => $associateName,
                'program_title'          => $program['title'] ?? 'Training Program',
                'category'               => $program['category'] ?? 'Hospitality Standard',
                'dept'                   => $session['dept'] ?? $program['dept'] ?? 'Hotel Operations',
                'score'                  => $calculatedScore
            ]);
            $certReference = $issuedCertificate['certificate_number'] ?? null;
        }

        // 5. Record Evaluation in Model
        $resultId = 'res-' . substr(bin2hex(random_bytes(3)), 0, 6);
        $evaluationRecord = [
            'id'                     => $resultId,
            'sessionId'              => $sessionId,
            'programId'              => $programId,
            'programTitle'           => $program['title'] ?? 'Training Program',
            'category'               => $program['category'] ?? 'Hospitality Standard',
            'dept'                   => $session['dept'] ?? $program['dept'] ?? 'Hotel Operations',
            'associateId'            => $associateId,
            'associateName'          => $associateName,
            'associateRole'          => $associateRole,
            'associateAvatar'        => $associateAvatar,
            'trainerName'            => $session['trainerName'] ?? 'Lead Trainer',
            'completionDate'         => date('M d, Y'),
            'attendanceRate'         => '100%',
            'quizScore'              => $calculatedScore,
            'passingThreshold'       => $passingThreshold,
            'resultStatus'           => $resultStatus,
            'feedbackRating'         => $kirkpatrickAvg,
            'feedbackNotes'          => $feedbackNotes,
            'certificateReference'   => $certReference,
            'competencyTarget'       => $program['targetCompetency'] ?? 'Core Competency',
            'competencyKey'          => $program['competencyKey'] ?? '',
            'competencyScoreBefore'  => 3.5,
            'competencyScoreAfter'   => 4.8,
            'syncedToProfile'        => true,
            'xpAwarded'              => $isPassed ? (int)($program['xpAward'] ?? 150) : 0
        ];
        $this->evaluationModel->createEvaluation($evaluationRecord);

        // 6. Update Session Roster Participant
        $this->sessionModel->updateRosterParticipant($sessionId, $associateId, [
            'attendanceStatus' => 'Completed',
            'attendanceRate'   => 100,
            'evaluationStatus' => 'Completed',
            'score'            => $calculatedScore,
            'resultId'         => $resultId
        ]);

        // 7. Trigger Closed-Loop Integration
        $integrationResults = [];
        if ($isPassed) {
            $integrationResults = $this->integrationController->handleCertificationSuccess($evaluationRecord, $issuedCertificate ?? []);
        }

        return [
            'success' => true,
            'message' => $isPassed
                ? "Evaluation passed! +{$evaluationRecord['xpAwarded']} XP awarded and Certificate {$certReference} issued."
                : "Evaluation completed. Score ({$calculatedScore}%) is below passing threshold ({$passingThreshold}%).",
            'data' => [
                'isPassed'            => $isPassed,
                'quizScore'           => $calculatedScore,
                'passingThreshold'    => $passingThreshold,
                'certificateNumber'   => $certReference,
                'certificate'         => $issuedCertificate,
                'evaluation'          => $evaluationRecord,
                'integration'         => $integrationResults
            ]
        ];
    }
}
