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

    private function isSupervisor(string $role): bool
    {
        $r = strtolower(trim($role));
        return in_array($r, ['supervisor', 'manager', 'depthead'], true);
    }

    private function getSupervisorDepartment(string $userId, string $role): ?string
    {
        if (empty($userId)) return null;
        $res = supabaseRequest('users?id=eq.' . urlencode($userId) . '&select=department', 'GET', null, true);
        if ($res['status'] === 200 && !empty($res['data'][0]['department'])) {
            return $res['data'][0]['department'];
        }
        return null;
    }

    private function matchesDepartment(array $item, ?string $dept): bool
    {
        if (!$dept) return true;
        $itemDept = strtolower(trim($item['dept'] ?? $item['department'] ?? ''));
        return $itemDept === strtolower($dept) || $itemDept === '';
    }

    private function filterForSupervisor(array $items, string $userId, string $role): array
    {
        if (!$this->isSupervisor($role)) return $items;
        $dept = $this->getSupervisorDepartment($userId, $role);
        if (!$dept) return $items;
        return array_values(array_filter($items, fn($item) => $this->matchesDepartment($item, $dept)));
    }

    // 1. Training Needs
    public function getNeeds(array $filters = []): array
    {
        $role = strtolower(trim($filters['role'] ?? ($filters['user_role'] ?? 'Associate')));
        $userId = trim($filters['user_id'] ?? ($filters['userId'] ?? ''));
        $modelFilters = array_diff_key($filters, array_flip(['role', 'user_role', 'user_id', 'userId', 'action', 'controller', 'csrf_token', '_', 'apiKey']));
        $needs = $this->needModel->getNeeds($modelFilters);
        $needs = $this->filterForSupervisor($needs, $userId, $role);
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
        $role = strtolower(trim($filters['role'] ?? ($filters['user_role'] ?? 'Associate')));
        $userId = trim($filters['user_id'] ?? ($filters['userId'] ?? ''));
        $modelFilters = array_diff_key($filters, array_flip(['role', 'user_role', 'user_id', 'userId', 'action', 'controller', 'csrf_token', '_', 'apiKey']));
        $programs = $this->programModel->getPrograms($modelFilters);
        $programs = $this->filterForSupervisor($programs, $userId, $role);
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
        $role = strtolower(trim($filters['role'] ?? ($filters['user_role'] ?? 'Associate')));
        $userId = trim($filters['user_id'] ?? ($filters['userId'] ?? ''));
        $modelFilters = array_diff_key($filters, array_flip(['role', 'user_role', 'user_id', 'userId', 'action', 'controller', 'csrf_token', '_', 'apiKey']));
        $sessions = $this->sessionModel->getSessions($modelFilters);
        $sessions = $this->filterForSupervisor($sessions, $userId, $role);
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
        $role = strtolower(trim($filters['role'] ?? ($filters['user_role'] ?? 'Associate')));
        $userId = trim($filters['user_id'] ?? ($filters['userId'] ?? ''));
        $modelFilters = array_diff_key($filters, array_flip(['role', 'user_role', 'user_id', 'userId', 'action', 'controller', 'csrf_token', '_', 'apiKey']));
        $evaluations = $this->evaluationModel->getEvaluations($modelFilters);
        $evaluations = $this->filterForSupervisor($evaluations, $userId, $role);
        return [
            'success' => true,
            'data'    => $evaluations
        ];
    }

    // 5. Training Reports & Audit Analytics
    public function getReports(array $filters = []): array
    {
        $role = strtolower(trim($filters['role'] ?? ($filters['user_role'] ?? 'Associate')));
        $userId = trim($filters['user_id'] ?? ($filters['userId'] ?? ''));
        $dept = $filters['department'] ?? null;
        if ($this->isSupervisor($role)) {
            $dept = $dept ?? $this->getSupervisorDepartment($userId, $role);
        }
        $summary = $this->reportModel->getSummaryAnalytics($dept);
        return [
            'success' => true,
            'data'    => $summary
        ];
    }

    // 6. Digital Certificates
    public function getCertificates(array $filters = []): array
    {
        $role = strtolower(trim($filters['role'] ?? ($filters['user_role'] ?? 'Associate')));
        $userId = trim($filters['user_id'] ?? ($filters['userId'] ?? ''));
        $modelFilters = array_diff_key($filters, array_flip(['role', 'user_role', 'user_id', 'userId', 'action', 'controller', 'csrf_token', '_', 'apiKey']));
        $certs = $this->certificateModel->getCertificates($modelFilters);
        $certs = $this->filterForSupervisor($certs, $userId, $role);
        return [
            'success' => true,
            'data'    => $certs
        ];
    }

    // 7. Master Bootstrap Data (Fetches all states in a single payload)
    public function getBootstrapData(array $payload = []): array
    {
        $role = strtolower(trim($payload['role'] ?? ($payload['user_role'] ?? 'Associate')));
        $userId = trim($payload['user_id'] ?? ($payload['userId'] ?? ''));
        $modelFilters = array_diff_key($payload, array_flip(['role', 'user_role', 'user_id', 'userId', 'action', 'controller', 'csrf_token', '_', 'apiKey']));

        $needs = $this->needModel->getNeeds($modelFilters);
        $programs = $this->programModel->getPrograms($modelFilters);
        $sessions = $this->sessionModel->getSessions($modelFilters);
        $results = $this->evaluationModel->getEvaluations($modelFilters);
        $certificates = $this->certificateModel->getCertificates($modelFilters);

        $needs = $this->filterForSupervisor($needs, $userId, $role);
        $programs = $this->filterForSupervisor($programs, $userId, $role);
        $sessions = $this->filterForSupervisor($sessions, $userId, $role);
        $results = $this->filterForSupervisor($results, $userId, $role);
        $certificates = $this->filterForSupervisor($certificates, $userId, $role);

        return [
            'success' => true,
            'data'    => [
                'needs'        => $needs,
                'programs'     => $programs,
                'sessions'     => $sessions,
                'results'      => $results,
                'certificates' => $certificates,
                'reports'      => $this->reportModel->getSummaryAnalytics($this->isSupervisor($role) ? $this->getSupervisorDepartment($userId, $role) : null)
            ]
        ];
    }
}
