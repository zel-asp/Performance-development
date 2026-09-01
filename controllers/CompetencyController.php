<?php

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../models/AuthModel.php';

class CompetencyController
{
    private AuthModel $authModel;

    public function __construct()
    {
        $this->authModel = new AuthModel();
    }

    /**
     * Get All Departments from Supabase
     */
    public function getDepartments(): array
    {
        $res = supabaseRequest('departments?order=name.asc', 'GET', null, true);
        if ($res['status'] === 200 && is_array($res['data'])) {
            return [
                'success' => true,
                'data' => $res['data']
            ];
        }

        // Fallback default list if connection issue
        return [
            'success' => true,
            'data' => [
                ['id' => '967ff30a-61cf-4bda-a839-58439aaaa231', 'name' => 'Front Office'],
                ['id' => '505ff947-5c21-4f4a-a117-27d4d7dac341', 'name' => 'Housekeeping'],
                ['id' => '543ce4b1-5fe7-4a2e-928b-a6a231c020c8', 'name' => 'Food & Beverage'],
                ['id' => '5faaf16b-0110-4075-8c0b-0d5574a377f0', 'name' => 'Kitchen'],
                ['id' => '3726eda4-303f-44f1-b572-3dc7eaf1c115', 'name' => 'Human Resources'],
                ['id' => '92ebfa72-fc2b-46e5-93d1-30bf73cd31bc', 'name' => 'Finance'],
                ['id' => '47514966-bb18-415a-9fa0-ae95fd3af976', 'name' => 'Sales & Marketing'],
                ['id' => '8828aa21-6da6-427a-bd06-743606e27b1d', 'name' => 'Engineering'],
                ['id' => '67f88bfa-289e-4365-b985-5cf24b915198', 'name' => 'Security']
            ]
        ];
    }

    /**
     * Get Competencies from Supabase (General + Specific)
     */
    public function getCompetencies(array $params = []): array
    {
        $deptId = $params['department_id'] ?? $params['dept_id'] ?? null;
        $scope = $params['scope'] ?? null;

        $query = 'competencies?order=scope.asc,name.asc';
        if (!empty($scope)) {
            $query .= '&scope=eq.' . urlencode($scope);
        }

        $res = supabaseRequest($query, 'GET', null, true);
        $all = is_array($res['data']) ? $res['data'] : [];

        if (!empty($deptId) && $deptId !== 'all') {
            // Resolve department ID from UUID, slug, or name
            $resolvedDeptId = $deptId;
            $deptRes = supabaseRequest('departments', 'GET', null, true);
            $departments = is_array($deptRes['data']) ? $deptRes['data'] : [];
            $cleanDept = str_replace('_', ' ', strtolower(trim($deptId)));
            foreach ($departments as $d) {
                if ($d['id'] === $deptId || strtolower(trim($d['name'])) === $cleanDept || strpos(strtolower($d['name']), $cleanDept) !== false || strpos($cleanDept, strtolower($d['name'])) !== false) {
                    $resolvedDeptId = $d['id'];
                    break;
                }
            }

            // Filter: General OR Specific matching resolvedDeptId
            $filtered = [];
            foreach ($all as $c) {
                $cScope = $c['scope'] ?? 'General';
                $cDept = $c['department_id'] ?? null;
                if ($cScope === 'General' || $cDept === $resolvedDeptId || $cDept === $deptId) {
                    $filtered[] = $c;
                }
            }
            return ['success' => true, 'data' => $filtered];
        }

        return ['success' => true, 'data' => $all];
    }

