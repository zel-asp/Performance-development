<?php
require_once __DIR__ . '/BaseModel.php';
require_once __DIR__ . '/../config/config.php';

class SuccessionModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct('succession_positions');
    }

    /**
     * Fetch all succession positions enriched with real employee and candidate metadata
     */
    public function getPositions(): array
    {
        $res = supabaseRequest('succession_positions?order=created_at.asc', 'GET', null, true);
        $positions = (is_array($res['data'] ?? null) && !isset($res['data']['code'])) ? $res['data'] : [];

        if (empty($positions)) {
            return [];
        }

        // Fetch employee and department map to enrich successor profiles
        $deptRes = supabaseRequest('departments', 'GET', null, true);
        $depts = is_array($deptRes['data'] ?? null) ? $deptRes['data'] : [];
        $deptMap = [];
        foreach ($depts as $d) {
            $dId = $d['id'] ?? '';
            if ($dId) $deptMap[$dId] = $d['name'] ?? 'Operations';
        }

        $empRes = supabaseRequest('employees', 'GET', null, true);
        $employees = is_array($empRes['data'] ?? null) ? $empRes['data'] : [];
        $empMap = [];
        foreach ($employees as $e) {
            $eId = $e['id'] ?? '';
            if ($eId) {
                $dId = $e['department_id'] ?? '';
                $e['department'] = $deptMap[$dId] ?? ($e['department'] ?? 'Operations');
                $empMap[$eId] = $e;
            }
        }

        // Fetch evaluations and competencies to enrich successor fit percentages
        $evalRes = supabaseRequest('performance_evaluations?order=updated_at.desc', 'GET', null, true);
        $evals = is_array($evalRes['data'] ?? null) ? $evalRes['data'] : [];
        $evalMap = [];
        foreach ($evals as $ev) {
            $eId = $ev['employee_id'] ?? '';
            if ($eId && !isset($evalMap[$eId])) $evalMap[$eId] = $ev;
        }

        $assessRes = supabaseRequest('competency_assessments?order=assessment_date.desc', 'GET', null, true);
        $assessments = is_array($assessRes['data'] ?? null) ? $assessRes['data'] : [];
        $assessByEmp = [];
        foreach ($assessments as $a) {
            $eId = $a['employee_id'] ?? '';
            if ($eId) {
                if (!isset($assessByEmp[$eId])) $assessByEmp[$eId] = [];
                $assessByEmp[$eId][] = $a;
            }
        }

        $candRes = supabaseRequest('succession_candidates', 'GET', null, true);
        $candRows = is_array($candRes['data'] ?? null) ? $candRes['data'] : [];
        $candMap = [];
        foreach ($candRows as $cr) {
            $key = ($cr['position_id'] ?? '') . '_' . ($cr['employee_id'] ?? '');
            $candMap[$key] = $cr;
        }

        foreach ($positions as &$p) {
            $pId = $p['id'] ?? '';
            $primaryId = $p['primary_successor_id'] ?? ($p['primarySuccessorId'] ?? null);
            $backupId = $p['emergency_backup_id'] ?? ($p['emergencyBackupId'] ?? null);

            $primaryEmp = ($primaryId && isset($empMap[$primaryId])) ? $empMap[$primaryId] : null;
            $backupEmp = ($backupId && isset($empMap[$backupId])) ? $empMap[$backupId] : null;

            if ($primaryEmp && $primaryId) {
                $ev = $evalMap[$primaryId] ?? null;
                $pScore = (float)($ev['calibrated_score'] ?? ($ev['supervisor_rating'] ?? 0.00));
                $assessList = $assessByEmp[$primaryId] ?? [];
                $cSum = 0;
                foreach ($assessList as $as) $cSum += (float)($as['score'] ?? 0);
                $cAvg = count($assessList) > 0 ? round($cSum / count($assessList), 2) : 0.00;
                $cMatch = (int)round(($cAvg / 5.0) * 100);
                $fit = (int)round(($pScore / 5.0 * 40) + ($cMatch * 0.60));
                if ($fit > 100) $fit = 100;

                $cRecord = $candMap[$pId . '_' . $primaryId] ?? null;
                $primaryEmp['computedReadinessPercent'] = $fit;
                $primaryEmp['hrReadinessFlag'] = $cRecord['hr_readiness_flag'] ?? 'Pending Calibration';
            }

            if ($backupEmp && $backupId) {
                $ev = $evalMap[$backupId] ?? null;
                $pScore = (float)($ev['calibrated_score'] ?? ($ev['supervisor_rating'] ?? 0.00));
                $assessList = $assessByEmp[$backupId] ?? [];
                $cSum = 0;
                foreach ($assessList as $as) $cSum += (float)($as['score'] ?? 0);
                $cAvg = count($assessList) > 0 ? round($cSum / count($assessList), 2) : 0.00;
                $cMatch = (int)round(($cAvg / 5.0) * 100);
                $fit = (int)round(($pScore / 5.0 * 40) + ($cMatch * 0.60));
                if ($fit > 100) $fit = 100;

                $cRecord = $candMap[$pId . '_' . $backupId] ?? null;
                $backupEmp['computedReadinessPercent'] = $fit;
                $backupEmp['hrReadinessFlag'] = $cRecord['hr_readiness_flag'] ?? 'Pending Calibration';
            }

            $p['primarySuccessor'] = $primaryEmp;
            $p['emergencyBackup'] = $backupEmp;

            // Normalize camelCase and snake_case properties
            $p['incumbentName'] = $p['incumbent_name'] ?? ($p['incumbentName'] ?? 'Unassigned');
            $p['plannedTransition'] = $p['planned_transition'] ?? ($p['plannedTransition'] ?? '12 Months');
            $p['riskOfLoss'] = $p['risk_of_loss'] ?? ($p['riskOfLoss'] ?? 'Low');
            $p['benchStrength'] = $p['bench_strength'] ?? ($p['benchStrength'] ?? 'Pipeline Active');
            $p['minPerformanceRating'] = (float)($p['min_performance_rating'] ?? ($p['minPerformanceRating'] ?? 4.2));
            $p['primarySuccessorId'] = $primaryId;
            $p['emergencyBackupId'] = $backupId;
            $p['status'] = $p['status'] ?? 'Bench Ready';
        }

        return $positions;
    }

    /**
     * Fetch all succession candidates with dynamic performance, competency levels, and computed fit %
     */
    public function getCandidates(): array
    {
        // 1. Fetch raw candidate rows from Supabase
        $res = supabaseRequest('succession_candidates?order=updated_at.desc', 'GET', null, true);
        $rawCandidates = (is_array($res['data'] ?? null) && !isset($res['data']['code'])) ? $res['data'] : [];

        // Also fetch all positions to ensure any designated primary or emergency backup successors are included!
        $posRes = supabaseRequest('succession_positions?order=created_at.asc', 'GET', null, true);
        $positions = (is_array($posRes['data'] ?? null) && !isset($posRes['data']['code'])) ? $posRes['data'] : [];

        $candidateKeyMap = [];
        foreach ($rawCandidates as $rc) {
            $key = ($rc['position_id'] ?? '') . '_' . ($rc['employee_id'] ?? '');
            $candidateKeyMap[$key] = true;
        }

        foreach ($positions as $p) {
            $pId = $p['id'] ?? '';
            $priId = $p['primary_successor_id'] ?? ($p['primarySuccessorId'] ?? null);
            $bacId = $p['emergency_backup_id'] ?? ($p['emergencyBackupId'] ?? null);

            if ($priId && !isset($candidateKeyMap[$pId . '_' . $priId])) {
                $rawCandidates[] = [
                    'id' => 'cand-' . substr(bin2hex(random_bytes(3)), 0, 6),
                    'position_id' => $pId,
                    'employee_id' => $priId,
                    'hr_readiness_flag' => 'Pending Calibration',
                    'notes' => 'Designated Primary Successor for ' . ($p['title'] ?? 'Role'),
                    'created_at' => date('c'),
                    'updated_at' => date('c')
                ];
                $candidateKeyMap[$pId . '_' . $priId] = true;
            }

            if ($bacId && !isset($candidateKeyMap[$pId . '_' . $bacId])) {
                $rawCandidates[] = [
                    'id' => 'cand-' . substr(bin2hex(random_bytes(3)), 0, 6),
                    'position_id' => $pId,
                    'employee_id' => $bacId,
                    'hr_readiness_flag' => 'Pending Calibration',
                    'notes' => 'Designated Emergency Backup for ' . ($p['title'] ?? 'Role'),
                    'created_at' => date('c'),
                    'updated_at' => date('c')
                ];
                $candidateKeyMap[$pId . '_' . $bacId] = true;
            }
        }

        if (empty($rawCandidates)) {
            return [];
        }

        // 2. Fetch Employees & Departments
        $deptRes = supabaseRequest('departments', 'GET', null, true);
        $depts = is_array($deptRes['data'] ?? null) ? $deptRes['data'] : [];
        $deptMap = [];
        foreach ($depts as $d) {
            $dId = $d['id'] ?? '';
            if ($dId) $deptMap[$dId] = $d['name'] ?? 'Operations';
        }

        $empRes = supabaseRequest('employees', 'GET', null, true);
        $employees = is_array($empRes['data'] ?? null) ? $empRes['data'] : [];
        $empMap = [];
        foreach ($employees as $e) {
            $eId = $e['id'] ?? '';
            if ($eId) {
                $dId = $e['department_id'] ?? '';
                $e['department'] = $deptMap[$dId] ?? ($e['department'] ?? 'Operations');
                $empMap[$eId] = $e;
            }
        }

        // 3. Fetch Evaluations (closed performance ratings)
        $evalRes = supabaseRequest('performance_evaluations?order=updated_at.desc', 'GET', null, true);
        $evals = is_array($evalRes['data'] ?? null) ? $evalRes['data'] : [];
        $evalMap = [];
        foreach ($evals as $ev) {
            $eId = $ev['employee_id'] ?? '';
            if ($eId && !isset($evalMap[$eId])) {
                $evalMap[$eId] = $ev;
            }
        }

        // 4. Fetch Competency Assessments
        $assessRes = supabaseRequest('competency_assessments?order=assessment_date.desc', 'GET', null, true);
        $assessments = is_array($assessRes['data'] ?? null) ? $assessRes['data'] : [];
        $assessByEmp = [];
        foreach ($assessments as $a) {
            $eId = $a['employee_id'] ?? '';
            if ($eId) {
                if (!isset($assessByEmp[$eId])) $assessByEmp[$eId] = [];
                $assessByEmp[$eId][] = $a;
            }
        }

        // 5. Build enriched candidate records
        $enriched = [];
        foreach ($rawCandidates as $c) {
            $candId = $c['id'] ?? ('cand-' . substr(bin2hex(random_bytes(3)), 0, 6));
            $empId = $c['employee_id'] ?? '';
            $posId = $c['position_id'] ?? 'role-fo-mgr';

            $emp = $empMap[$empId] ?? [
                'id' => $empId,
                'full_name' => 'Associate Candidate',
                'title' => 'Staff Member',
                'department' => 'Operations',
                'avatar_url' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            ];

            // Resolve Performance Score from real evaluation or 0.00
            $empEval = $evalMap[$empId] ?? null;
            $perfScore = (float)($empEval['calibrated_score'] ?? ($empEval['supervisor_rating'] ?? ($c['closed_performance_score'] ?? 0.00)));

            // Calculate Competency Average for this candidate
            $empAssess = $assessByEmp[$empId] ?? [];
            $compScoreSum = 0;
            $compCount = count($empAssess);
            foreach ($empAssess as $as) {
                $compScoreSum += (float)($as['score'] ?? 0);
            }
            $compAvg = $compCount > 0 ? round($compScoreSum / $compCount, 2) : 0.00;
            $compMatchPct = (int)round(($compAvg / 5.0) * 100);
            if ($compMatchPct > 100) $compMatchPct = 100;

            // Dynamic Fit Formula: 40% Performance + 60% Competency
            $computedReadinessPct = (int)round(($perfScore / 5.0 * 40) + ($compMatchPct * 0.60));
            if ($computedReadinessPct > 100) $computedReadinessPct = 100;

            $matchStatus = $computedReadinessPct >= 90 ? 'High Match' : ($computedReadinessPct >= 80 ? 'Strong Match' : 'Emerging');

            $flag = $c['hr_readiness_flag'] ?? 'Pending Calibration';
            $notes = $c['notes'] ?? 'Awaiting HR calibration based on computed readiness index.';

            // Determine 9-Box Placement
            $nineBoxCategory = $this->determine9BoxPlacement($perfScore, $compMatchPct);

            $enriched[] = [
                'id' => $candId,
                'employeeId' => $empId,
                'positionId' => $posId,
                'name' => $emp['full_name'] ?? ($emp['name'] ?? 'Associate'),
                'role' => $emp['title'] ?? ($emp['role'] ?? 'Associate'),
                'dept' => $emp['department'] ?? ($emp['dept'] ?? 'Front Office'),
                'avatar' => $emp['avatar_url'] ?? ($emp['avatar'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
                'closedPerformanceRating' => $perfScore,
                'performanceLabel' => ($perfScore >= 4.7 ? 'Exceeds Expectations' : ($perfScore >= 4.3 ? 'Strong Performer' : 'Meets Standards')) . " (" . number_format($perfScore, 2) . " / 5.0)",
                'competencyAverage' => $compAvg,
                'competencyMatchPct' => $compMatchPct,
                'computedReadinessPercent' => $computedReadinessPct,
                'matchStatus' => $matchStatus,
                'hrReadinessFlag' => $flag,
                'notes' => $notes,
                'nineBoxGridCategory' => $nineBoxCategory,
                'lastCalibrated' => date('M d, Y', strtotime($c['updated_at'] ?? 'now')),
                'targetRoleAllocations' => [
                    [
                        'roleId' => $posId,
                        'computedReadinessPercent' => $computedReadinessPct,
                        'matchStatus' => $matchStatus,
                        'hrReadinessFlag' => $flag,
                        'hrNotes' => $notes,
                        'lastCalibrated' => date('M d, Y', strtotime($c['updated_at'] ?? 'now'))
                    ]
                ]
            ];
        }

        return $enriched;
    }

    /**
     * Get dynamic 9-Box Grid Roster
     */
    public function get9BoxRoster(): array
    {
        $candidates = $this->getCandidates();
        $nineBoxes = [
            // High Potential
            ['boxId' => 7, 'boxName' => 'Enigma / Rough Diamond', 'potential' => 'High', 'perfTier' => 'Developing (<4.3)', 'color' => 'terracotta', 'items' => []],
            ['boxId' => 8, 'boxName' => 'Growth Leader', 'potential' => 'High', 'perfTier' => 'Core/Meets (4.3-4.6)', 'color' => 'gold', 'items' => []],
            ['boxId' => 9, 'boxName' => '★ Star Talent (Ready Lead)', 'potential' => 'High', 'perfTier' => 'Exceeds (4.7-5.0)', 'color' => 'primary', 'items' => []],

            // Medium Potential
            ['boxId' => 4, 'boxName' => 'Dilemma / Inconsistent', 'potential' => 'Medium', 'perfTier' => 'Developing (<4.3)', 'color' => 'amber', 'items' => []],
            ['boxId' => 5, 'boxName' => 'Core Operations Anchor', 'potential' => 'Medium', 'perfTier' => 'Core/Meets (4.3-4.6)', 'color' => 'dusty', 'items' => []],
            ['boxId' => 6, 'boxName' => 'High Performer / Specialist', 'potential' => 'Medium', 'perfTier' => 'Exceeds (4.7-5.0)', 'color' => 'emerald', 'items' => []],

            // Low Potential
            ['boxId' => 1, 'boxName' => 'Risk / Action Required', 'potential' => 'Low', 'perfTier' => 'Developing (<4.3)', 'color' => 'rose', 'items' => []],
            ['boxId' => 2, 'boxName' => 'Solid Specialist / Pro', 'potential' => 'Low', 'perfTier' => 'Core/Meets (4.3-4.6)', 'color' => 'slate', 'items' => []],
            ['boxId' => 3, 'boxName' => 'Trusted Craft Master', 'potential' => 'Low', 'perfTier' => 'Exceeds (4.7-5.0)', 'color' => 'sage', 'items' => []]
        ];

        foreach ($candidates as $cand) {
            $perf = (float)$cand['closedPerformanceRating'];
            $compMatchPct = (float)$cand['competencyMatchPct'];

            // X-axis (Performance): Low <4.3, Medium 4.3-4.6, High >=4.7
            // Y-axis (Potential / Competency): Low <75, Medium 75-89, High >=90
            
            $boxIndex = 2; // Default Box 9
            if ($compMatchPct >= 90) {
                // High Potential
                if ($perf >= 4.70) { $boxIndex = 2; } // Box 9
                elseif ($perf >= 4.30) { $boxIndex = 1; } // Box 8
                else { $boxIndex = 0; } // Box 7
            } elseif ($compMatchPct >= 75) {
                // Medium Potential
                if ($perf >= 4.70) { $boxIndex = 5; } // Box 6
                elseif ($perf >= 4.30) { $boxIndex = 4; } // Box 5
                else { $boxIndex = 3; } // Box 4
            } else {
                // Low Potential
                if ($perf >= 4.70) { $boxIndex = 8; } // Box 3
                elseif ($perf >= 4.30) { $boxIndex = 7; } // Box 2
                else { $boxIndex = 6; } // Box 1
            }

            $nineBoxes[$boxIndex]['items'][] = [
                'name' => $cand['name'],
                'role' => $cand['role'],
                'dept' => $cand['dept'],
                'avatar' => $cand['avatar'],
                'score' => number_format($cand['closedPerformanceRating'], 2),
                'action' => $cand['hrReadinessFlag'] === 'Ready Now' ? 'Primary Leadership Successor' : '1-on-1 Mentorship & IDP',
                'readiness' => $cand['hrReadinessFlag']
            ];
        }

        return $nineBoxes;
    }

    /**
     * Determine 9-Box grid title based on performance rating and competency match
     */
    private function determine9BoxPlacement(float $perfScore, float $compMatchPct): string
    {
        if ($compMatchPct >= 90) {
            if ($perfScore >= 4.70) return 'Star Track (Next Lead)';
            if ($perfScore >= 4.30) return 'Growth Leader';
            return 'Enigma / Rough Diamond';
        } elseif ($compMatchPct >= 75) {
            if ($perfScore >= 4.70) return 'High Performer / Specialist';
            if ($perfScore >= 4.30) return 'Core Operations Anchor';
            return 'Dilemma / Inconsistent';
        } else {
            if ($perfScore >= 4.70) return 'Trusted Craft Master';
            if ($perfScore >= 4.30) return 'Solid Specialist / Pro';
            return 'Risk / Action Required';
        }
    }

    /**
     * Update HR Readiness Flag and Audit Notes in Supabase
     */
    public function updateCandidateFlag(string $id, string $flag, string $notes, string $employeeId = '', string $positionId = ''): bool
    {
        // 1. Try to find candidate in succession_candidates by ID
        $findRes = supabaseRequest('succession_candidates?id=eq.' . urlencode($id), 'GET', null, true);
        $found = (is_array($findRes['data'] ?? null) && count($findRes['data']) > 0 && !isset($findRes['data']['code'])) ? $findRes['data'][0] : null;

        // 2. If not found by candidate ID, try finding by employee_id (+ position_id)
        if (!$found && !empty($employeeId)) {
            $empQuery = 'succession_candidates?employee_id=eq.' . urlencode($employeeId);
            if (!empty($positionId)) {
                $empQuery .= '&position_id=eq.' . urlencode($positionId);
            }
            $findEmpRes = supabaseRequest($empQuery, 'GET', null, true);
            if (is_array($findEmpRes['data'] ?? null) && count($findEmpRes['data']) > 0 && !isset($findEmpRes['data']['code'])) {
                $found = $findEmpRes['data'][0];
            }
        }

        $payload = [
            'hr_readiness_flag' => $flag,
            'notes'             => $notes,
            'updated_at'        => date('c')
        ];

        if ($found && !empty($found['id'])) {
            $realId = $found['id'];
            $res = supabaseRequest('succession_candidates?id=eq.' . urlencode($realId), 'PATCH', $payload, true);
            return isset($res['status']) && ($res['status'] >= 200 && $res['status'] < 300);
        } else {
            // Row not in succession_candidates yet — insert it so it persists on refresh!
            $insertData = array_merge([
                'id'          => !empty($id) && !str_starts_with($id, 'cand-') ? $id : ('cand-' . substr(bin2hex(random_bytes(3)), 0, 6)),
                'employee_id' => !empty($employeeId) ? $employeeId : $id,
                'position_id' => !empty($positionId) ? $positionId : 'role-general',
                'created_at'  => date('c')
            ], $payload);

            $res = supabaseRequest('succession_candidates', 'POST', $insertData, true);
            return isset($res['status']) && ($res['status'] >= 200 && $res['status'] < 300);
        }
    }

    /**
     * Create a new succession position in Supabase
     */
    public function createSuccessionPosition(array $data): array
    {
        $posId = $data['id'] ?? ('role-' . substr(bin2hex(random_bytes(3)), 0, 6));
        $primarySuccessorId = !empty($data['primarySuccessorId']) ? $data['primarySuccessorId'] : (!empty($data['primary_successor_id']) ? $data['primary_successor_id'] : null);
        $emergencyBackupId = !empty($data['emergencyBackupId']) ? $data['emergencyBackupId'] : (!empty($data['emergency_backup_id']) ? $data['emergency_backup_id'] : null);

        $record = [
            'id'                     => $posId,
            'title'                  => $data['title'] ?? 'New Leadership Role',
            'dept'                   => $data['dept'] ?? 'Front Office',
            'incumbent_name'         => $data['incumbentName'] ?? ($data['incumbent_name'] ?? 'Unassigned'),
            'planned_transition'     => $data['plannedTransition'] ?? ($data['planned_transition'] ?? '12 Months'),
            'risk_of_loss'           => $data['riskOfLoss'] ?? ($data['risk_of_loss'] ?? 'Medium'),
            'bench_strength'         => $data['benchStrength'] ?? ($data['bench_strength'] ?? ($primarySuccessorId ? 'Pipeline Active' : 'Vacancy Risk')),
            'required_competencies'  => is_array($data['requiredCompetencies'] ?? null) ? json_encode($data['requiredCompetencies']) : ($data['required_competencies'] ?? '{}'),
            'min_performance_rating' => (float)($data['minPerformanceRating'] ?? ($data['min_performance_rating'] ?? 4.2)),
            'primary_successor_id'   => $primarySuccessorId,
            'emergency_backup_id'    => $emergencyBackupId,
            'status'                 => $data['status'] ?? 'Bench Ready',
            'created_at'             => date('c'),
            'updated_at'             => date('c')
        ];

        $created = $this->create($record);

        // Auto-register candidate rows into succession_candidates if successors were designated
        if (!empty($primarySuccessorId)) {
            supabaseRequest('succession_candidates', 'POST', [
                'id' => 'cand-' . substr(bin2hex(random_bytes(3)), 0, 6),
                'position_id' => $posId,
                'employee_id' => $primarySuccessorId,
                'hr_readiness_flag' => 'Pending Calibration',
                'notes' => 'Designated as Primary Successor for ' . ($data['title'] ?? 'Role'),
                'created_at' => date('c'),
                'updated_at' => date('c')
            ], true);
        }

        if (!empty($emergencyBackupId) && $emergencyBackupId !== $primarySuccessorId) {
            supabaseRequest('succession_candidates', 'POST', [
                'id' => 'cand-' . substr(bin2hex(random_bytes(3)), 0, 6),
                'position_id' => $posId,
                'employee_id' => $emergencyBackupId,
                'hr_readiness_flag' => 'Pending Calibration',
                'notes' => 'Designated as Emergency Backup for ' . ($data['title'] ?? 'Role'),
                'created_at' => date('c'),
                'updated_at' => date('c')
            ], true);
        }

        return $created;
    }

    /**
     * Get department talent recommendations ranked by cumulative XP ledger points and readiness fit
     */
    public function getDepartmentXPRecommendations(string $targetDept = 'all'): array
    {
        // 1. Fetch departments & employees
        $deptRes = supabaseRequest('departments', 'GET', null, true);
        $depts = is_array($deptRes['data'] ?? null) ? $deptRes['data'] : [];
        $deptMap = [];
        foreach ($depts as $d) {
            $dId = $d['id'] ?? '';
            if ($dId) $deptMap[$dId] = $d['name'] ?? 'Operations';
        }

        $empRes = supabaseRequest('employees?order=full_name.asc', 'GET', null, true);
        $employees = is_array($empRes['data'] ?? null) ? $empRes['data'] : [];

        // 2. Fetch XP Ledger entries from Supabase
        $xpRes = supabaseRequest('xp_ledger?order=created_at.desc', 'GET', null, true);
        $xpEntries = is_array($xpRes['data'] ?? null) ? $xpRes['data'] : [];
        $xpByEmp = [];
        foreach ($xpEntries as $xp) {
            $eId = $xp['employee_id'] ?? '';
            if ($eId) {
                if (!isset($xpByEmp[$eId])) {
                    $xpByEmp[$eId] = [
                        'totalPoints' => 0,
                        'sources' => [],
                        'latestBalance' => 0,
                        'recentDescription' => $xp['description'] ?? ''
                    ];
                }
                $pts = (int)($xp['points'] ?? 0);
                $xpByEmp[$eId]['totalPoints'] += $pts;
                $src = $xp['source_type'] ?? 'general';
                $xpByEmp[$eId]['sources'][$src] = ($xpByEmp[$eId]['sources'][$src] ?? 0) + $pts;
                if ($xpByEmp[$eId]['latestBalance'] === 0 && isset($xp['balance_after'])) {
                    $xpByEmp[$eId]['latestBalance'] = (int)$xp['balance_after'];
                }
            }
        }

        // 3. Fetch Evaluations & Competencies
        $evalRes = supabaseRequest('performance_evaluations?order=updated_at.desc', 'GET', null, true);
        $evals = is_array($evalRes['data'] ?? null) ? $evalRes['data'] : [];
        $evalMap = [];
        foreach ($evals as $ev) {
            $eId = $ev['employee_id'] ?? '';
            if ($eId && !isset($evalMap[$eId])) {
                $evalMap[$eId] = $ev;
            }
        }

        $assessRes = supabaseRequest('competency_assessments?order=assessment_date.desc', 'GET', null, true);
        $assessments = is_array($assessRes['data'] ?? null) ? $assessRes['data'] : [];
        $assessByEmp = [];
        foreach ($assessments as $a) {
            $eId = $a['employee_id'] ?? '';
            if ($eId) {
                if (!isset($assessByEmp[$eId])) $assessByEmp[$eId] = [];
                $assessByEmp[$eId][] = $a;
            }
        }

        // 4. Build scored talent list
        $recommendations = [];
        $deptClean = strtolower(trim($targetDept));

        foreach ($employees as $emp) {
            $eId = $emp['id'] ?? '';
            if (!$eId) continue;

            $dId = $emp['department_id'] ?? '';
            $empDept = $deptMap[$dId] ?? ($emp['department'] ?? 'Operations');
            $empDeptClean = strtolower(trim($empDept));

            // Department filter
            if ($deptClean !== 'all' && $deptClean !== '' && !str_contains($empDeptClean, $deptClean) && !str_contains($deptClean, $empDeptClean)) {
                continue;
            }

            $empEval = $evalMap[$eId] ?? null;
            $perfScore = (float)($empEval['calibrated_score'] ?? ($empEval['supervisor_rating'] ?? 0.00));

            $empAssess = $assessByEmp[$eId] ?? [];
            $compScoreSum = 0;
            $compCount = count($empAssess);
            foreach ($empAssess as $as) {
                $compScoreSum += (float)($as['score'] ?? 0);
            }
            $compAvg = $compCount > 0 ? round($compScoreSum / $compCount, 2) : 0.00;
            $compMatchPct = (int)round(($compAvg / 5.0) * 100);

            // Compute Readiness % (40% Performance + 60% Competency)
            $readinessPct = (int)round(($perfScore / 5.0 * 40) + ($compMatchPct * 0.60));
            if ($readinessPct > 100) $readinessPct = 100;

            // XP from ledger
            $xpData = $xpByEmp[$eId] ?? null;
            $totalXP = $xpData ? ($xpData['latestBalance'] > 0 ? $xpData['latestBalance'] : $xpData['totalPoints']) : (int)($emp['total_xp'] ?? 0);

            $recommendations[] = [
                'employeeId'               => $eId,
                'name'                     => $emp['full_name'] ?? ($emp['name'] ?? 'Associate'),
                'role'                     => $emp['title'] ?? ($emp['role'] ?? 'Staff'),
                'department'               => $empDept,
                'avatar'                   => $emp['avatar_url'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                'totalXP'                  => $totalXP,
                'xpSources'                => $xpData['sources'] ?? [],
                'recentAchievement'        => $xpData['recentDescription'] ?? 'Active in Performance & Development',
                'closedPerformanceRating'  => $perfScore,
                'competencyAverage'        => $compAvg,
                'competencyMatchPct'       => $compMatchPct,
                'computedReadinessPercent' => $readinessPct
            ];
        }

        // 5. Rank by total XP (descending), then readiness percent (descending)
        usort($recommendations, function ($a, $b) {
            if ($b['totalXP'] !== $a['totalXP']) {
                return $b['totalXP'] <=> $a['totalXP'];
            }
            return $b['computedReadinessPercent'] <=> $a['computedReadinessPercent'];
        });

        // Add rank index
        $rank = 1;
        foreach ($recommendations as &$rec) {
            $rec['rank'] = $rank++;
            $rec['isTopPerformer'] = $rec['rank'] <= 3;
        }

        return $recommendations;
    }

    /**
     * Assign a recommended successor to a position
     */
    public function assignSuccessorToPosition(string $positionId, string $employeeId, string $type = 'primary'): bool
    {
        if (empty($positionId) || empty($employeeId)) {
            return false;
        }

        $field = ($type === 'backup' || $type === 'emergency') ? 'emergency_backup_id' : 'primary_successor_id';
        $updatePayload = [
            $field => $employeeId,
            'updated_at' => date('c')
        ];

        if ($type === 'primary') {
            $updatePayload['bench_strength'] = 'Pipeline Active';
        }

        $res = supabaseRequest('succession_positions?id=eq.' . urlencode($positionId), 'PATCH', $updatePayload, true);
        $posUpdated = isset($res['status']) && ($res['status'] >= 200 && $res['status'] < 300);

        // Also ensure record exists in succession_candidates
        $candCheck = supabaseRequest('succession_candidates?position_id=eq.' . urlencode($positionId) . '&employee_id=eq.' . urlencode($employeeId), 'GET', null, true);
        $existingCands = is_array($candCheck['data'] ?? null) ? $candCheck['data'] : [];

        if (empty($existingCands)) {
            supabaseRequest('succession_candidates', 'POST', [
                'id' => 'cand-' . substr(bin2hex(random_bytes(3)), 0, 6),
                'position_id' => $positionId,
                'employee_id' => $employeeId,
                'hr_readiness_flag' => 'Pending Calibration',
                'notes' => 'Assigned as ' . ($type === 'primary' ? 'Primary Successor' : 'Emergency Backup') . ' via XP recommendation engine',
                'created_at' => date('c'),
                'updated_at' => date('c')
            ], true);
        }

        return $posUpdated;
    }

    /**
     * Delete a succession position
     */
    public function deletePosition(string $positionId): bool
    {
        $res = supabaseRequest('succession_positions?id=eq.' . urlencode($positionId), 'DELETE', null, true);
        return isset($res['status']) && ($res['status'] >= 200 && $res['status'] < 300);
    }
}
