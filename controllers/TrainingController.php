<?php

require_once __DIR__ . '/../models/TrainingNeedModel.php';
require_once __DIR__ . '/../models/TrainingProgramModel.php';
require_once __DIR__ . '/../models/TrainingSessionModel.php';
require_once __DIR__ . '/../models/EvaluationModel.php';
require_once __DIR__ . '/../models/TrainingReportModel.php';
require_once __DIR__ . '/../models/CertificateModel.php';
require_once __DIR__ . '/../models/NotificationModel.php';

class TrainingController
{
    private TrainingNeedModel $needModel;
    private TrainingProgramModel $programModel;
    private TrainingSessionModel $sessionModel;
    private EvaluationModel $evaluationModel;
    private TrainingReportModel $reportModel;
    private CertificateModel $certificateModel;
    private NotificationModel $notificationModel;

    public function __construct()
    {
        $this->needModel = new TrainingNeedModel();
        $this->programModel = new TrainingProgramModel();
        $this->sessionModel = new TrainingSessionModel();
        $this->evaluationModel = new EvaluationModel();
        $this->reportModel = new TrainingReportModel();
        $this->certificateModel = new CertificateModel();
        $this->notificationModel = new NotificationModel();
    }

    // 1. Training Needs
    public function getNeeds(array $filters = []): array
    {
        $needs = $this->needModel->getNeeds($filters);
        return [
            'success' => true,
            'data'    => $needs
        ];
    }

    public function createNeed(array $data): array
    {
        if (empty($data['title'])) {
            return ['success' => false, 'message' => 'Need title is required.'];
        }
        $created = $this->needModel->createNeed($data);
        return [
            'success' => true,
            'message' => 'Training need registered successfully.',
            'data'    => $created
        ];
    }

    public function assignProgram(array $data): array
    {
        $needId = $data['needId'] ?? ($data['need_id'] ?? '');
        $programId = $data['programId'] ?? ($data['program_id'] ?? '');

        if (empty($needId) || empty($programId)) {
            return ['success' => false, 'message' => 'Need ID and Program ID are required.'];
        }

        $updated = $this->needModel->assignProgram($needId, $programId);

        // Notify the assigned associate
        $need = $this->needModel->find($needId);
        $program = $this->programModel->getProgramById($programId);
        $empId = $need['employee_id'] ?? ($need['employeeId'] ?? '');
        $progTitle = $program['title'] ?? ($program['name'] ?? 'Hospitality Mastery Program');

        if (!empty($empId)) {
            $this->notificationModel->createNotification([
                'recipient_role' => 'Associate',
                'user_id'        => $empId,
                'type'           => 'training_assigned',
                'title'          => "Training Program Assigned 📚",
                'message'        => "You have been assigned to \"{$progTitle}\" to resolve your " . ($need['category'] ?? 'Service Excellence') . " skill requirement.",
                'related_id'     => $programId
            ]);
        }

        return [
            'success' => true,
            'message' => 'Training program assigned to associate successfully.',
            'data'    => $updated
        ];
    }

    // 2. Training Programs
    public function getPrograms(array $filters = []): array
    {
        $programs = $this->programModel->getPrograms($filters);
        return [
            'success' => true,
            'data'    => $programs
        ];
    }

    public function createProgram(array $data): array
    {
        if (empty($data['title']) || empty($data['dept'])) {
            return ['success' => false, 'message' => 'Program title and department are required.'];
        }
        $created = $this->programModel->createProgram($data);
        return [
            'success' => true,
            'message' => 'Training program created successfully.',
            'data'    => $created
        ];
    }

    // 3. Training Sessions
    public function getSessions(array $filters = []): array
    {
        $sessions = $this->sessionModel->getSessions($filters);
        return [
            'success' => true,
            'data'    => $sessions
        ];
    }

    public function createSession(array $data): array
    {
        if (empty($data['title']) || empty($data['programId']) || empty($data['date'])) {
            return ['success' => false, 'message' => 'Session title, program, and date are required.'];
        }
        $created = $this->sessionModel->createSession($data);

        // Notify all rostered associates
        $roster = $created['roster'] ?? ($data['roster'] ?? []);
        if (is_string($roster)) {
            $roster = json_decode($roster, true) ?: [];
        }
        if (is_array($roster)) {
            foreach ($roster as $p) {
                $empId = $p['associateId'] ?? ($p['employee_id'] ?? ($p['id'] ?? ''));
                if (!empty($empId)) {
                    $sessionTitle = $created['title'] ?? 'Hospitality Training Session';
                    $sessionDate = $created['session_date'] ?? ($created['date'] ?? 'Upcoming');
                    $sessionTime = $created['time_slot'] ?? ($created['time'] ?? '14:00 - 17:30');
                    $location = $created['location'] ?? 'Executive Boardroom';
                    $trainer = $created['trainer_name'] ?? 'Lead Master Trainer';

                    $this->notificationModel->createNotification([
                        'recipient_role' => 'Associate',
                        'user_id'        => $empId,
                        'type'           => 'training_session',
                        'title'          => "Training Scheduled: {$sessionTitle} 🎓",
                        'message'        => "You have been scheduled for \"{$sessionTitle}\" on {$sessionDate} ({$sessionTime}) at {$location} with trainer {$trainer}.",
                        'related_id'     => $created['id']
                    ]);
                }
            }
        }

        return [
            'success' => true,
            'message' => 'Training session scheduled successfully.',
            'data'    => $created
        ];
    }

    // 4. Evaluations / Results List
    public function getResults(array $filters = []): array
    {
        $evaluations = $this->evaluationModel->getEvaluations($filters);
        return [
            'success' => true,
            'data'    => $evaluations
        ];
    }

    // 5. Training Reports & Audit Analytics
    public function getReports(array $filters = []): array
    {
        $dept = $filters['department'] ?? null;
        $summary = $this->reportModel->getSummaryAnalytics($dept);
        return [
            'success' => true,
            'data'    => $summary
        ];
    }

    // 6. Digital Certificates
    public function getCertificates(array $filters = []): array
    {
        $certs = $this->certificateModel->getCertificates($filters);
        return [
            'success' => true,
            'data'    => $certs
        ];
    }

    // 7. Master Bootstrap Data (Fetches all states in a single payload)
    public function getBootstrapData(): array
    {
        return [
            'success' => true,
            'data'    => [
                'needs'        => $this->needModel->getNeeds(),
                'programs'     => $this->programModel->getPrograms(),
                'sessions'     => $this->sessionModel->getSessions(),
                'results'      => $this->evaluationModel->getEvaluations(),
                'certificates' => $this->certificateModel->getCertificates(),
                'reports'      => $this->reportModel->getSummaryAnalytics()
            ]
        ];
    }
}
