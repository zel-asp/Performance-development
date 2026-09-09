<?php

require_once __DIR__ . '/BaseModel.php';
require_once __DIR__ . '/../config/config.php';

class TrainingNeedModel extends BaseModel
{
    private static float $lastSyncTime = 0.0;

    public function __construct()
    {
        parent::__construct('training_needs');
    }

    /**
     * Get All Training Needs & Skill Gap Deficits from Supabase
     * Synchronizes from competency_assessments where overall score < 3.8 (Skill Gap / Needs TNA)
     */
    public function getNeeds(array $filters = [], bool $forceSync = false): array
    {
        // 1. Sync fresh deficits if not synced recently or if forced
        $force = $forceSync || !empty($filters['force_sync']) || !empty($filters['forceSync']) || !empty($filters['refresh']);
        if ($force || (microtime(true) - self::$lastSyncTime) > 8.0) {
            $this->syncDeficitsFromAssessments();
            $this->syncDeficitsFromPerformance();
            self::$lastSyncTime = microtime(true);
        }

        // Try direct PDO first for sub-100ms response
        try {
            $pdo = getSupabaseDb();
            if ($pdo) {
                return $this->getNeedsPdo($pdo, $filters);
            }
        } catch (Throwable $e) {
            error_log('[TrainingNeedModel] getNeedsPdo failed, using REST fallback: ' . $e->getMessage());
        }

        // 2. Fetch all training needs from Supabase (REST fallback)
        $allNeeds = $this->all($filters);

        // 3. Fetch programs from Supabase for metadata linking
        $programsRes = supabaseRequest('training_programs', 'GET', null, true);
        $programs = is_array($programsRes['data']) ? $programsRes['data'] : [];

        $progMap = [];
        foreach ($programs as $p) {
            $pId = $p['id'] ?? '';
            if ($pId) $progMap[$pId] = $p;
        }

        // 4. Fetch passed evaluations for targeted program/competency resolution (only resolve matching deficit)
        $evalRes = supabaseRequest('training_evaluations?result_status=ilike.*passed*&order=created_at.desc', 'GET', null, true);
        $evals = is_array($evalRes['data'] ?? null) ? $evalRes['data'] : [];
        $evalMapByProg = [];
        $evalMapByComp = [];
        foreach ($evals as $ev) {
            $eId = strtolower(trim($ev['associate_id'] ?? ($ev['employee_id'] ?? '')));
            $progId = trim($ev['program_id'] ?? '');
            $compKey = strtolower(trim($ev['competency_key'] ?? ''));
            if ($eId) {
                if ($progId && !isset($evalMapByProg["{$eId}_{$progId}"])) {
                    $evalMapByProg["{$eId}_{$progId}"] = $ev;
                }
                if ($compKey && !isset($evalMapByComp["{$eId}_{$compKey}"])) {
                    $evalMapByComp["{$eId}_{$compKey}"] = $ev;
                }
            }
        }

        // 5. Fetch performance_goals to resolve foreign key details for target_goal_id
        $goalsRes = supabaseRequest('performance_goals', 'GET', null, true);
        $goals = (is_array($goalsRes['data'] ?? null) && !isset($goalsRes['data']['code'])) ? $goalsRes['data'] : [];
        $goalsMap = [];
        foreach ($goals as $g) {
            $gId = (string)($g['id'] ?? '');
            if ($gId !== '') {
                $goalsMap[$gId] = $g;
            }
        }

        foreach ($allNeeds as &$need) {
            $linkedId = $need['linkedProgramId'] ?? ($need['linked_program_id'] ?? null);
            $eId = strtolower(trim($need['employee_id'] ?? ($need['employeeId'] ?? '')));
            $cKey = strtolower(trim($need['competency_key'] ?? ($need['competencyKey'] ?? '')));

            $matchedEval = null;
            if ($eId && $linkedId && isset($evalMapByProg["{$eId}_{$linkedId}"])) {
                $matchedEval = $evalMapByProg["{$eId}_{$linkedId}"];
            } elseif ($eId && $cKey && isset($evalMapByComp["{$eId}_{$cKey}"])) {
                $matchedEval = $evalMapByComp["{$eId}_{$cKey}"];
            }

            if ($matchedEval) {
                $need['status'] = 'Resolved';
                $need['certificateReference'] = $matchedEval['certificate_reference'] ?? null;
                $need['current_score'] = (float)($matchedEval['competency_score_after'] ?? 4.80);
                $need['currentScore'] = (float)($matchedEval['competency_score_after'] ?? 4.80);
                $need['gap'] = 0;
            }

            if ($linkedId && isset($progMap[$linkedId])) {
                $matchedProg = $progMap[$linkedId];
                $need['linkedProgramId'] = $matchedProg['id'];
                $need['linked_program_id'] = $matchedProg['id'];
                $need['linkedProgramTitle'] = $matchedProg['title'] ?? 'Prescribed Program';
                $need['linked_program_title'] = $matchedProg['title'] ?? 'Prescribed Program';
                $need['programDuration'] = $matchedProg['duration'] ?? '3 Hours';
                $need['programPassingScore'] = $matchedProg['passingScore'] ?? ($matchedProg['passing_score'] ?? 80);
                $need['programFormat'] = $matchedProg['format'] ?? 'Workshop';
                if (empty($need['status']) || $need['status'] === 'Identified') {
                    $need['status'] = 'Program Linked';
                }
            } else {
                $need['linkedProgramId'] = null;
                $need['linked_program_id'] = null;
                $need['linkedProgramTitle'] = null;
                $need['linked_program_title'] = null;
                $need['programDuration'] = null;
                $need['programPassingScore'] = null;
                $need['programFormat'] = null;
                if (($need['status'] ?? '') === 'Program Linked') {
                    $need['status'] = 'Identified';
                }
            }

            // Resolve Performance Goal Foreign Key Details
            $tGoalId = (string)($need['target_goal_id'] ?? ($need['targetGoalId'] ?? ''));
            if ($tGoalId !== '' && isset($goalsMap[$tGoalId])) {
                $linkedGoal = $goalsMap[$tGoalId];
                $need['linkedGoalTitle'] = $linkedGoal['title'] ?? null;
                $need['linked_goal_title'] = $linkedGoal['title'] ?? null;
                $need['linkedGoalMetric'] = $linkedGoal['target_metric'] ?? null;
                $need['linked_goal_metric'] = $linkedGoal['target_metric'] ?? null;
                $need['linkedGoalWeight'] = $linkedGoal['weight'] ?? null;
                $need['linked_goal_weight'] = $linkedGoal['weight'] ?? null;
                $need['linkedGoalStatus'] = $linkedGoal['status'] ?? null;
                $need['linked_goal_status'] = $linkedGoal['status'] ?? null;
                $need['linkedGoalTargetDate'] = $linkedGoal['target_date'] ?? null;
                $need['linked_goal_target_date'] = $linkedGoal['target_date'] ?? null;
                $need['source_label'] = 'Stage 7 Performance IDP Remediation';
                $need['sourceLabel'] = 'Stage 7 Performance IDP Remediation';
            }
        }

        // Group/Deduplicate strictly by unique trigger (employee_id + competency_key + target_goal_id)
        $dedupedNeeds = [];
        $seenKeys = [];
        foreach ($allNeeds as $n) {
            $eId = strtolower(trim($n['employee_id'] ?? ($n['employeeId'] ?? '')));
            $goalId = $n['target_goal_id'] ?? ($n['targetGoalId'] ?? '');
            $compKey = $n['competency_key'] ?? ($n['competencyKey'] ?? ($n['target_competency'] ?? ''));
            $uniqueKey = $eId ? "{$eId}_{$compKey}_{$goalId}" : ($n['id'] ?? uniqid());

            if (!isset($seenKeys[$uniqueKey])) {
                $seenKeys[$uniqueKey] = true;
                $dedupedNeeds[] = $n;
            }
        }
        
        $allNeeds = $dedupedNeeds;

        return $allNeeds;
    }

