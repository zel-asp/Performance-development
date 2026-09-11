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

        // 1. Direct PDO query on employees table joined with departments
        try {
            $pdo = getSupabaseDb();
            if ($pdo) {
                $stmt = $pdo->prepare('
                    SELECT d.name AS dept_name 
                    FROM public.employees e 
                    JOIN public.departments d ON e.department_id = d.id 
                    WHERE e.id = :id LIMIT 1
                ');
                $stmt->execute([':id' => $userId]);
                $deptRow = $stmt->fetch(PDO::FETCH_ASSOC);
                if (!empty($deptRow['dept_name']) && strtolower(trim($deptRow['dept_name'])) !== 'general') {
                    return $deptRow['dept_name'];
                }

                // Fallback: check users table
                $stmt2 = $pdo->prepare('SELECT department FROM public.users WHERE id = :id LIMIT 1');
                $stmt2->execute([':id' => $userId]);
                $userRow = $stmt2->fetch(PDO::FETCH_ASSOC);
                if (!empty($userRow['department']) && strtolower(trim($userRow['department'])) !== 'general') {
                    return $userRow['department'];
                }
            }
        } catch (Throwable $e) {
            error_log('[TrainingController] PDO department lookup failed for user ' . $userId . ': ' . $e->getMessage());
        }

        // 2. REST API queries as secondary fallback
        $endpoints = [
            'employees?id=eq.' . urlencode($userId) . '&select=department,department_id,departments(name)',
            'users?id=eq.' . urlencode($userId) . '&select=department',
        ];

        foreach ($endpoints as $ep) {
            $res = supabaseRequest($ep, 'GET', null, true);
            if ($res['status'] === 200 && is_array($res['data']) && !empty($res['data'][0])) {
                $d = $res['data'][0];
                $dept = $d['departments']['name'] ?? ($d['department'] ?? null);
                if ($dept && strtolower(trim($dept)) !== 'general') return $dept;
            }
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
            'culinary & f&b' => ['culinary', 'f&b service', 'f & b service', 'food & beverage', 'kitchen'],
            'kitchen' => ['culinary', 'f&b service', 'food & beverage', 'culinary & f&b'],
            'front office' => ['front office', 'fo'],
            'housekeeping' => ['housekeeping', 'hk'],
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
        if (!$dept) {
            error_log('[TrainingController] filterForSupervisor: department could not be resolved for user ' . $userId . ' (role=' . $role . '). Returning all items as fallback.');
            return $items;
        }

        // Build map of employee departments so cross-department training is matched by either program dept or associate dept
        $empDeptMap = [];
        foreach ($this->getEmployeesList() as $emp) {
            if (!empty($emp['id']) && !empty($emp['department'])) {
                $empDeptMap[strtolower(trim($emp['id']))] = $emp['department'];
            }
        }

        return array_values(array_filter($items, function($item) use ($dept, $empDeptMap) {
            if ($this->matchesDepartment($item, $dept)) return true;
            $assocId = strtolower(trim($item['associate_id'] ?? ($item['associateId'] ?? ($item['employee_id'] ?? ($item['employeeId'] ?? '')))));
            if ($assocId && isset($empDeptMap[$assocId])) {
                if ($this->matchesDepartment(['dept' => $empDeptMap[$assocId]], $dept)) return true;
            }
            return false;
        }));
    }

    // 1. Training Needs
    public function getNeeds(array $filters = []): array
    {
        $role = strtolower(trim($filters['role'] ?? ($filters['user_role'] ?? 'Associate')));
        $userId = trim($filters['user_id'] ?? ($filters['userId'] ?? ''));
        $scope = strtolower(trim($filters['scope'] ?? ''));
        $modelFilters = array_diff_key($filters, array_flip(['role', 'user_role', 'user_id', 'userId', 'scope', 'action', 'controller', 'csrf_token', '_', 'apiKey']));
        $needs = $this->needModel->getNeeds($modelFilters);
        if ($scope !== 'all') {
            $needs = $this->filterForSupervisor($needs, $userId, $role);
        }
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
        $scope = strtolower(trim($filters['scope'] ?? ''));
        $dept = trim($filters['department'] ?? ($filters['dept'] ?? ''));
        $modelFilters = array_diff_key($filters, array_flip(['role', 'user_role', 'user_id', 'userId', 'scope', 'department', 'dept', 'action', 'controller', 'csrf_token', '_', 'apiKey']));
        $evaluations = $this->evaluationModel->getEvaluations($modelFilters);
        if ($dept !== '' && strtolower($dept) !== 'all') {
            $evaluations = array_values(array_filter($evaluations, fn($item) => $this->matchesDepartment($item, $dept)));
        } elseif ($scope !== 'all') {
            $evaluations = $this->filterForSupervisor($evaluations, $userId, $role);
        }
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

    /**
     * Get active hotel employees directly from employees table for training participant rosters
     */
    public function getEmployeesList(): array
    {
        // 1. Direct PDO query for speed
        try {
            $pdo = getSupabaseDb();
            if ($pdo) {
                $stmt = $pdo->query('
                    SELECT e.id, e.full_name, e.title, e.role, e.avatar_url, COALESCE(d.name, \'General\') AS department
                    FROM public.employees e
                    LEFT JOIN public.departments d ON e.department_id = d.id
                    ORDER BY e.full_name ASC
                ');
                $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
                if (!empty($rows)) {
                    return $rows;
                }
            }
        } catch (Throwable $e) {
            error_log('[TrainingController] getEmployeesList PDO failed: ' . $e->getMessage());
        }

        // 2. REST fallback
        $empRes = supabaseRequest('employees?select=id,full_name,title,role,avatar_url,department,departments(name)&order=full_name.asc', 'GET', null, true);
        $emps = is_array($empRes['data'] ?? null) ? $empRes['data'] : [];
        $result = [];
        foreach ($emps as $e) {
            $result[] = [
                'id'         => $e['id'] ?? '',
                'full_name'  => $e['full_name'] ?? ($e['name'] ?? 'Associate'),
                'title'      => $e['title'] ?? ($e['role'] ?? 'Staff'),
                'role'       => $e['role'] ?? 'Associate',
                'avatar_url' => $e['avatar_url'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                'department' => $e['departments']['name'] ?? ($e['department'] ?? 'General')
            ];
        }
        return $result;
    }

    // 7. Master Bootstrap Data (Fetches all states in a single payload)
    public function getBootstrapData(array $payload = []): array
    {
        $role = strtolower(trim($payload['role'] ?? ($payload['user_role'] ?? 'Associate')));
        $userId = trim($payload['user_id'] ?? ($payload['userId'] ?? ''));
        $scope = strtolower(trim($payload['scope'] ?? ''));
        $modelFilters = array_diff_key($payload, array_flip(['role', 'user_role', 'user_id', 'userId', 'scope', 'action', 'controller', 'csrf_token', '_', 'apiKey']));

        $allNeeds = $this->needModel->getNeeds($modelFilters);
        $needs = $allNeeds;
        $programs = $this->programModel->getPrograms($modelFilters);
        $allSessions = $this->sessionModel->getSessions($modelFilters);
        $sessions = $allSessions;
        $allResults = $this->evaluationModel->getEvaluations($modelFilters);
        $results = $allResults;
        $allCertificates = $this->certificateModel->getCertificates($modelFilters);
        $certificates = $allCertificates;
        $employees = $this->getEmployeesList();

        if ($scope !== 'all') {
            $needs = $this->filterForSupervisor($needs, $userId, $role);
            // Keep all approved training programs accessible in the catalog so supervisors can assign cross-functional curricula
            $sessions = $this->filterForSupervisor($sessions, $userId, $role);
            $results = $this->filterForSupervisor($results, $userId, $role);
            $certificates = $this->filterForSupervisor($certificates, $userId, $role);
        }

        return [
            'success' => true,
            'data'    => [
                'needs'                => $needs,
                'propertyNeeds'        => $allNeeds,
                'allNeeds'             => $allNeeds,
                'programs'             => $programs,
                'sessions'             => $sessions,
                'allSessions'          => $allSessions,
                'propertySessions'     => $allSessions,
                'results'              => $results,
                'allResults'           => $allResults,
                'propertyResults'      => $allResults,
                'certificates'         => $certificates,
                'allCertificates'      => $allCertificates,
                'propertyCertificates' => $allCertificates,
                'employees'            => $employees,
                'reports'              => $this->reportModel->getSummaryAnalytics($this->isSupervisor($role) ? $this->getSupervisorDepartment($userId, $role) : null)
            ]
        ];
    }
}