    /**
     * Create New Competency in Supabase
     */
    public function createCompetency(array $payload): array
    {
        $name = trim($payload['name'] ?? '');
        if (empty($name)) {
            return ['success' => false, 'message' => 'Competency Name is required.'];
        }

        $key = trim($payload['key'] ?? '');
        if (empty($key)) {
            // Generate clean key e.g. CUSTOMER_SERVICE
            $key = strtoupper(preg_replace('/[^A-Za-z0-9_]/', '', str_replace(' ', '_', $name)));
        }

        $scope = in_array(ucfirst(strtolower($payload['scope'] ?? '')), ['General', 'Specific']) ? ucfirst(strtolower($payload['scope'])) : 'General';
        $departmentId = $scope === 'Specific' ? ($payload['department_id'] ?? null) : null;
        $position = $scope === 'Specific' ? (!empty($payload['position']) ? trim($payload['position']) : null) : null;
        $category = !empty($payload['category']) ? trim($payload['category']) : 'Core Competency';
        $description = !empty($payload['description']) ? trim($payload['description']) : null;
        $benchmark = isset($payload['benchmark_score']) ? (float)$payload['benchmark_score'] : 4.50;
        $maxScore = isset($payload['max_score']) ? (float)$payload['max_score'] : 5.00;

        if ($scope === 'Specific' && empty($departmentId)) {
            return ['success' => false, 'message' => 'Department is required for Specific competencies.'];
        }

        $data = [
            'key' => $key,
            'name' => $name,
            'category' => $category,
            'department_id' => $departmentId,
            'description' => $description,
            'benchmark_score' => $benchmark,
            'max_score' => $maxScore,
            'scope' => $scope,
            'position' => $position,
            'created_at' => date('c'),
            'updated_at' => date('c')
        ];

        $res = supabaseRequest('competencies', 'POST', $data, true);
        if ($res['status'] >= 200 && $res['status'] < 300) {
            return [
                'success' => true,
                'message' => 'Competency created successfully in database.',
                'data' => is_array($res['data']) && isset($res['data'][0]) ? $res['data'][0] : $data
            ];
        }

        return [
            'success' => false,
            'message' => $res['error'] ?? 'Failed to save competency to database.',
            'raw' => $res
        ];
    }

    /**
     * Get Assessments from Supabase
     */
    public function getAssessments(array $params = []): array
    {
        $empId = $params['employee_id'] ?? null;
        if (!empty($empId)) {
            $clean = strtolower(trim($empId));
            if ($clean === 'maria_santos' || str_contains($clean, 'maria')) {
                $empId = 'emp-101';
            } elseif ($clean === 'marco_rossi' || $clean === 'antonio_silva' || str_contains($clean, 'antonio')) {
                $empId = 'emp-102';
            } elseif ($clean === 'john_marco' || $clean === 'elena_vance' || str_contains($clean, 'john')) {
                $empId = 'emp-103';
            }
        }

        // 1. High-Speed Direct Database Query
        try {
            $pdo = getSupabaseDb();
            if ($pdo) {
                $sql = "
                    SELECT 
                        ca.id, ca.employee_id, ca.competency_id, ca.score, ca.assessed_by, ca.assessment_date, ca.comments,
                        c.name as competency_name, c.category, c.benchmark_score, c.max_score
                    FROM competency_assessments ca
                    LEFT JOIN competencies c ON ca.competency_id = c.id
                ";
                $bindings = [];
                if (!empty($empId)) {
                    $sql .= " WHERE ca.employee_id = :emp_id";
                    $bindings[':emp_id'] = $empId;
                }
                $sql .= " ORDER BY ca.assessment_date DESC";

                $stmt = $pdo->prepare($sql);
                $stmt->execute($bindings);
                $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

                foreach ($rows as &$a) {
                    $a['benchmark_score'] = (float)($a['benchmark_score'] ?? 4.0);
                    $a['max_score'] = (float)($a['max_score'] ?? 5.0);
                    $a['rating'] = (float)($a['score'] ?? 0);
                }

                return [
                    'success' => true,
                    'data' => $rows
                ];
            }
        } catch (\Throwable $e) {
            error_log("PDO getAssessments fallback note: " . $e->getMessage());
        }

        // 2. REST API Fallback
        $query = 'competency_assessments?order=assessment_date.desc';
        if (!empty($empId)) {
            $query .= '&employee_id=eq.' . urlencode($empId);
        }

        $res = supabaseRequest($query, 'GET', null, true);
        $assessments = is_array($res['data']) ? $res['data'] : [];

        // Enrich with competency metadata
        $compRes = supabaseRequest('competencies', 'GET', null, true);
        $comps = is_array($compRes['data']) ? $compRes['data'] : [];
        $compMap = [];
        foreach ($comps as $c) {
            $compMap[$c['id']] = $c;
        }

        foreach ($assessments as &$a) {
            $compId = $a['competency_id'] ?? null;
            if ($compId && isset($compMap[$compId])) {
                $c = $compMap[$compId];
                $a['competency_name'] = $c['name'] ?? null;
                $a['category'] = $c['category'] ?? null;
                $a['benchmark_score'] = (float)($c['benchmark_score'] ?? 4.0);
                $a['max_score'] = (float)($c['max_score'] ?? 5.0);
                $a['rating'] = (float)($a['score'] ?? 0);
            }
        }

        return [
            'success' => true,
            'data' => $assessments
        ];
    }