    /**
     * Direct PostgreSQL / PDO Fast-Path for getNeeds (< 0.10s)
     */
    private function getNeedsPdo(PDO $pdo, array $filters = []): array
    {
        $sql = "SELECT * FROM training_needs";
        $where = [];
        $params = [];

        if (!empty($filters['status'])) {
            $where[] = "status = :status";
            $params[':status'] = $filters['status'];
        }
        if (!empty($filters['department_id'])) {
            $where[] = "department_id = :deptId";
            $params[':deptId'] = $filters['department_id'];
        }
        if (!empty($filters['employee_id'])) {
            $where[] = "employee_id = :empId";
            $params[':empId'] = $filters['employee_id'];
        }

        if (!empty($where)) {
            $sql .= " WHERE " . implode(" AND ", $where);
        }
        $sql .= " ORDER BY created_at DESC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $rawNeeds = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $allNeeds = array_map([$this, 'normalizeRecord'], $rawNeeds);

        // Fetch programs, evals, and goals via fast PDO
        $programs = $pdo->query("SELECT * FROM training_programs")->fetchAll(PDO::FETCH_ASSOC);
        $progMap = [];
        foreach ($programs as $p) {
            $pId = $p['id'] ?? '';
            if ($pId) $progMap[$pId] = $this->normalizeRecord($p);
        }

        $evals = $pdo->query("SELECT * FROM training_evaluations WHERE result_status ILIKE '%passed%' ORDER BY created_at DESC")->fetchAll(PDO::FETCH_ASSOC);
        $evalMapByProg = [];
        $evalMapByComp = [];
        foreach ($evals as $ev) {
            $eId = strtolower(trim($ev['associate_id'] ?? ($ev['employee_id'] ?? '')));
            $progId = trim($ev['program_id'] ?? '');
            $compKey = strtolower(trim($ev['competency_key'] ?? ''));
            if ($eId) {
                if ($progId && !isset($evalMapByProg["{$eId}_{$progId}"])) {
                    $evalMapByProg["{$eId}_{$progId}"] = $ev;
                }
                if ($compKey && !isset($evalMapByComp["{$eId}_{$compKey}"])) {
                    $evalMapByComp["{$eId}_{$compKey}"] = $ev;
                }
            }
        }

        $goals = $pdo->query("SELECT * FROM performance_goals")->fetchAll(PDO::FETCH_ASSOC);
        $goalsMap = [];
        foreach ($goals as $g) {
            $gId = (string)($g['id'] ?? '');
            if ($gId !== '') {
                $goalsMap[$gId] = $g;
            }
        }

        foreach ($allNeeds as &$need) {
            $linkedId = $need['linkedProgramId'] ?? ($need['linked_program_id'] ?? null);
            $eId = strtolower(trim($need['employee_id'] ?? ($need['employeeId'] ?? '')));
            $cKey = strtolower(trim($need['competency_key'] ?? ($need['competencyKey'] ?? '')));

            $matchedEval = null;
            if ($eId && $linkedId && isset($evalMapByProg["{$eId}_{$linkedId}"])) {
                $matchedEval = $evalMapByProg["{$eId}_{$linkedId}"];
            } elseif ($eId && $cKey && isset($evalMapByComp["{$eId}_{$cKey}"])) {
                $matchedEval = $evalMapByComp["{$eId}_{$cKey}"];
            }

            if ($matchedEval) {
                $need['status'] = 'Resolved';
                $need['certificateReference'] = $matchedEval['certificate_reference'] ?? null;
                $need['current_score'] = (float)($matchedEval['competency_score_after'] ?? 4.80);
                $need['currentScore'] = (float)($matchedEval['competency_score_after'] ?? 4.80);
                $need['gap'] = 0;
            }

            if ($linkedId && isset($progMap[$linkedId])) {
                $matchedProg = $progMap[$linkedId];
                $need['linkedProgramId'] = $matchedProg['id'];
                $need['linked_program_id'] = $matchedProg['id'];
                $need['linkedProgramTitle'] = $matchedProg['title'] ?? 'Prescribed Program';
                $need['linked_program_title'] = $matchedProg['title'] ?? 'Prescribed Program';
                $need['programDuration'] = $matchedProg['duration'] ?? '3 Hours';
                $need['programPassingScore'] = $matchedProg['passingScore'] ?? ($matchedProg['passing_score'] ?? 80);
                $need['programFormat'] = $matchedProg['format'] ?? 'Workshop';
                if (empty($need['status']) || $need['status'] === 'Identified') {
                    $need['status'] = 'Program Linked';
                }
            } else {
                $need['linkedProgramId'] = null;
                $need['linked_program_id'] = null;
                $need['linkedProgramTitle'] = null;
                $need['linked_program_title'] = null;
                $need['programDuration'] = null;
                $need['programPassingScore'] = null;
                $need['programFormat'] = null;
                if (($need['status'] ?? '') === 'Program Linked') {
                    $need['status'] = 'Identified';
                }
            }

            // Resolve Performance Goal Foreign Key Details
            $tGoalId = (string)($need['target_goal_id'] ?? ($need['targetGoalId'] ?? ''));
            if ($tGoalId !== '' && isset($goalsMap[$tGoalId])) {
                $linkedGoal = $goalsMap[$tGoalId];
                $need['linkedGoalTitle'] = $linkedGoal['title'] ?? null;
                $need['linked_goal_title'] = $linkedGoal['title'] ?? null;
                $need['linkedGoalMetric'] = $linkedGoal['target_metric'] ?? null;
                $need['linked_goal_metric'] = $linkedGoal['target_metric'] ?? null;
                $need['linkedGoalWeight'] = $linkedGoal['weight'] ?? null;
                $need['linked_goal_weight'] = $linkedGoal['weight'] ?? null;
                $need['linkedGoalStatus'] = $linkedGoal['status'] ?? null;
                $need['linked_goal_status'] = $linkedGoal['status'] ?? null;
                $need['linkedGoalTargetDate'] = $linkedGoal['target_date'] ?? null;
                $need['linked_goal_target_date'] = $linkedGoal['target_date'] ?? null;
                $need['source_label'] = 'Stage 7 Performance IDP Remediation';
                $need['sourceLabel'] = 'Stage 7 Performance IDP Remediation';
            }
        }

        $dedupedNeeds = [];
        $seenKeys = [];
        foreach ($allNeeds as $n) {
            $eId = strtolower(trim($n['employee_id'] ?? ($n['employeeId'] ?? '')));
            $goalId = $n['target_goal_id'] ?? ($n['targetGoalId'] ?? '');
            $compKey = $n['competency_key'] ?? ($n['competencyKey'] ?? ($n['target_competency'] ?? ''));
            $uniqueKey = $eId ? "{$eId}_{$compKey}_{$goalId}" : ($n['id'] ?? uniqid());

            if (!isset($seenKeys[$uniqueKey])) {
                $seenKeys[$uniqueKey] = true;
                $dedupedNeeds[] = $n;
            }
        }

        return $dedupedNeeds;
    }

