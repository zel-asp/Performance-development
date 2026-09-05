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
        $role = strtolower(trim($payload['role'] ?? ($payload['user_role'] ?? 'Associate')));
        if (in_array($role, ['supervisor', 'manager', 'depthead'], true)) {
            return [
                'success' => false,
                'message' => 'Access denied: Supervisors cannot submit training evaluations. The assigned associate must complete the evaluation quiz themselves.'
            ];
        }

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

        // 1. Resolve or Fallback Program
        $program = $this->programModel->getProgramById($programId);
        if (!$program) {
            $program = [
                'id' => $programId,
                'title' => $payload['programTitle'] ?? 'Hospitality Crisis Diplomacy & Guest De-escalation',
                'category' => 'Skill Gap & Compliance',
                'dept' => 'Front Office',
                'duration' => '3.5 Hours',
                'format' => 'In-Person Workshop & Roleplay',
                'passingScore' => 80,
                'xpAward' => 150,
                'competencyKey' => 'guest_complaint_handling',
                'targetCompetency' => 'Guest Complaint Handling & VIP Protocol',
                'quizQuestions' => [
                    ['q' => 'What is the benchmark standard response time for VIP guest requests?', 'correct' => 0],
                    ['q' => 'Which protocol must be followed when a guest escalates a service delay?', 'correct' => 0]
                ]
            ];
        }

        // 2. Resolve or Fallback Session
        $session = $this->sessionModel->getSessionById($sessionId);
        if (!$session) {
            $session = [
                'id' => $sessionId,
                'programId' => $programId,
                'trainerName' => $payload['trainerName'] ?? 'Lead Master Trainer',
                'dept' => $program['dept'] ?? 'Front Office',
                'roster' => []
            ];
        }

        // 3. Resolve Associate info from Database
        $empRes = supabaseRequest('employees?id=eq.' . urlencode($associateId), 'GET', null, true);
        $empData = !empty($empRes['data'][0]) ? $empRes['data'][0] : null;
        if (!$empData) {
            $userRes = supabaseRequest('users?id=eq.' . urlencode($associateId), 'GET', null, true);
            $empData = !empty($userRes['data'][0]) ? $userRes['data'][0] : null;
        }

        $associateName = $empData['full_name'] ?? ($empData['name'] ?? ($payload['associateName'] ?? 'Associate'));
        $associateRole = $empData['title'] ?? ($empData['role'] ?? ($payload['associateRole'] ?? 'Hotel Staff'));
        $associateAvatar = $empData['avatar_url'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

        $roster = $session['roster'] ?? [];
        foreach ($roster as $p) {
            if (($p['associateId'] ?? '') === $associateId) {
                $associateName = $p['name'] ?? $associateName;
                $associateRole = $p['role'] ?? $associateRole;
                $associateAvatar = $p['avatar'] ?? $associateAvatar;
                break;
            }
        }

        // 4. Auto-Grade Quiz Questions
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

        require_once __DIR__ . '/../models/CompetencyModel.php';
        $competencyModel = new CompetencyModel();
        $compKey = $program['competencyKey'] ?? '';
        
        $currentComp = $compKey ? $competencyModel->getEmployeeCompetency($associateId, $compKey) : null;
        $scoreBefore = $currentComp ? (float)($currentComp['current_score'] ?? 3.0) : 3.0;
        
        // Capped at 5.0, increase by 1.0 if passed
        $scoreAfter = $isPassed ? min($scoreBefore + 1.0, 5.0) : $scoreBefore;

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
            'competencyKey'          => $compKey,
            'competencyScoreBefore'  => $scoreBefore,
            'competencyScoreAfter'   => $scoreAfter,
            'syncedToProfile'        => $isPassed,
            'xpAwarded'              => $isPassed ? (int)($program['xpAward'] ?? 150) : 0
        ];
        
        // Convert camelCase to snake_case for the database model to match schema
        $dbRecord = $evaluationRecord;
        $dbRecord['session_id'] = $dbRecord['sessionId'];
        $dbRecord['program_id'] = $dbRecord['programId'];
        $dbRecord['employee_id'] = $dbRecord['associateId'];
        $dbRecord['quiz_score'] = $dbRecord['quizScore'];
        $dbRecord['kirkpatrick_rating'] = $dbRecord['feedbackRating'];
        $dbRecord['feedback_notes'] = $dbRecord['feedbackNotes'];
        $dbRecord['certificate_reference'] = $dbRecord['certificateReference'];
        $dbRecord['xp_awarded'] = $dbRecord['xpAwarded'];
        $dbRecord['competency_key'] = $dbRecord['competencyKey'];
        $dbRecord['competency_score_before'] = $dbRecord['competencyScoreBefore'];
        $dbRecord['competency_score_after'] = $dbRecord['competencyScoreAfter'];
        $dbRecord['synced_to_profile'] = $dbRecord['syncedToProfile'];
        
        // Unset camelCase keys from dbRecord
        unset($dbRecord['sessionId'], $dbRecord['programId'], $dbRecord['associateId'], $dbRecord['quizScore'], $dbRecord['feedbackRating'], $dbRecord['feedbackNotes'], $dbRecord['certificateReference'], $dbRecord['xpAwarded'], $dbRecord['competencyKey'], $dbRecord['competencyScoreBefore'], $dbRecord['competencyScoreAfter'], $dbRecord['syncedToProfile']);
        
        $this->evaluationModel->createEvaluation($dbRecord);

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

            require_once __DIR__ . '/../models/NotificationModel.php';
            $notifModel = new NotificationModel();
            $notifModel->createNotification([
                'recipient_role' => 'Associate',
                'user_id'        => $associateId,
                'type'           => 'training_passed',
                'title'          => "Training Passed & Certified! 🏆",
                'message'        => "Congratulations! You passed \"{$evaluationRecord['programTitle']}\" with a score of {$calculatedScore}% and earned +{$evaluationRecord['xpAwarded']} XP. Certificate Ref: {$certReference}.",
                'related_id'     => $certReference
            ]);
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