    /**
     * Save or Update Assessments for an Employee in Supabase (No Duplicates)
     */
    public function saveAssessments(array $payload): array
    {
        $employeeId = $payload['employee_id'] ?? null;
        $assessedBy = $payload['assessed_by'] ?? 'emp-103';
        $ratings = $payload['ratings'] ?? []; // Array of ['competency_id' => ..., 'score' => ..., 'comments' => ...]
        $generalNotes = $payload['notes'] ?? $payload['comments'] ?? null;

        if (empty($employeeId)) {
            return ['success' => false, 'message' => 'Employee ID is required.'];
        }

        if (empty($ratings) && isset($payload['competency_id']) && isset($payload['score'])) {
            $ratings[] = [
                'competency_id' => $payload['competency_id'],
                'score' => (float)$payload['score'],
                'comments' => $payload['comments'] ?? $generalNotes
            ];
        }

        if (empty($ratings)) {
            return ['success' => false, 'message' => 'No ratings provided to save.'];
        }

        // 1. Fetch existing assessments for this employee to update existing records
        $existingRes = supabaseRequest('competency_assessments?employee_id=eq.' . urlencode($employeeId), 'GET', null, true);
        $existingList = is_array($existingRes['data']) ? $existingRes['data'] : [];
        $existingByCompId = [];
        foreach ($existingList as $item) {
            $existingByCompId[$item['competency_id']] = $item['id'];
        }

        $now = date('c');
        $updatedCount = 0;
        $insertedCount = 0;

        // 2. Iterate through ratings and update or insert
        foreach ($ratings as $r) {
            $compId = $r['competency_id'] ?? null;
            $score = isset($r['score']) ? (float)$r['score'] : null;
            if (!$compId || $score === null) continue;

            if (isset($existingByCompId[$compId])) {
                // UPDATE existing assessment for this employee and competency
                $existingRecordId = $existingByCompId[$compId];
                $updateData = [
                    'score' => $score,
                    'comments' => $r['comments'] ?? $generalNotes,
                    'assessed_by' => $assessedBy,
                    'assessment_date' => $now,
                    'updated_at' => $now
                ];
                $res = supabaseRequest('competency_assessments?id=eq.' . urlencode($existingRecordId), 'PATCH', $updateData, true);
                if ($res['status'] >= 200 && $res['status'] < 300) {
                    $updatedCount++;
                }
            } else {
                // INSERT only if no existing record for this competency
                $insertData = [
                    'employee_id' => $employeeId,
                    'competency_id' => $compId,
                    'score' => $score,
                    'comments' => $r['comments'] ?? $generalNotes,
                    'assessed_by' => $assessedBy,
                    'assessment_date' => $now,
                    'created_at' => $now,
                    'updated_at' => $now
                ];
                $res = supabaseRequest('competency_assessments', 'POST', $insertData, true);
                if ($res['status'] >= 200 && $res['status'] < 300) {
                    $insertedCount++;
                }
            }
        }

        $totalProcessed = $updatedCount + $insertedCount;

        // 3. Automatically synchronize Skill Gap deficits (< 3.8) to Training Management queue
        $syncedNeeds = [];
        try {
            require_once __DIR__ . '/../models/TrainingNeedModel.php';
            $needModel = new TrainingNeedModel();
            $syncedNeeds = $needModel->syncDeficitsFromAssessments($employeeId);
        } catch (\Throwable $e) {
            // Log sync error without breaking the assessment save response
            error_log('[CompetencyController] TNA Sync Warning: ' . $e->getMessage());
        }

        return [
            'success' => true,
            'message' => "Successfully updated {$updatedCount} and created {$insertedCount} competency assessment records for employee.",
            'updatedCount' => $updatedCount,
            'insertedCount' => $insertedCount,
            'totalProcessed' => $totalProcessed,
            'syncedNeedsCount' => count($syncedNeeds)
        ];
    }