    /**
     * Assign a specific training program manually to a training need
     */
    public function assignProgram(string $needId, string $programId): ?array
    {
        $payload = [
            'linked_program_id' => $programId,
            'status'            => 'Program Linked',
            'updated_at'        => date('c')
        ];

        return $this->update($needId, $payload);
    }

    /**
     * Create a new training need in database
     */
    public function createNeed(array $data): array
    {
        if (empty($data['id'])) {
            $data['id'] = 'need-' . substr(bin2hex(random_bytes(4)), 0, 6);
        }
        if (empty($data['dateIdentified']) && empty($data['date_identified'])) {
            $data['dateIdentified'] = date('M d, Y');
            $data['date_identified'] = date('M d, Y');
        }
        if (empty($data['status'])) {
            $data['status'] = 'Identified';
        }
        if (empty($data['sourceType']) && empty($data['source_type'])) {
            $data['sourceType'] = 'competency_gap';
            $data['source_type'] = 'competency_gap';
        }
        if (empty($data['sourceLabel']) && empty($data['source_label'])) {
            $data['sourceLabel'] = 'Skill Gap';
            $data['source_label'] = 'Skill Gap';
        }

        return $this->create($data);
    }

    /**
     * Update training need status (e.g. Program Linked, Scheduled, Resolved / Completed)
     */
    public function updateStatus(string $needId, string $status, ?string $linkedProgramId = null): ?array
    {
        $update = [
            'status'     => $status,
            'updated_at' => date('c')
        ];
        if ($linkedProgramId !== null) {
            $update['linked_program_id'] = $linkedProgramId;
        }

        return $this->update($needId, $update);
    }

