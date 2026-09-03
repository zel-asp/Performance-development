<?php
require_once __DIR__ . '/BaseModel.php';
require_once __DIR__ . '/../config/config.php';

class SocialModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct('social_recognitions');
    }

    /**
     * Fetch staff roster from Supabase employees table enriched with departments
     */
    public function getRoster(): array
    {
        // 1. Fetch departments map
        $deptRes = supabaseRequest('departments', 'GET', null, true);
        $depts = is_array($deptRes['data'] ?? null) ? $deptRes['data'] : [];
        $deptMap = [];
        foreach ($depts as $d) {
            $dId = $d['id'] ?? '';
            if ($dId) $deptMap[$dId] = $d['name'] ?? 'Operations';
        }

        // 2. Fetch employees from Supabase (PDO direct database query first, then REST API fallback)
        $employees = [];
        try {
            $pdo = getSupabaseDb();
            if ($pdo) {
                $stmt = $pdo->query("SELECT id, full_name, email, role, title, department_id, avatar_url, performance_rating FROM public.employees ORDER BY full_name ASC");
                $dbEmployees = $stmt->fetchAll(PDO::FETCH_ASSOC);
                if (!empty($dbEmployees)) {
                    $employees = $dbEmployees;
                }
            }
        } catch (Throwable $e) {}

        if (empty($employees)) {
            $empRes = supabaseRequest('employees?order=full_name.asc', 'GET', null, true);
            $employees = (is_array($empRes['data'] ?? null) && !isset($empRes['data']['code'])) ? $empRes['data'] : [];
        }

        if (empty($employees)) {
            return $this->getBaselineRoster();
        }

        $roster = [];
        foreach ($employees as $e) {
            $dId = $e['department_id'] ?? '';
            $deptName = $deptMap[$dId] ?? ($e['department'] ?? 'Front Office');

            $roster[] = [
                'id'         => $e['id'] ?? ('emp-' . uniqid()),
                'name'       => $e['full_name'] ?? ($e['name'] ?? 'Hospitality Associate'),
                'role'       => $e['position'] ?? ($e['role'] ?? 'Staff Member'),
                'dept'       => $deptName,
                'department' => $deptName,
                'avatar'     => !empty($e['avatar_url']) ? $e['avatar_url'] : ($e['avatar'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
                'rating'     => isset($e['performance_rating']) ? number_format((float)$e['performance_rating'], 2) : '4.75'
            ];
        }

        return $roster;
    }

    /**
     * Fetch all social recognition posts from Supabase
     */
    public function getRecognitions(): array
    {
        $res = supabaseRequest('social_recognitions?order=created_at.desc', 'GET', null, true);
        $recognitions = (is_array($res['data'] ?? null) && !isset($res['data']['code'])) ? $res['data'] : [];
        return $recognitions;
    }

    /**
     * Get current XP balance for an employee from xp_ledger
     */
    public function getCurrentXpBalance(string $employeeId): int
    {
        $res = supabaseRequest('xp_ledger?employee_id=eq.' . urlencode($employeeId) . '&order=created_at.desc&limit=1', 'GET', null, true);
        if (!empty($res['data'][0]['balance_after'])) {
            return (int)$res['data'][0]['balance_after'];
        }
        $allRes = supabaseRequest('xp_ledger?employee_id=eq.' . urlencode($employeeId), 'GET', null, true);
        $rows = (is_array($allRes['data'] ?? null) && !isset($allRes['data']['code'])) ? $allRes['data'] : [];
        return array_reduce($rows, function($sum, $r) {
            return $sum + (int)($r['points'] ?? 0);
        }, 0);
    }

    /**
     * Create Recognition Post in social_recognitions & log to xp_ledger
     */
    public function createRecognition(array $data): bool
    {
        $senderName = $data['sender_name'] ?? ($_SESSION['full_name'] ?? 'Chef Marco Rossi');
        if (stripos($senderName, 'Elena Vance') !== false) {
            $senderName = $_SESSION['full_name'] ?? 'Chef Marco Rossi';
        }

        $senderRole = $data['sender_role'] ?? 'Supervisor';
        if (stripos($senderRole, 'HR Director') !== false) {
            $senderRole = 'Supervisor';
        }

        $senderId = $data['sender_id'] ?? ($_SESSION['user_id'] ?? 'emp-102');
        if ($senderId === 'emp-105') {
            $senderId = $_SESSION['user_id'] ?? 'emp-102';
        }

        $cleanData = [
            'id'             => $data['id'] ?? ('post-' . time() . '-' . rand(100, 999)),
            'sender_id'      => $senderId,
            'sender_name'    => $senderName,
            'sender_role'    => $senderRole,
            'sender_type'    => $data['sender_type'] ?? 'Supervisor',
            'sender_avatar'  => $data['sender_avatar'] ?? 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80',
            'receiver_id'    => $data['receiver_id'] ?? 'emp-101',
            'receiver_name'  => $data['receiver_name'] ?? 'Maria Santos',
            'receiver_role'  => $data['receiver_role'] ?? 'Front Desk Host',
            'receiver_dept'  => $data['receiver_dept'] ?? 'Front Office',
            'receiver_avatar'=> $data['receiver_avatar'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            'category_key'   => $data['category_key'] ?? 'guest_service',
            'category_label' => $data['category_label'] ?? 'Great Guest Service',
            'points_awarded' => (int)($data['points_awarded'] ?? 50),
            'text_content'   => $data['text_content'] ?? '',
            'reactions'      => isset($data['reactions']) && is_array($data['reactions']) ? $data['reactions'] : ['clap' => 0, 'heart' => 0, 'star' => 0, 'fire' => 0],
            'created_at'     => $data['created_at'] ?? date('c')
        ];

        // 1. Post to public team feed table
        $res = supabaseRequest('social_recognitions', 'POST', $cleanData, true);
        $ok = isset($res['status']) && ($res['status'] >= 200 && $res['status'] < 300);

        // 2. Record deterministic XP transaction in unified xp_ledger
        $xpPoints = (int)$cleanData['points_awarded'];
        $recipientId = $cleanData['receiver_id'];
        $senderType = $cleanData['sender_type'];
        $currentBalance = $this->getCurrentXpBalance($recipientId);
        $newBalance = $currentBalance + $xpPoints;

        $ledgerData = [
            'employee_id'   => $recipientId,
            'source_type'   => $senderType === 'Supervisor' ? 'supervisor_kudos' : (in_array($senderType, ['Executive', 'GM']) ? 'gm_citation' : 'peer_kudos'),
            'points'        => $xpPoints,
            'balance_after' => $newBalance,
            'description'   => "Recognition ({$cleanData['category_label']}) from {$cleanData['sender_name']}",
            'created_at'    => date('c')
        ];
        supabaseRequest('xp_ledger', 'POST', $ledgerData, true);

        return $ok;
    }

    /**
     * Automatic grant from LMS (system-generated)
     */
    public function createLmsGrant(string $recipientId, int $amount, string $quizName): bool
    {
        $currentBalance = $this->getCurrentXpBalance($recipientId);
        $newBalance = $currentBalance + $amount;

        $ledgerData = [
            'id'            => 'txn-lms-' . time() . '-' . rand(100, 999),
            'employee_id'   => $recipientId,
            'source_type'   => 'lms_quiz',
            'points'        => $amount,
            'balance_after' => $newBalance,
            'description'   => "LMS Quiz Pass: {$quizName}",
            'created_at'    => gmdate('Y-m-d\TH:i:s\Z')
        ];
        
        $res = supabaseRequest('xp_ledger', 'POST', $ledgerData, true);
        $ok = isset($res['status']) && ($res['status'] >= 200 && $res['status'] < 300);
        if ($ok) {
            $this->checkAndAwardBadges($recipientId);
        }
        return $ok;
    }

    /**
     * Automatic grant from Training Certification (on training evaluation pass / resolution)
     */
    public function createTrainingCertGrant(string $recipientId, int $amount, string $programTitle, ?string $certNumber = null): bool
    {
        $currentBalance = $this->getCurrentXpBalance($recipientId);
        $newBalance = $currentBalance + $amount;
        $desc = "Training Certification: {$programTitle}" . ($certNumber ? " ({$certNumber})" : "");

        $ledgerData = [
            'id'            => 'txn-train-' . time() . '-' . rand(100, 999),
            'employee_id'   => $recipientId,
            'source_type'   => 'training_cert',
            'points'        => $amount,
            'balance_after' => $newBalance,
            'description'   => $desc,
            'created_at'    => gmdate('Y-m-d\TH:i:s\Z')
        ];

        $res = supabaseRequest('xp_ledger', 'POST', $ledgerData, true);
        $ok = isset($res['status']) && ($res['status'] >= 200 && $res['status'] < 300);
        if ($ok) {
            $this->checkAndAwardBadges($recipientId);
        }
        return $ok;
    }

    /**
     * Badge threshold check — query cumulative xp_ledger
     */
    public function checkAndAwardBadges(string $employeeId): array
    {
        $res = supabaseRequest('xp_ledger?employee_id=eq.' . urlencode($employeeId), 'GET', null, true);
        $ledgerRows = (is_array($res['data'] ?? null) && !isset($res['data']['code'])) ? $res['data'] : [];
        
        $totalXp = 0;
        $peerKudosCount = 0;
        
        foreach ($ledgerRows as $t) {
            $totalXp += (int)($t['points'] ?? 0);
            if (($t['source_type'] ?? '') === 'peer_kudos') {
                $peerKudosCount++;
            }
        }
        
        $awarded = [];
        if ($totalXp >= 2500) {
            $awarded[] = 'badge-1'; // Excellence Master
        }
        if ($peerKudosCount >= 5) {
            $awarded[] = 'badge-3'; // Team Anchor
        }
        
        return $awarded;
    }

    /**
     * Add, toggle, or switch emoji cheer reaction (enforcing 1 reaction per user, anti-spam)
     * Persists immediately to Supabase and broadcasts to Supabase Realtime
     */
    public function addReaction(string $postId, string $reactionType, ?string $userId = null): array
    {
        $validTypes = ['clap', 'heart', 'star', 'fire'];
        if (!in_array($reactionType, $validTypes)) {
            $reactionType = 'clap';
        }

        $userId = !empty($userId) ? trim($userId) : ($_SESSION['user']['id'] ?? 'emp-101');

        // Fetch latest post reactions from database
        $post = null;
        $pdo = null;
        try {
            $pdo = getSupabaseDb();
            if ($pdo) {
                $stmt = $pdo->prepare("SELECT id, reactions FROM public.social_recognitions WHERE id = :id");
                $stmt->execute([':id' => $postId]);
                $post = $stmt->fetch(PDO::FETCH_ASSOC);
            }
        } catch (Throwable $e) {
            error_log('[SocialModel::addReaction] DB fetch error: ' . $e->getMessage());
        }

        if (!$post) {
            $res = supabaseRequest('social_recognitions?id=eq.' . urlencode($postId), 'GET', null, true);
            if (!empty($res['data'][0])) {
                $post = $res['data'][0];
            }
        }

        if (!$post) {
            return [
                'success' => false,
                'message' => 'Recognition post not found.'
            ];
        }

        $reactions = $post['reactions'] ?? ['clap' => 0, 'heart' => 0, 'star' => 0, 'fire' => 0, 'user_reactions' => []];
        if (is_string($reactions)) {
            $reactions = json_decode($reactions, true) ?: ['clap' => 0, 'heart' => 0, 'star' => 0, 'fire' => 0, 'user_reactions' => []];
        }

        // Initialize reaction counts ensuring non-negative integers
        foreach ($validTypes as $t) {
            $reactions[$t] = max(0, (int)($reactions[$t] ?? 0));
        }

        // Initialize user-level tracking: user_id => reaction_type
        $userReactions = isset($reactions['user_reactions']) && is_array($reactions['user_reactions'])
            ? $reactions['user_reactions']
            : [];

        $currentReaction = $userReactions[$userId] ?? null;
        $actionTaken = '';
        $userActiveReaction = null;

        if ($currentReaction === $reactionType) {
            // 1. Same reaction clicked again -> TOGGLE OFF (Unlike)
            unset($userReactions[$userId]);
            $reactions[$reactionType] = max(0, $reactions[$reactionType] - 1);
            $actionTaken = 'removed';
            $userActiveReaction = null;
        } elseif (!empty($currentReaction)) {
            // 2. Different reaction clicked -> SWITCH reaction (Enforces 1 reaction per user!)
            $reactions[$currentReaction] = max(0, $reactions[$currentReaction] - 1);
            $reactions[$reactionType] = $reactions[$reactionType] + 1;
            $userReactions[$userId] = $reactionType;
            $actionTaken = 'switched';
            $userActiveReaction = $reactionType;
        } else {
            // 3. First reaction -> ADD reaction (1 only per user)
            $reactions[$reactionType] = $reactions[$reactionType] + 1;
            $userReactions[$userId] = $reactionType;
            $actionTaken = 'added';
            $userActiveReaction = $reactionType;
        }

        $reactions['user_reactions'] = $userReactions;

        // Persist to Supabase Database (triggers Realtime logical replication broadcast)
        $saved = false;
        if ($pdo) {
            try {
                $updateStmt = $pdo->prepare("UPDATE public.social_recognitions SET reactions = :reactions WHERE id = :id");
                $saved = $updateStmt->execute([
                    ':reactions' => json_encode($reactions),
                    ':id'        => $postId
                ]);
            } catch (Throwable $e) {
                error_log('[SocialModel::addReaction] PDO update error: ' . $e->getMessage());
            }
        }

        if (!$saved) {
            $updateRes = supabaseRequest('social_recognitions?id=eq.' . urlencode($postId), 'PATCH', [
                'reactions' => $reactions
            ], true);
            $saved = isset($updateRes['status']) && ($updateRes['status'] >= 200 && $updateRes['status'] < 300);
        }

        return [
            'success' => true,
            'message' => $actionTaken === 'removed' ? 'Reaction removed.' : 'Reaction recorded!',
            'data'    => [
                'postId'         => $postId,
                'reactionType'   => $reactionType,
                'action'         => $actionTaken,
                'userActive'     => $userActiveReaction,
                'reactions'      => $reactions
            ]
        ];
    }

    /**
     * Add comment/cheer to recognition post
     */
    public function addComment(string $postId, array $comment): bool
    {
        $post = null;
        $pdo = null;
        try {
            $pdo = getSupabaseDb();
            if ($pdo) {
                $stmt = $pdo->prepare("SELECT id, comments FROM public.social_recognitions WHERE id = :id");
                $stmt->execute([':id' => $postId]);
                $post = $stmt->fetch(PDO::FETCH_ASSOC);
            }
        } catch (Throwable $e) {
            error_log('[SocialModel::addComment] DB fetch error: ' . $e->getMessage());
        }

        if (!$post) {
            $res = supabaseRequest('social_recognitions?id=eq.' . urlencode($postId), 'GET', null, true);
            if (!empty($res['data'][0])) {
                $post = $res['data'][0];
            }
        }

        if ($post) {
            $comments = $post['comments'] ?? [];
            if (is_string($comments)) {
                $comments = json_decode($comments, true) ?: [];
            }

            $comments[] = array_merge([
                'id'         => 'comment-' . uniqid(),
                'created_at' => date('c')
            ], $comment);

            $saved = false;
            if ($pdo) {
                try {
                    $updateStmt = $pdo->prepare("UPDATE public.social_recognitions SET comments = :comments WHERE id = :id");
                    $saved = $updateStmt->execute([
                        ':comments' => json_encode($comments),
                        ':id'       => $postId
                    ]);
                } catch (Throwable $e) {
                    error_log('[SocialModel::addComment] PDO update error: ' . $e->getMessage());
                }
            }

            if (!$saved) {
                $updateRes = supabaseRequest('social_recognitions?id=eq.' . urlencode($postId), 'PATCH', [
                    'comments' => $comments
                ], true);
                $saved = isset($updateRes['status']) && ($updateRes['status'] >= 200 && $updateRes['status'] < 300);
            }

            return $saved;
        }

        return false;
    }

    /**
     * Fetch shift sentiments from Supabase with optional time filtering
     */
    public function getShiftSentiments(?string $filterType = null, ?string $filterValue = null): array
    {
        $sentiments = [];
        try {
            $pdo = getSupabaseDb();
            if ($pdo) {
                $stmt = $pdo->query("SELECT id, employee_id, employee_name, sentiment_score, shift_period, note, created_at FROM public.shift_sentiments ORDER BY created_at DESC LIMIT 500");
                $dbSentiments = $stmt->fetchAll(PDO::FETCH_ASSOC);
                if (!empty($dbSentiments)) {
                    $sentiments = $dbSentiments;
                }
            }
        } catch (Throwable $e) {}

        if (empty($sentiments)) {
            $res = supabaseRequest('shift_sentiments?order=created_at.desc&limit=500', 'GET', null, true);
            $sentiments = (is_array($res['data'] ?? null) && !isset($res['data']['code'])) ? $res['data'] : [];
        }

        if (empty($sentiments)) {
            return [];
        }

        // Normalize created_at to UTC date string for comparison
        $todayStr = gmdate('Y-m-d'); // always compare in UTC

        if (!empty($filterType)) {
            $filtered = array_filter($sentiments, function($s) use ($filterType, $filterValue, $todayStr) {
                $createdAt = $s['created_at'] ?? '';
                if (empty($createdAt)) return true;

                // Normalize to UTC date — handle both +00:00 and offset formats
                $ts = strtotime($createdAt);
                if ($ts === false) return true;
                $datePart  = gmdate('Y-m-d', $ts);
                $monthPart = gmdate('Y-m', $ts);

                if ($filterType === 'today') {
                    return $datePart === $todayStr;
                } elseif ($filterType === 'date' && !empty($filterValue)) {
                    return $datePart === $filterValue;
                } elseif ($filterType === 'month' && !empty($filterValue)) {
                    // filterValue can be 'YYYY-MM'
                    return $monthPart === substr($filterValue, 0, 7);
                } elseif ($filterType === 'month_picker' && !empty($filterValue)) {
                    return $monthPart === substr($filterValue, 0, 7);
                } elseif ($filterType === 'week') {
                    $weekAgo = strtotime('-7 days');
                    return $ts >= $weekAgo;
                }
                return true;
            });

            $filtered = array_values($filtered);

            // If today filter returns empty (seeded data is older), return all so the chart isn't blank
            if ($filterType === 'today' && count($filtered) === 0) {
                return array_values($sentiments);
            }

            return $filtered;
        }

        return array_values($sentiments);
    }

    /**
     * Log a shift sentiment pulse into Supabase
     */
    public function logShiftSentiment(array $data): bool
    {
        $clean = [
            'id'             => (!empty($data['id']) ? $data['id'] : ('sent-' . time() . '-' . rand(100, 999))),
            'employee_id'    => $data['employee_id']   ?? ($data['employeeId']   ?? 'emp-101'),
            'employee_name'  => $data['employee_name'] ?? ($data['employeeName'] ?? 'Associate'),
            'sentiment_score'=> (int)($data['sentiment_score'] ?? ($data['sentimentScore'] ?? 4)),
            'shift_period'   => $data['shift_period']  ?? ($data['shiftPeriod']  ?? 'Peak Rush Window'),
            'note'           => $data['note']          ?? '',
            'created_at'     => gmdate('Y-m-d\TH:i:s\Z'),
        ];

        try {
            $pdo = getSupabaseDb();
            if ($pdo) {
                $stmt = $pdo->prepare("INSERT INTO public.shift_sentiments (id, employee_id, employee_name, sentiment_score, shift_period, note, created_at) VALUES (:id, :employee_id, :employee_name, :sentiment_score, :shift_period, :note, :created_at)");
                $ok = $stmt->execute([
                    ':id'              => $clean['id'],
                    ':employee_id'     => $clean['employee_id'],
                    ':employee_name'   => $clean['employee_name'],
                    ':sentiment_score' => $clean['sentiment_score'],
                    ':shift_period'    => $clean['shift_period'],
                    ':note'            => $clean['note'],
                    ':created_at'      => $clean['created_at']
                ]);
                if ($ok) return true;
            }
        } catch (Throwable $e) {
            error_log('[SocialModel] PDO logShiftSentiment fallback: ' . $e->getMessage());
        }

        $res = supabaseRequest('shift_sentiments', 'POST', $clean, true);

        if (!empty($res['error'])) {
            error_log('[SocialModel] logShiftSentiment error: ' . $res['error']);
            return false;
        }
        return ($res['status'] ?? 500) < 300;
    }

    /**
     * Fetch User-Scoped Deterministic XP Ledger from xp_transactions / xp_ledger
     */
    public function getLedger(?string $employeeId = null): array
    {
        // Direct Query on unified xp_ledger table from Supabase
        $endpoint = 'xp_ledger?order=created_at.asc';
        if ($employeeId) {
            $endpoint .= '&employee_id=eq.' . urlencode($employeeId);
        }
        $ledgerRes = supabaseRequest($endpoint, 'GET', null, true);
        $ledgerRows = (is_array($ledgerRes['data'] ?? null) && !isset($ledgerRes['data']['code'])) ? $ledgerRes['data'] : [];

        $roster = $this->getRoster();
        $empMap = [];
        foreach ($roster as $r) {
            $empMap[$r['id']] = $r['name'];
        }

        // Sort chronologically ascending to calculate running balance
        usort($ledgerRows, function($a, $b) {
            return strcmp($a['created_at'] ?? '', $b['created_at'] ?? '');
        });

        $runningBalance = 0;
        $mapped = [];
        foreach ($ledgerRows as $lr) {
            $eId = $lr['employee_id'] ?? '';
            $pts = (int)($lr['points'] ?? 0);
            $runningBalance += $pts;
            $rawDate = $lr['created_at'] ?? '';
            $srcType = $lr['source_type'] ?? 'peer_kudos';

            $mapped[] = [
                'id'                  => $lr['id'] ?? uniqid(),
                'employee_id'         => $eId,
                'date'                => !empty($rawDate) ? date('M d, Y', strtotime($rawDate)) : date('M d, Y'),
                'raw_date'            => $rawDate,
                'created_at'          => $rawDate,
                'recipient'           => $empMap[$eId] ?? 'My Account',
                'sender'              => 'Oxford Operations',
                'rule'                => strtoupper(str_replace('_', ' ', $srcType)),
                'source_type'         => $srcType,
                'category'            => $lr['description'] ?? 'Performance & Development',
                'amount'              => $pts,
                'points'              => $pts,
                'xpChange'            => ($pts >= 0 ? '+' : '') . $pts . ' XP',
                'balance'             => number_format($runningBalance) . ' XP',
                'balance_num'         => $runningBalance,
                'performance_eval_id' => $lr['performance_eval_id'] ?? null
            ];
        }

        return array_reverse($mapped);
    }

    /**
     * Compute Dynamic User-Scoped Milestone Badges based on their cumulative XP from xp_ledger
     */
    public function getMilestoneBadges(?string $employeeId = null): array
    {
        $endpoint = 'xp_ledger?order=created_at.desc';
        if ($employeeId) {
            $endpoint .= '&employee_id=eq.' . urlencode($employeeId);
        }
        $ledgerRes = supabaseRequest($endpoint, 'GET', null, true);
        $ledgerRows = (is_array($ledgerRes['data'] ?? null) && !isset($ledgerRes['data']['code'])) ? $ledgerRes['data'] : [];

        $userTotalXp = 0;
        $userSafetyXp = 0;
        $userPeerXp = 0;
        $userCrisisXp = 0;

        foreach ($ledgerRows as $lr) {
            $pts = (int)($lr['points'] ?? 0);
            $userTotalXp += $pts;
            $desc = strtolower($lr['description'] ?? '');
            $src = strtolower($lr['source_type'] ?? '');
            if (strpos($desc, 'safety') !== false || strpos($desc, 'haccp') !== false || strpos($src, 'training') !== false) {
                $userSafetyXp += $pts;
            }
            if (strpos($src, 'peer') !== false || strpos($desc, 'peer') !== false) {
                $userPeerXp += $pts;
            }
            if (strpos($desc, 'crisis') !== false || strpos($desc, 'rush') !== false || strpos($desc, 'occupancy') !== false) {
                $userCrisisXp += $pts;
            }
        }

        foreach ($ledgerRows as $lr) {
            $pts = (int)($lr['points'] ?? 0);
            $desc = strtolower($lr['description'] ?? '');
            $src = strtolower($lr['source_type'] ?? '');

            $userTotalXp += $pts;
            if (strpos($desc, 'haccp') !== false || strpos($desc, 'safety') !== false || strpos($src, 'training') !== false) {
                $userSafetyXp += $pts;
            }
            if (strpos($src, 'peer') !== false || strpos($desc, 'peer') !== false || strpos($desc, 'collaboration') !== false) {
                $userPeerXp += $pts;
            }
            if (strpos($desc, 'crisis') !== false || strpos($desc, 'rush') !== false || strpos($desc, 'occupancy') !== false || strpos($desc, 'diplomacy') !== false) {
                $userCrisisXp += $pts;
            }
        }

        $b1Progress = min(100, (int)round(($userTotalXp / 2500) * 100));
        $b2Progress = min(100, (int)round(($userSafetyXp / 1000) * 100));
        $b3Progress = min(100, (int)round(($userPeerXp / 500) * 100));
        $b4Progress = min(100, (int)round(($userCrisisXp / 1500) * 100));

        $unlockedCount = 0;
        if ($b1Progress >= 100) $unlockedCount++;
        if ($b2Progress >= 100) $unlockedCount++;
        if ($b3Progress >= 100) $unlockedCount++;
        if ($b4Progress >= 100) $unlockedCount++;

        return [
            [
                'id'          => 'badge-1',
                'name'        => 'Excellence Master',
                'category'    => 'Guest Delight',
                'threshold'   => '2,500+ Total XP',
                'currentXp'   => $userTotalXp,
                'targetXp'    => 2500,
                'icon'        => 'fa-trophy',
                'color'       => 'gold',
                'awardedTo'   => $b1Progress >= 100 ? 'Unlocked' : 'In Progress',
                'dateAwarded' => $b1Progress >= 100 ? date('M Y') : null,
                'progressPct' => $b1Progress,
                'isUnlocked'  => $b1Progress >= 100
            ],
            [
                'id'          => 'badge-2',
                'name'        => 'Safety Champion',
                'category'    => 'Safety & HACCP',
                'threshold'   => '1,000+ HACCP XP',
                'currentXp'   => $userSafetyXp,
                'targetXp'    => 1000,
                'icon'        => 'fa-shield-halved',
                'color'       => 'sage',
                'awardedTo'   => $b2Progress >= 100 ? 'Unlocked' : 'In Progress',
                'dateAwarded' => $b2Progress >= 100 ? date('M Y') : null,
                'progressPct' => $b2Progress,
                'isUnlocked'  => $b2Progress >= 100
            ],
            [
                'id'          => 'badge-3',
                'name'        => 'Team Anchor',
                'category'    => 'Collaboration',
                'threshold'   => '500+ Peer XP',
                'currentXp'   => $userPeerXp,
                'targetXp'    => 500,
                'icon'        => 'fa-hands-holding-circle',
                'color'       => 'dusty',
                'awardedTo'   => $b3Progress >= 100 ? 'Unlocked' : 'In Progress',
                'dateAwarded' => $b3Progress >= 100 ? date('M Y') : null,
                'progressPct' => $b3Progress,
                'isUnlocked'  => $b3Progress >= 100
            ],
            [
                'id'          => 'badge-4',
                'name'        => 'Diplomacy Lead',
                'category'    => 'Crisis Recovery',
                'threshold'   => '1,500+ De-escalation XP',
                'currentXp'   => $userCrisisXp,
                'targetXp'    => 1500,
                'icon'        => 'fa-handshake-angle',
                'color'       => 'terracotta',
                'awardedTo'   => $b4Progress >= 100 ? 'Unlocked' : 'In Progress',
                'dateAwarded' => $b4Progress >= 100 ? date('M Y') : null,
                'progressPct' => $b4Progress,
                'isUnlocked'  => $b4Progress >= 100
            ]
        ];
    }

    /**
     * Fallback Staff Roster
     */
    private function getBaselineRoster(): array
    {
        return [
            ['id' => 'emp-101', 'name' => 'Maria Santos', 'role' => 'Front Desk Host', 'dept' => 'Front Office', 'department' => 'Front Office', 'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'rating' => '4.80'],
            ['id' => 'emp-102', 'name' => 'Chef Marco Rossi', 'role' => 'Kitchen Staff', 'dept' => 'Culinary', 'department' => 'Culinary', 'avatar' => 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80', 'rating' => '4.85'],
            ['id' => '3bb792e6-b25e-460e-a8fa-712c65c3b2e2', 'name' => 'Janzel', 'role' => 'Housekeeping Supervisor', 'dept' => 'Housekeeping', 'department' => 'Housekeeping', 'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'rating' => '4.90'],
            ['id' => '3a52667f-53cf-412a-b048-ef96eb407707', 'name' => 'Juan Dela Cruz', 'role' => 'Front Desk Associate', 'dept' => 'Front Office', 'department' => 'Front Office', 'avatar' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 'rating' => '4.70']
        ];
    }

    /**
     * Get Top 5 Gamified XP Champions ranked directly from xp_ledger.
     * Ties are handled gracefully: if employees have the same XP (e.g. 0 XP),
     * they are placed at the same rank level.
     */
    public function getTop5XpChampions(): array
    {
        // 1. Fetch all records from xp_ledger
        $ledgerRes = supabaseRequest('xp_ledger?order=created_at.asc', 'GET', null, true);
        $ledgerRows = (is_array($ledgerRes['data'] ?? null) && !isset($ledgerRes['data']['code'])) ? $ledgerRes['data'] : [];

        // 2. Fetch full active roster
        $roster = $this->getRoster();

        // 3. Aggregate XP and trophy counts per employee from xp_ledger
        $empTotals = [];
        foreach ($roster as $emp) {
            $eId = (string)($emp['id'] ?? '');
            $empTotals[$eId] = [
                'employee_id' => $eId,
                'name'        => $emp['name'] ?? 'Associate',
                'role'        => $emp['role'] ?? ($emp['position'] ?? 'Staff'),
                'department'  => $emp['department'] ?? ($emp['dept'] ?? 'Front Office'),
                'avatar'      => $emp['avatar'] ?? '',
                'total_xp'    => 0,
                'trophies'    => 0
            ];
        }

        foreach ($ledgerRows as $row) {
            $rowEmpId = (string)($row['employee_id'] ?? '');
            $pts = (int)($row['points'] ?? 0);
            if (empty($rowEmpId)) continue;

            $matchedKey = null;
            if (isset($empTotals[$rowEmpId])) {
                $matchedKey = $rowEmpId;
            } else {
                foreach ($empTotals as $k => $eData) {
                    if (strcasecmp($k, $rowEmpId) === 0) {
                        $matchedKey = $k;
                        break;
                    }
                }
            }

            if ($matchedKey) {
                $empTotals[$matchedKey]['total_xp'] += $pts;
                if ($pts > 0) {
                    $empTotals[$matchedKey]['trophies']++;
                }
            }
        }

        // 4. Filter out employees with 0 XP - only employees with XP > 0 qualify for the podium
        $qualifiers = array_filter($empTotals, function($e) {
            return ($e['total_xp'] ?? 0) > 0;
        });

        $champions = array_values($qualifiers);
        usort($champions, function($a, $b) {
            if ($b['total_xp'] !== $a['total_xp']) {
                return $b['total_xp'] - $a['total_xp'];
            }
            return strcmp($a['name'], $b['name']);
        });

        // 5. Calculate Dense Ranking and Rank Levels for qualifiers
        $currentRank = 1;
        $prevXp = null;
        $rankedChampions = [];

        $rankLabels = [
            1 => 'FIRST',
            2 => 'SECOND',
            3 => 'THIRD',
            4 => 'FOURTH',
            5 => 'FIFTH'
        ];

        for ($i = 0; $i < count($champions); $i++) {
            $c = $champions[$i];
            $xp = $c['total_xp'];

            if ($prevXp !== null) {
                if ($xp < $prevXp) {
                    $currentRank++;
                }
            }
            $prevXp = $xp;

            $c['rank'] = $currentRank;
            $c['rank_label'] = $rankLabels[$currentRank] ?? ('RANK ' . $currentRank);
            $c['is_tied'] = false;
            $c['is_ready'] = false;
            $rankedChampions[] = $c;
        }

        // Detect ties among qualifiers
        $rankCounts = array_count_values(array_column($rankedChampions, 'rank'));
        foreach ($rankedChampions as &$rc) {
            if (($rankCounts[$rc['rank']] ?? 0) > 1) {
                $rc['is_tied'] = true;
            }
        }
        unset($rc);

        // 6. Always ensure exactly 5 podium slots (fill remaining with "Ready" state)
        $podium = array_slice($rankedChampions, 0, 5);

        while (count($podium) < 5) {
            $slotIndex = count($podium) + 1;
            $podium[] = [
                'employee_id' => null,
                'name'        => 'Ready',
                'role'        => 'Open Slot',
                'department'  => 'Contender',
                'avatar'      => '',
                'total_xp'    => 0,
                'trophies'    => 0,
                'rank'        => $slotIndex,
                'rank_label'  => $rankLabels[$slotIndex] ?? ('RANK ' . $slotIndex),
                'is_tied'     => false,
                'is_ready'    => true
            ];
        }

        return $podium;
    }
}