    /**
     * Get Complete Dynamic Matrix Data for selected Department
     */
    public function getMatrixData(array $params = []): array
    {
        $deptFilter = $params['department'] ?? $params['department_id'] ?? 'all';

        // 1. Fetch Departments
        $deptRes = supabaseRequest('departments?order=name.asc', 'GET', null, true);
        $departments = is_array($deptRes['data']) ? $deptRes['data'] : [];
        $deptMap = [];
        $deptNameToId = [];
        foreach ($departments as $d) {
            $deptMap[$d['id']] = $d['name'];
            $deptNameToId[strtolower(trim($d['name']))] = $d['id'];
        }

        // Determine target dept ID and target dept Name
        $targetDeptId = null;
        $targetDeptName = null;
        if (!empty($deptFilter) && $deptFilter !== 'all') {
            if (isset($deptMap[$deptFilter])) {
                $targetDeptId = $deptFilter;
                $targetDeptName = $deptMap[$deptFilter];
            } else {
                // If passed slug e.g. front_office or name e.g. "Front Office"
                $cleanFilter = str_replace('_', ' ', strtolower(trim($deptFilter)));
                foreach ($deptNameToId as $name => $id) {
                    if (strpos($name, $cleanFilter) !== false || strpos($cleanFilter, $name) !== false) {
                        $targetDeptId = $id;
                        $targetDeptName = $deptMap[$id];
                        break;
                    }
                }
            }
        }

        // 2. Fetch Employees directly from public.employees table in Supabase
        $empQuery = 'employees?order=full_name.asc';
        if ($targetDeptId) {
            $empQuery .= '&department_id=eq.' . urlencode($targetDeptId);
        }
        $empRes = supabaseRequest($empQuery, 'GET', null, true);
        $employeesList = is_array($empRes['data']) ? $empRes['data'] : [];

        // 3. Fetch Competencies from public.competencies
        $compsRes = supabaseRequest('competencies?order=scope.asc,name.asc', 'GET', null, true);
        $allComps = is_array($compsRes['data']) ? $compsRes['data'] : [];

        // Filter applicable competencies for this view:
        // Always include all General competencies.
        // Include Specific competencies if their department_id matches targetDeptId (or if targetDeptId is null, include all relevant).
        $applicableComps = [];
        $compKeysSeen = [];

        // A. Add General competencies first
        foreach ($allComps as $c) {
            $scope = $c['scope'] ?? 'General';
            if ($scope === 'General' && !isset($compKeysSeen[$c['id']])) {
                $applicableComps[] = $c;
                $compKeysSeen[$c['id']] = true;
            }
        }

        // B. Add Specific competencies ONLY if a specific department is filtered
        // (When "All Departments" is selected, show ONLY the General competencies in the matrix table)
        if ($targetDeptId) {
            foreach ($allComps as $c) {
                $scope = $c['scope'] ?? 'General';
                if ($scope === 'Specific') {
                    $cDeptId = $c['department_id'] ?? null;
                    if ($cDeptId === $targetDeptId && !isset($compKeysSeen[$c['id']])) {
                        $applicableComps[] = $c;
                        $compKeysSeen[$c['id']] = true;
                    }
                }
            }
        }

        // 4. Fetch Latest Assessments from public.competency_assessments
        $assessRes = supabaseRequest('competency_assessments?order=assessment_date.desc', 'GET', null, true);
        $allAssessments = is_array($assessRes['data']) ? $assessRes['data'] : [];

        // Build latest score map: [employee_id][competency_id] => latest_assessment
        $latestAssessMap = [];
        foreach ($allAssessments as $a) {
            $eId = $a['employee_id'] ?? '';
            $cId = $a['competency_id'] ?? '';
            if (!isset($latestAssessMap[$eId])) {
                $latestAssessMap[$eId] = [];
            }
            if (!isset($latestAssessMap[$eId][$cId])) {
                $latestAssessMap[$eId][$cId] = $a;
            }
        }

        // 5. Fetch Performance Goals from Supabase public.performance_goals
        $goalsRes = supabaseRequest('performance_goals', 'GET', null, true);
        $allGoals = is_array($goalsRes['data']) ? $goalsRes['data'] : [];
        $goalsByEmp = [];
        foreach ($allGoals as $g) {
            $empId = $g['employee_id'] ?? '';
            if (!$empId) continue;
            if (!isset($goalsByEmp[$empId])) {
                $goalsByEmp[$empId] = [];
            }
            $goalsByEmp[$empId][] = $g;
        }

        // 6. Structure Employee Matrix Rows with Calculated Dynamic Overall Score and Goal Status
        $matrixRows = [];
        foreach ($employeesList as $u) {
            $eId = $u['id'] ?? '';
            $uDeptId = $u['department_id'] ?? '';
            $uDept = $deptMap[$uDeptId] ?? ($u['department'] ?? 'General');
            $uTitle = $u['title'] ?? 'Associate';

            $scores = [];
            $assessedCount = 0;
            $scoreSum = 0;

            // 1. Populate all existing assessed scores for this employee from Supabase
            if (isset($latestAssessMap[$eId])) {
                foreach ($latestAssessMap[$eId] as $cId => $assessment) {
                    $scoreVal = (float)$assessment['score'];
                    $scores[$cId] = [
                        'score' => $scoreVal,
                        'formatted' => number_format($scoreVal, 2),
                        'comments' => $assessment['comments'] ?? null,
                        'date' => $assessment['assessment_date'] ?? null,
                        'isApplicable' => true
                    ];
                    $scoreSum += $scoreVal;
                    $assessedCount++;
                }
            }

            // 2. Ensure applicable comps for the matrix table also have default entries if not yet assessed
            foreach ($applicableComps as $comp) {
                $cId = $comp['id'];
                if (!isset($scores[$cId])) {
                    $cScope = $comp['scope'] ?? 'General';
                    $cPos = $comp['position'] ?? null;
                    $isApplicableToEmp = true;
                    if ($cScope === 'Specific' && !empty($cPos)) {
                        if (strcasecmp(trim($uTitle), trim($cPos)) !== 0 && strpos(strtolower($uTitle), strtolower($cPos)) === false) {
                            $isApplicableToEmp = false;
                        }
                    }
                    $scores[$cId] = [
                        'score' => null,
                        'formatted' => '—',
                        'comments' => null,
                        'date' => null,
                        'isApplicable' => $isApplicableToEmp
                    ];
                }
            }

            $overallScore = $assessedCount > 0 ? round($scoreSum / $assessedCount, 2) : null;

            // Compute Goal & Performance Objective Status from needs_training and in_training columns
            $empGoals = $goalsByEmp[$eId] ?? [];
            $needsTraining = false;
            $inTraining = false;
            $needsTrainingTitles = [];
            $inTrainingTitles = [];

            foreach ($empGoals as $g) {
                $nt = $g['needs_training'] ?? null;
                $it = $g['in_training'] ?? ($g['is_training'] ?? null);
                
                $isNT = ($nt === true || $nt === 't' || $nt === 'true' || $nt === 1 || $nt === '1');
                $isIT = ($it === true || $it === 't' || $it === 'true' || $it === 1 || $it === '1');

                if ($isNT) {
                    $needsTraining = true;
                    $needsTrainingTitles[] = $g['title'] ?? 'Objective';
                }
                if ($isIT) {
                    $inTraining = true;
                    $inTrainingTitles[] = $g['title'] ?? 'Objective';
                }
            }

            $statusLabel = null;
            if ($needsTraining) {
                $statusLabel = 'Needs Training';
            } elseif ($inTraining) {
                $statusLabel = 'In Training';
            }

            $goalsSummary = [
                'total_goals' => count($empGoals),
                'needs_training' => $needsTraining,
                'in_training' => $inTraining,
                'is_training' => $inTraining,
                'needs_training_titles' => $needsTrainingTitles,
                'in_training_titles' => $inTrainingTitles,
                'status_label' => $statusLabel
            ];

            $matrixRows[] = [
                'id' => $eId,
                'employee_code' => $u['employee_code'] ?? '',
                'full_name' => $u['full_name'] ?? 'Associate',
                'title' => $uTitle,
                'department_id' => $uDeptId,
                'department' => $uDept,
                'avatar_url' => $u['avatar_url'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                'scores' => $scores,
                'assessed_count' => $assessedCount,
                'overall_score' => $overallScore,
                'overall_formatted' => $overallScore !== null ? number_format($overallScore, 2) : 'Not Assessed',
                'goals_summary' => $goalsSummary
            ];
        }

        return [
            'success' => true,
            'filter' => [
                'department_id' => $targetDeptId,
                'department_name' => $targetDeptName ?? 'All Departments'
            ],
            'departments' => $departments,
            'competencies' => $applicableComps,
            'employees' => $matrixRows
        ];
    }

    /**
     * Get Employees directly from public.employees table
     */
    public function getEmployees(array $params = []): array
    {
        $deptId = $params['department_id'] ?? null;
        $query = 'employees?order=full_name.asc';
        if (!empty($deptId) && $deptId !== 'all') {
            $query .= '&department_id=eq.' . urlencode($deptId);
        }

        $res = supabaseRequest($query, 'GET', null, true);
        return [
            'success' => true,
            'data' => is_array($res['data']) ? $res['data'] : []
        ];
    }
}