    /**
     * Real-Time Synchronizer from public.competency_assessments
     * Triggers when Associate Overall Rating < 3.8 (Skill Gap / Needs TNA).
     * Creates ONE unified Associate Skill Gap Profile with detailed diagnosed low competency breakdown.
     * No auto-assignment of programs — Supervisor manually selects the appropriate program.
     */
    public function syncDeficitsFromAssessments(?string $specificEmployeeId = null): array
    {
        try {
            $pdo = getSupabaseDb();
            if ($pdo) {
                return $this->syncDeficitsFromAssessmentsPdo($pdo, $specificEmployeeId);
            }
        } catch (Throwable $e) {
            error_log('[TrainingNeedModel] PDO syncDeficitsFromAssessments failed, falling back to REST: ' . $e->getMessage());
        }

        // 1. Fetch latest assessments (REST fallback)
        $query = 'competency_assessments?order=assessment_date.desc';
        if ($specificEmployeeId) {
            $query .= '&employee_id=eq.' . urlencode($specificEmployeeId);
        }
        $assessRes = supabaseRequest($query, 'GET', null, true);
        $assessments = is_array($assessRes['data']) ? $assessRes['data'] : [];

        if (empty($assessments)) {
            return [];
        }

        // 2. Fetch metadata lookups
        $empRes = supabaseRequest('employees', 'GET', null, true);
        $employees = is_array($empRes['data']) ? $empRes['data'] : [];
        if (empty($employees)) {
            $userRes = supabaseRequest('users', 'GET', null, true);
            $employees = is_array($userRes['data']) ? $userRes['data'] : [];
        }

        $deptRes = supabaseRequest('departments', 'GET', null, true);
        $departments = is_array($deptRes['data']) ? $deptRes['data'] : [];

        $compRes = supabaseRequest('competencies', 'GET', null, true);
        $competencies = is_array($compRes['data']) ? $compRes['data'] : [];

        // Build lookup maps
        $empMap = [];
        foreach ($employees as $e) {
            $empMap[$e['id']] = $e;
        }

        $deptMap = [];
        foreach ($departments as $d) {
            $deptMap[$d['id']] = $d['name'] ?? 'General';
        }

        $compMap = [];
        foreach ($competencies as $c) {
            $compMap[$c['id']] = $c;
        }

        // 3. Fetch existing training_needs from Supabase
        $existingNeedsRes = supabaseRequest('training_needs', 'GET', null, true);
        $existingNeeds = is_array($existingNeedsRes['data']) ? $existingNeedsRes['data'] : [];
        $needsByKey = [];
        $needsByEmp = [];

        foreach ($existingNeeds as $n) {
            $eId = strtolower(trim($n['employee_id'] ?? ($n['employeeId'] ?? '')));
            $cKey = $n['competency_key'] ?? ($n['competencyKey'] ?? '');
            $gId = $n['target_goal_id'] ?? ($n['targetGoalId'] ?? '');
            if ($eId) {
                if (!isset($needsByEmp[$eId])) {
                    $needsByEmp[$eId] = $n;
                }
                $k = "{$eId}_{$cKey}_{$gId}";
                if (!isset($needsByKey[$k])) {
                    $needsByKey[$k] = $n;
                }
            }
        }

        // 4. Group latest assessment per employee & competency
        $empAssessments = [];
        foreach ($assessments as $a) {
            $eId = $a['employee_id'] ?? '';
            $cId = $a['competency_id'] ?? '';
            if (!$eId || !$cId) continue;
            if (!isset($empAssessments[$eId])) {
                $empAssessments[$eId] = [];
            }
            if (!isset($empAssessments[$eId][$cId])) {
                $empAssessments[$eId][$cId] = $a;
            }
        }

        $syncedDeficits = [];

        // 5. Evaluate each employee's overall score & low competencies
        foreach ($empAssessments as $eId => $compScores) {
            $emp = $empMap[$eId] ?? [
                'full_name' => 'Associate',
                'title' => 'Staff',
                'dept' => 'Front Office',
                'avatar_url' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            ];

            $deptName = $emp['dept'] ?? ($deptMap[$emp['department_id'] ?? ''] ?? 'Front Office');

            $scoreValues = [];
            $lowCompetencies = [];
            $lowCompSummaries = [];

            foreach ($compScores as $cId => $assessment) {
                $score = (float)($assessment['score'] ?? 0);
                $scoreValues[] = $score;
                $comp = $compMap[$cId] ?? [
                    'name' => 'Core Competency',
                    'key' => 'general',
                    'benchmark_score' => 4.50
                ];
                $benchmark = (float)($comp['benchmark_score'] ?? 4.50);

                if ($score < $benchmark) {
                    $lowCompetencies[] = [
                        'id' => $cId,
                        'name' => $comp['name'],
                        'score' => $score,
                        'benchmark' => $benchmark,
                        'gap' => round($score - $benchmark, 2)
                    ];
                    $lowCompSummaries[] = "{$comp['name']} ({$score}/{$benchmark})";
                }
            }

            if (empty($scoreValues)) continue;

            $overallScore = round(array_sum($scoreValues) / count($scoreValues), 2);
            $requiredBenchmark = 4.50;
            $gap = round($overallScore - $requiredBenchmark, 2);

            $existingNeed = $needsByEmp[$eId] ?? null;

            // Trigger Skill Gap / Needs TNA if Overall Score < Required Benchmark OR has individual competency deficits below benchmark
            if ($overallScore < $requiredBenchmark || !empty($lowCompetencies)) {
                $urgency = ($overallScore < 2.0) ? 'Critical' : (($overallScore < 3.5) ? 'High' : 'Medium');
                $targetCompSummary = !empty($lowCompetencies)
                    ? implode(', ', array_map(fn($c) => $c['name'], array_slice($lowCompetencies, 0, 3))) . (count($lowCompetencies) > 3 ? ' +' . (count($lowCompetencies) - 3) . ' more' : '')
                    : 'Overall Hospitality Proficiency';

                $bulletPoints = [];
                foreach ($lowCompetencies as $lc) {
                    $gapFormatted = $lc['gap'] < 0 ? $lc['gap'] : '+' . $lc['gap'];
                    $bulletPoints[] = "• " . $lc['name'] . ": " . number_format($lc['score'], 1) . " / " . number_format($lc['benchmark'], 1) . " (" . $gapFormatted . " Gap)";
                }

                $diagnosisNote = "Assessed Overall Score: " . number_format($overallScore, 1) . " / 5.0 (Benchmark: " . number_format($requiredBenchmark, 1) . ")\n" . implode("\n", $bulletPoints);

                if ($existingNeed) {
                    // Retain manually assigned program if already configured
                    $currentProgramId = $existingNeed['linked_program_id'] ?? ($existingNeed['linkedProgramId'] ?? null);
                    $isAlreadyResolved = in_array($existingNeed['status'] ?? '', ['Resolved', 'Completed']);
                    $status = $isAlreadyResolved ? 'Resolved' : ($currentProgramId ? 'Program Linked' : 'Identified');

                    $updatePayload = [
                        'title' => 'Skill Gap & TNA Deficit: ' . ($emp['full_name'] ?? 'Associate'),
                        'current_score' => $overallScore,
                        'required_score' => $requiredBenchmark,
                        'gap' => $gap,
                        'urgency' => $urgency,
                        'target_competency' => $targetCompSummary,
                        'status' => $status,
                        'notes' => $diagnosisNote
                    ];

                    $this->update($existingNeed['id'], $updatePayload);
                    $syncedDeficits[] = array_merge($existingNeed, $updatePayload);
                } else {
                    // Create new unified live training need deficit
                    $newNeedId = 'need-' . substr(bin2hex(random_bytes(4)), 0, 6);
                    $newNeed = [
                        'id' => $newNeedId,
                        'title' => 'Skill Gap & TNA Deficit: ' . ($emp['full_name'] ?? 'Associate'),
                        'source_type' => 'competency_gap',
                        'source_label' => 'Skill Gap',
                        'category' => 'Associate Skill Gap',
                        'dept' => $deptName,
                        'employee_id' => $eId,
                        'associate_name' => $emp['full_name'] ?? ($emp['name'] ?? 'Associate'),
                        'associate_role' => $emp['title'] ?? ($emp['role'] ?? 'Staff'),
                        'associate_avatar' => $emp['avatar_url'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                        'target_competency_id' => !empty($lowCompetencies) ? $lowCompetencies[0]['id'] : null,
                        'target_competency' => $targetCompSummary,
                        'competency_key' => 'general_tna',
                        'current_score' => $overallScore,
                        'required_score' => $requiredBenchmark,
                        'gap' => $gap,
                        'urgency' => $urgency,
                        'status' => 'Identified',
                        'linked_program_id' => null,
                        'date_identified' => date('M d, Y'),
                        'notes' => $diagnosisNote
                    ];
                    $created = $this->create($newNeed);
                    $syncedDeficits[] = $created;
                    $needsByEmp[$eId] = $created;
                }
            } else {
                // Associate Overall Score >= Benchmark
                // Associate does not need training anymore — resolve deficit in queue
                if ($existingNeed && ($existingNeed['status'] ?? '') !== 'Resolved' && ($existingNeed['status'] ?? '') !== 'Completed') {
                    $this->update($existingNeed['id'], [
                        'status' => 'Resolved',
                        'current_score' => $overallScore,
                        'gap' => $gap,
                        'notes' => "Resolved. Overall score elevated to {$overallScore} / 5.0 (Benchmark Met)."
                    ]);
                }
            }
        }

        return $syncedDeficits;
    }

    /**
     * Direct PostgreSQL / PDO Fast-Path for syncDeficitsFromAssessments (< 0.15s)
     * Performs single JOIN query across assessments, competencies, employees, and departments.
     * Uses dirty-checking to skip unnecessary database writes on GET requests.
     */
    private function syncDeficitsFromAssessmentsPdo(PDO $pdo, ?string $specificEmployeeId = null): array
    {
        $sql = "
            SELECT ca.employee_id, ca.competency_id, ca.score, ca.assessment_date,
                   c.name as competency_name, c.benchmark_score,
                   e.full_name, e.title, e.role, e.department_id, e.avatar_url,
                   d.name as dept_name
            FROM competency_assessments ca
            JOIN competencies c ON c.id = ca.competency_id
            JOIN employees e ON e.id = ca.employee_id
            LEFT JOIN departments d ON d.id = e.department_id
        ";
        $params = [];
        if ($specificEmployeeId) {
            $sql .= " WHERE ca.employee_id = :empId";
            $params[':empId'] = $specificEmployeeId;
        }
        $sql .= " ORDER BY ca.assessment_date DESC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $assessments = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($assessments)) {
            return [];
        }

        // Fetch existing needs from Supabase via PDO
        $existingNeedsStmt = $pdo->query("SELECT * FROM training_needs WHERE source_type = 'competency_gap'");
        $existingNeeds = $existingNeedsStmt->fetchAll(PDO::FETCH_ASSOC);
        $needsByEmp = [];
        foreach ($existingNeeds as $n) {
            $eId = strtolower(trim($n['employee_id'] ?? ''));
            if ($eId && !isset($needsByEmp[$eId])) {
                $needsByEmp[$eId] = $n;
            }
        }

        // Group latest assessment per employee & competency
        $empAssessments = [];
        $empMeta = [];
        foreach ($assessments as $a) {
            $eId = $a['employee_id'] ?? '';
            $cId = $a['competency_id'] ?? '';
            if (!$eId || !$cId) continue;
            if (!isset($empAssessments[$eId])) {
                $empAssessments[$eId] = [];
                $empMeta[$eId] = $a;
            }
            if (!isset($empAssessments[$eId][$cId])) {
                $empAssessments[$eId][$cId] = $a;
            }
        }

        $syncedDeficits = [];
        $updateStmt = $pdo->prepare("
            UPDATE training_needs
            SET title = :title,
                current_score = :current_score,
                required_score = :required_score,
                gap = :gap,
                urgency = :urgency,
                target_competency = :target_competency,
                status = :status,
                notes = :notes,
                updated_at = NOW()
            WHERE id = :id
        ");

        $insertStmt = $pdo->prepare("
            INSERT INTO training_needs (
                id, title, source_type, source_label, category, dept, department_id,
                employee_id, associate_name, associate_role, associate_avatar,
                target_competency_id, target_competency, competency_key,
                current_score, required_score, gap, urgency, status,
                linked_program_id, date_identified, notes, created_at, updated_at
            ) VALUES (
                :id, :title, :source_type, :source_label, :category, :dept, :department_id,
                :employee_id, :associate_name, :associate_role, :associate_avatar,
                :target_competency_id, :target_competency, :competency_key,
                :current_score, :required_score, :gap, :urgency, :status,
                :linked_program_id, :date_identified, :notes, NOW(), NOW()
            )
        ");

        foreach ($empAssessments as $eId => $compScores) {
            $emp = $empMeta[$eId] ?? [];
            $deptName = $emp['dept_name'] ?? 'Front Office';
            $deptId = $emp['department_id'] ?? null;

            $scoreValues = [];
            $lowCompetencies = [];
            foreach ($compScores as $cId => $assessment) {
                $score = (float)($assessment['score'] ?? 0);
                $scoreValues[] = $score;
                $benchmark = (float)($assessment['benchmark_score'] ?? 4.50);
                if ($score < $benchmark) {
                    $lowCompetencies[] = [
                        'id' => $cId,
                        'name' => $assessment['competency_name'],
                        'score' => $score,
                        'benchmark' => $benchmark,
                        'gap' => round($score - $benchmark, 2)
                    ];
                }
            }

            if (empty($scoreValues)) continue;

            $overallScore = round(array_sum($scoreValues) / count($scoreValues), 2);
            $requiredBenchmark = 4.50;
            $gap = round($overallScore - $requiredBenchmark, 2);
            $existingNeed = $needsByEmp[$eId] ?? null;

            if ($overallScore < $requiredBenchmark || !empty($lowCompetencies)) {
                $urgency = ($overallScore < 2.0) ? 'Critical' : (($overallScore < 3.5) ? 'High' : 'Medium');
                $targetCompSummary = !empty($lowCompetencies)
                    ? implode(', ', array_map(fn($c) => $c['name'], array_slice($lowCompetencies, 0, 3))) . (count($lowCompetencies) > 3 ? ' +' . (count($lowCompetencies) - 3) . ' more' : '')
                    : 'Overall Hospitality Proficiency';

                $bulletPoints = [];
                foreach ($lowCompetencies as $lc) {
                    $gapFormatted = $lc['gap'] < 0 ? $lc['gap'] : '+' . $lc['gap'];
                    $bulletPoints[] = "• " . $lc['name'] . ": " . number_format($lc['score'], 1) . " / " . number_format($lc['benchmark'], 1) . " (" . $gapFormatted . " Gap)";
                }

                $diagnosisNote = "Assessed Overall Score: " . number_format($overallScore, 1) . " / 5.0 (Benchmark: " . number_format($requiredBenchmark, 1) . ")\n" . implode("\n", $bulletPoints);

                if ($existingNeed) {
                    $currentProgramId = $existingNeed['linked_program_id'] ?? null;
                    $isAlreadyResolved = in_array($existingNeed['status'] ?? '', ['Resolved', 'Completed']);
                    $status = $isAlreadyResolved ? 'Resolved' : ($currentProgramId ? 'Program Linked' : 'Identified');

                    // DIRTY CHECK: Only update database if values changed
                    $isDirty = (
                        abs((float)($existingNeed['current_score'] ?? 0) - $overallScore) > 0.01 ||
                        ($existingNeed['status'] ?? '') !== $status ||
                        ($existingNeed['urgency'] ?? '') !== $urgency ||
                        ($existingNeed['target_competency'] ?? '') !== $targetCompSummary
                    );

                    if ($isDirty) {
                        $updateStmt->execute([
                            ':title' => 'Skill Gap & TNA Deficit: ' . ($emp['full_name'] ?? 'Associate'),
                            ':current_score' => $overallScore,
                            ':required_score' => $requiredBenchmark,
                            ':gap' => $gap,
                            ':urgency' => $urgency,
                            ':target_competency' => $targetCompSummary,
                            ':status' => $status,
                            ':notes' => $diagnosisNote,
                            ':id' => $existingNeed['id']
                        ]);
                    }

                    $merged = array_merge($existingNeed, [
                        'title' => 'Skill Gap & TNA Deficit: ' . ($emp['full_name'] ?? 'Associate'),
                        'current_score' => $overallScore,
                        'required_score' => $requiredBenchmark,
                        'gap' => $gap,
                        'urgency' => $urgency,
                        'target_competency' => $targetCompSummary,
                        'status' => $status,
                        'notes' => $diagnosisNote
                    ]);
                    $syncedDeficits[] = $this->normalizeRecord($merged);
                } else {
                    $newNeedId = 'need-' . substr(bin2hex(random_bytes(4)), 0, 6);
                    $newNeed = [
                        'id' => $newNeedId,
                        'title' => 'Skill Gap & TNA Deficit: ' . ($emp['full_name'] ?? 'Associate'),
                        'source_type' => 'competency_gap',
                        'source_label' => 'Skill Gap',
                        'category' => 'Associate Skill Gap',
                        'dept' => $deptName,
                        'department_id' => $deptId,
                        'employee_id' => $eId,
                        'associate_name' => $emp['full_name'] ?? 'Associate',
                        'associate_role' => $emp['title'] ?? ($emp['role'] ?? 'Staff'),
                        'associate_avatar' => $emp['avatar_url'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                        'target_competency_id' => !empty($lowCompetencies) ? $lowCompetencies[0]['id'] : null,
                        'target_competency' => $targetCompSummary,
                        'competency_key' => 'general_tna',
                        'current_score' => $overallScore,
                        'required_score' => $requiredBenchmark,
                        'gap' => $gap,
                        'urgency' => $urgency,
                        'status' => 'Identified',
                        'linked_program_id' => null,
                        'date_identified' => date('M d, Y'),
                        'notes' => $diagnosisNote
                    ];

                    $insertStmt->execute([
                        ':id' => $newNeed['id'],
                        ':title' => $newNeed['title'],
                        ':source_type' => $newNeed['source_type'],
                        ':source_label' => $newNeed['source_label'],
                        ':category' => $newNeed['category'],
                        ':dept' => $newNeed['dept'],
                        ':department_id' => $newNeed['department_id'],
                        ':employee_id' => $newNeed['employee_id'],
                        ':associate_name' => $newNeed['associate_name'],
                        ':associate_role' => $newNeed['associate_role'],
                        ':associate_avatar' => $newNeed['associate_avatar'],
                        ':target_competency_id' => $newNeed['target_competency_id'],
                        ':target_competency' => $newNeed['target_competency'],
                        ':competency_key' => $newNeed['competency_key'],
                        ':current_score' => $newNeed['current_score'],
                        ':required_score' => $newNeed['required_score'],
                        ':gap' => $newNeed['gap'],
                        ':urgency' => $newNeed['urgency'],
                        ':status' => $newNeed['status'],
                        ':linked_program_id' => $newNeed['linked_program_id'],
                        ':date_identified' => $newNeed['date_identified'],
                        ':notes' => $newNeed['notes']
                    ]);

                    $norm = $this->normalizeRecord($newNeed);
                    $syncedDeficits[] = $norm;
                    $needsByEmp[$eId] = $newNeed;
                }
            } else {
                if ($existingNeed && ($existingNeed['status'] ?? '') !== 'Resolved' && ($existingNeed['status'] ?? '') !== 'Completed') {
                    $updateStmt->execute([
                        ':title' => $existingNeed['title'] ?? 'Skill Gap Deficit',
                        ':current_score' => $overallScore,
                        ':required_score' => $requiredBenchmark,
                        ':gap' => $gap,
                        ':urgency' => 'Low',
                        ':target_competency' => $existingNeed['target_competency'] ?? '',
                        ':status' => 'Resolved',
                        ':notes' => "Resolved. Overall score elevated to {$overallScore} / 5.0 (Benchmark Met).",
                        ':id' => $existingNeed['id']
                    ]);
                }
            }
        }

        return $syncedDeficits;
    }

    /**
     * Real-Time Synchronizer from public.performance_evaluations and public.performance_development_plans
     * Detects associates with calibrated appraisal ratings < 3.50 or active Stage 7 IDP remediation goals.
     * Automatically registers an actionable Training Need in the Training Operations queue.
     */
    public function syncDeficitsFromPerformance(?string $specificEmployeeId = null): array
    {
        try {
            $pdo = getSupabaseDb();
            if ($pdo) {
                return $this->syncDeficitsFromPerformancePdo($pdo, $specificEmployeeId);
            }
        } catch (Throwable $e) {
            error_log('[TrainingNeedModel] PDO syncDeficitsFromPerformance failed, falling back to REST: ' . $e->getMessage());
        }

        // 1. Fetch performance evaluations (REST fallback)
        $evalQuery = 'performance_evaluations?order=updated_at.desc';
        if ($specificEmployeeId) {
            $evalQuery .= '&employee_id=eq.' . urlencode($specificEmployeeId);
        }
        $evalRes = supabaseRequest($evalQuery, 'GET', null, true);
        $evals = (is_array($evalRes['data']) && !isset($evalRes['data']['code'])) ? $evalRes['data'] : [];

        // 2. Fetch metadata lookups
        $empRes = supabaseRequest('employees', 'GET', null, true);
        $employees = is_array($empRes['data']) ? $empRes['data'] : [];
        if (empty($employees)) {
            $userRes = supabaseRequest('users', 'GET', null, true);
            $employees = is_array($userRes['data']) ? $userRes['data'] : [];
        }

        $deptRes = supabaseRequest('departments', 'GET', null, true);
        $departments = is_array($deptRes['data']) ? $deptRes['data'] : [];

        $empMap = [];
        foreach ($employees as $e) {
            $empMap[$e['id']] = $e;
        }

        $deptMap = [];
        foreach ($departments as $d) {
            $deptMap[$d['id']] = $d['name'] ?? 'General';
        }

        // 3. Fetch existing training needs to avoid duplicates
        $existingNeedsRes = supabaseRequest('training_needs', 'GET', null, true);
        $existingNeeds = is_array($existingNeedsRes['data']) ? $existingNeedsRes['data'] : [];
        $needsByEmp = [];
        foreach ($existingNeeds as $n) {
            $eId = strtolower(trim($n['employee_id'] ?? ($n['employeeId'] ?? '')));
            $cat = strtolower(trim($n['category'] ?? ''));
            if ($eId && ($cat === 'appraisal remediation' || str_contains($cat, 'performance'))) {
                $needsByEmp[$eId] = $n;
            }
        }

        $synced = [];

        // 4. Evaluate each calibrated appraisal
        $seenEmployees = [];
        foreach ($evals as $ev) {
            $eId = $ev['employee_id'] ?? '';
            if (!$eId || isset($seenEmployees[$eId])) continue;
            $seenEmployees[$eId] = true;

            $calibratedScore = (float)($ev['calibrated_score'] ?? ($ev['supervisor_rating'] ?? 5.00));
            $tierLabel = $ev['tier_label'] ?? '';
            $status = $ev['status'] ?? '';

            $emp = $empMap[$eId] ?? [
                'full_name' => 'Associate',
                'title' => 'Staff',
                'dept' => 'Operations',
                'avatar_url' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            ];
            $deptName = $emp['dept'] ?? ($deptMap[$emp['department_id'] ?? ''] ?? 'Operations');
            $deptId = $emp['department_id'] ?? null;

            // Trigger deficit if calibrated score < 3.50 or status/tier indicates developing/PIP
            if ($calibratedScore < 3.50 || stripos($tierLabel, 'developing') !== false || stripos($tierLabel, 'pip') !== false) {
                $requiredBenchmark = 4.00;
                $gap = round($calibratedScore - $requiredBenchmark, 2);
                $urgency = ($calibratedScore < 3.00) ? 'Critical' : 'High';
                $existingNeed = $needsByEmp[$eId] ?? null;

                $diagnosisNote = "Calibrated Performance Rating: " . number_format($calibratedScore, 2) . " / 5.0 (Benchmark: " . number_format($requiredBenchmark, 2) . ")\n• Appraisal Status: " . ($status ?: 'Calibrated') . " (" . ($tierLabel ?: 'Needs Development') . ")\n• Triggered via Stage 5 Appraisal Review & IDP Remediation Protocol";

                if ($existingNeed) {
                    $isResolved = in_array($existingNeed['status'] ?? '', ['Resolved', 'Completed']);
                    $currentProgId = $existingNeed['linked_program_id'] ?? ($existingNeed['linkedProgramId'] ?? null);
                    $needStatus = $isResolved ? 'Resolved' : ($currentProgId ? 'Program Linked' : 'Identified');

                    $updatePayload = [
                        'title' => 'Performance Deficit & IDP: ' . ($emp['full_name'] ?? 'Associate'),
                        'current_score' => $calibratedScore,
                        'required_score' => $requiredBenchmark,
                        'gap' => $gap,
                        'urgency' => $urgency,
                        'status' => $needStatus,
                        'notes' => $diagnosisNote
                    ];
                    $this->update($existingNeed['id'], $updatePayload);
                    $synced[] = array_merge($existingNeed, $updatePayload);
                } else {
                    $newNeedId = 'need-perf-' . substr(bin2hex(random_bytes(3)), 0, 6);
                    $newNeed = [
                        'id' => $newNeedId,
                        'title' => 'Performance Deficit & IDP: ' . ($emp['full_name'] ?? 'Associate'),
                        'source_type' => 'competency_gap',
                        'source_label' => 'Performance Referral',
                        'category' => 'Appraisal Remediation',
                        'department_id' => $deptId,
                        'dept' => $deptName,
                        'employee_id' => $eId,
                        'associate_name' => $emp['full_name'] ?? ($emp['name'] ?? 'Associate'),
                        'associate_role' => $emp['title'] ?? ($emp['role'] ?? 'Staff'),
                        'associate_avatar' => $emp['avatar_url'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                        'target_competency' => 'Operational Performance & Standards',
                        'competency_key' => 'operational_performance',
                        'current_score' => $calibratedScore,
                        'required_score' => $requiredBenchmark,
                        'gap' => $gap,
                        'urgency' => $urgency,
                        'status' => 'Identified',
                        'linked_program_id' => null,
                        'date_identified' => date('M d, Y'),
                        'notes' => $diagnosisNote
                    ];
                    $created = $this->create($newNeed);
                    $synced[] = $created;
                    $needsByEmp[$eId] = $created;
                }
            }
        }

        return $synced;
    }

    /**
     * Direct PostgreSQL / PDO Fast-Path for syncDeficitsFromPerformance (< 0.10s)
     * Performs single JOIN query across evaluations, employees, and departments.
     * Uses dirty-checking to avoid unnecessary database writes on GET requests.
     */
    private function syncDeficitsFromPerformancePdo(PDO $pdo, ?string $specificEmployeeId = null): array
    {
        $sql = "
            SELECT pe.employee_id, pe.calibrated_score, pe.supervisor_rating, pe.tier_label, pe.status as eval_status,
                   e.full_name, e.title, e.role, e.department_id, e.avatar_url,
                   d.name as dept_name
            FROM performance_evaluations pe
            JOIN employees e ON e.id = pe.employee_id
            LEFT JOIN departments d ON d.id = e.department_id
        ";
        $params = [];
        if ($specificEmployeeId) {
            $sql .= " WHERE pe.employee_id = :empId";
            $params[':empId'] = $specificEmployeeId;
        }
        $sql .= " ORDER BY pe.updated_at DESC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $evals = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($evals)) {
            return [];
        }

        $existingNeedsStmt = $pdo->query("SELECT * FROM training_needs WHERE category = 'Appraisal Remediation' OR source_label = 'Performance Referral'");
        $existingNeeds = $existingNeedsStmt->fetchAll(PDO::FETCH_ASSOC);
        $needsByEmp = [];
        foreach ($existingNeeds as $n) {
            $eId = strtolower(trim($n['employee_id'] ?? ''));
            if ($eId && !isset($needsByEmp[$eId])) {
                $needsByEmp[$eId] = $n;
            }
        }

        $updateStmt = $pdo->prepare("
            UPDATE training_needs
            SET title = :title,
                current_score = :current_score,
                required_score = :required_score,
                gap = :gap,
                urgency = :urgency,
                status = :status,
                notes = :notes,
                updated_at = NOW()
            WHERE id = :id
        ");

        $insertStmt = $pdo->prepare("
            INSERT INTO training_needs (
                id, title, source_type, source_label, category, dept, department_id,
                employee_id, associate_name, associate_role, associate_avatar,
                target_competency, competency_key,
                current_score, required_score, gap, urgency, status,
                linked_program_id, date_identified, notes, created_at, updated_at
            ) VALUES (
                :id, :title, :source_type, :source_label, :category, :dept, :department_id,
                :employee_id, :associate_name, :associate_role, :associate_avatar,
                :target_competency, :competency_key,
                :current_score, :required_score, :gap, :urgency, :status,
                :linked_program_id, :date_identified, :notes, NOW(), NOW()
            )
        ");

        $synced = [];
        $seenEmployees = [];

        foreach ($evals as $ev) {
            $eId = $ev['employee_id'] ?? '';
            if (!$eId || isset($seenEmployees[$eId])) continue;
            $seenEmployees[$eId] = true;

            $calibratedScore = (float)($ev['calibrated_score'] ?? ($ev['supervisor_rating'] ?? 5.00));
            $tierLabel = $ev['tier_label'] ?? '';
            $status = $ev['eval_status'] ?? '';

            if ($calibratedScore < 3.50 || stripos($tierLabel, 'developing') !== false || stripos($tierLabel, 'pip') !== false) {
                $requiredBenchmark = 4.00;
                $gap = round($calibratedScore - $requiredBenchmark, 2);
                $urgency = ($calibratedScore < 3.00) ? 'Critical' : 'High';
                $existingNeed = $needsByEmp[$eId] ?? null;

                $diagnosisNote = "Calibrated Performance Rating: " . number_format($calibratedScore, 2) . " / 5.0 (Benchmark: " . number_format($requiredBenchmark, 2) . ")\n• Appraisal Status: " . ($status ?: 'Calibrated') . " (" . ($tierLabel ?: 'Needs Development') . ")\n• Triggered via Stage 5 Appraisal Review & IDP Remediation Protocol";

                if ($existingNeed) {
                    $isResolved = in_array($existingNeed['status'] ?? '', ['Resolved', 'Completed']);
                    $currentProgId = $existingNeed['linked_program_id'] ?? null;
                    $needStatus = $isResolved ? 'Resolved' : ($currentProgId ? 'Program Linked' : 'Identified');

                    // DIRTY CHECK: Only update if values changed
                    $isDirty = (
                        abs((float)($existingNeed['current_score'] ?? 0) - $calibratedScore) > 0.01 ||
                        ($existingNeed['status'] ?? '') !== $needStatus ||
                        ($existingNeed['urgency'] ?? '') !== $urgency
                    );

                    if ($isDirty) {
                        $updateStmt->execute([
                            ':title' => 'Performance Deficit & IDP: ' . ($ev['full_name'] ?? 'Associate'),
                            ':current_score' => $calibratedScore,
                            ':required_score' => $requiredBenchmark,
                            ':gap' => $gap,
                            ':urgency' => $urgency,
                            ':status' => $needStatus,
                            ':notes' => $diagnosisNote,
                            ':id' => $existingNeed['id']
                        ]);
                    }

                    $merged = array_merge($existingNeed, [
                        'title' => 'Performance Deficit & IDP: ' . ($ev['full_name'] ?? 'Associate'),
                        'current_score' => $calibratedScore,
                        'required_score' => $requiredBenchmark,
                        'gap' => $gap,
                        'urgency' => $urgency,
                        'status' => $needStatus,
                        'notes' => $diagnosisNote
                    ]);
                    $synced[] = $this->normalizeRecord($merged);
                } else {
                    $newNeedId = 'need-perf-' . substr(bin2hex(random_bytes(3)), 0, 6);
                    $newNeed = [
                        'id' => $newNeedId,
                        'title' => 'Performance Deficit & IDP: ' . ($ev['full_name'] ?? 'Associate'),
                        'source_type' => 'competency_gap',
                        'source_label' => 'Performance Referral',
                        'category' => 'Appraisal Remediation',
                        'department_id' => $ev['department_id'] ?? null,
                        'dept' => $ev['dept_name'] ?? 'Operations',
                        'employee_id' => $eId,
                        'associate_name' => $ev['full_name'] ?? 'Associate',
                        'associate_role' => $ev['title'] ?? ($ev['role'] ?? 'Staff'),
                        'associate_avatar' => $ev['avatar_url'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                        'target_competency' => 'Operational Performance & Standards',
                        'competency_key' => 'operational_performance',
                        'current_score' => $calibratedScore,
                        'required_score' => $requiredBenchmark,
                        'gap' => $gap,
                        'urgency' => $urgency,
                        'status' => 'Identified',
                        'linked_program_id' => null,
                        'date_identified' => date('M d, Y'),
                        'notes' => $diagnosisNote
                    ];

                    $insertStmt->execute([
                        ':id' => $newNeed['id'],
                        ':title' => $newNeed['title'],
                        ':source_type' => $newNeed['source_type'],
                        ':source_label' => $newNeed['source_label'],
                        ':category' => $newNeed['category'],
                        ':dept' => $newNeed['dept'],
                        ':department_id' => $newNeed['department_id'],
                        ':employee_id' => $newNeed['employee_id'],
                        ':associate_name' => $newNeed['associate_name'],
                        ':associate_role' => $newNeed['associate_role'],
                        ':associate_avatar' => $newNeed['associate_avatar'],
                        ':target_competency' => $newNeed['target_competency'],
                        ':competency_key' => $newNeed['competency_key'],
                        ':current_score' => $newNeed['current_score'],
                        ':required_score' => $newNeed['required_score'],
                        ':gap' => $newNeed['gap'],
                        ':urgency' => $newNeed['urgency'],
                        ':status' => $newNeed['status'],
                        ':linked_program_id' => $newNeed['linked_program_id'],
                        ':date_identified' => $newNeed['date_identified'],
                        ':notes' => $newNeed['notes']
                    ]);

                    $norm = $this->normalizeRecord($newNeed);
                    $synced[] = $norm;
                    $needsByEmp[$eId] = $newNeed;
                }
            }
        }

        return $synced;
    }
}
