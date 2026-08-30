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

        // 2. Fetch employees from Supabase
        $empRes = supabaseRequest('employees?order=full_name.asc', 'GET', null, true);
        $employees = (is_array($empRes['data'] ?? null) && !isset($empRes['data']['code'])) ? $empRes['data'] : [];

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
        $cleanData = [
            'id'             => $data['id'] ?? ('post-' . time() . '-' . rand(100, 999)),
            'sender_id'      => $data['sender_id'] ?? 'emp-105',
            'sender_name'    => $data['sender_name'] ?? 'Elena Vance',
            'sender_role'    => $data['sender_role'] ?? 'HR Director & Master Trainer',
            'sender_type'    => $data['sender_type'] ?? 'Supervisor',
            'sender_avatar'  => $data['sender_avatar'] ?? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
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
     * Add or increment emoji cheer reaction
     */
    public function addReaction(string $postId, string $reactionType): bool
    {
        $res = supabaseRequest('social_recognitions?id=eq.' . urlencode($postId), 'GET', null, true);
        if (!empty($res['data'][0])) {
            $post = $res['data'][0];
            $reactions = $post['reactions'] ?? ['clap' => 0, 'heart' => 0, 'star' => 0, 'fire' => 0];
            if (is_string($reactions)) {
                $reactions = json_decode($reactions, true) ?: ['clap' => 0, 'heart' => 0, 'star' => 0, 'fire' => 0];
            }

            if (isset($reactions[$reactionType])) {
                $reactions[$reactionType]++;
            } else {
                $reactions[$reactionType] = 1;
            }

            $updateRes = supabaseRequest('social_recognitions?id=eq.' . urlencode($postId), 'PATCH', [
                'reactions' => $reactions
            ], true);

            if (isset($updateRes['status']) && ($updateRes['status'] >= 200 && $updateRes['status'] < 300)) {
                return true;
            }
        }

        return true;
    }

    /**
     * Add comment/cheer to recognition post
     */
    public function addComment(string $postId, array $comment): bool
    {
        $res = supabaseRequest('social_recognitions?id=eq.' . urlencode($postId), 'GET', null, true);
        if (!empty($res['data'][0])) {
            $post = $res['data'][0];
            $comments = $post['comments'] ?? [];
            if (is_string($comments)) {
                $comments = json_decode($comments, true) ?: [];
            }

            $comments[] = array_merge([
                'id'         => 'comment-' . uniqid(),
                'created_at' => date('c')
            ], $comment);

            $updateRes = supabaseRequest('social_recognitions?id=eq.' . urlencode($postId), 'PATCH', [
                'comments' => $comments
            ], true);

            if (isset($updateRes['status']) && ($updateRes['status'] >= 200 && $updateRes['status'] < 300)) {
                return true;
            }
        }

        return true;
    }

    /**
     * Fetch shift sentiments from Supabase with optional time filtering
     */
    public function getShiftSentiments(?string $filterType = null, ?string $filterValue = null): array
    {
        $res = supabaseRequest('shift_sentiments?order=created_at.desc&limit=500', 'GET', null, true);
        $sentiments = (is_array($res['data'] ?? null) && !isset($res['data']['code'])) ? $res['data'] : [];

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
        // Only include columns that exist in the shift_sentiments table:
        // id, employee_id, employee_name, sentiment_score, shift_period, note, created_at
        $clean = [
            'id'             => (!empty($data['id']) ? $data['id'] : ('sentiment-' . time() . '-' . rand(100, 999))),
            'employee_id'    => $data['employee_id']   ?? ($data['employeeId']   ?? 'emp-101'),
            'employee_name'  => $data['employee_name'] ?? ($data['employeeName'] ?? 'Associate'),
            'sentiment_score'=> (int)($data['sentiment_score'] ?? ($data['sentimentScore'] ?? 4)),
            'shift_period'   => $data['shift_period']  ?? ($data['shiftPeriod']  ?? 'General Shift'),
            'note'           => $data['note']          ?? '',
            'created_at'     => gmdate('Y-m-d\TH:i:s\Z'),
        ];

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
        // 1. Fetch raw transactions
        $res = supabaseRequest('xp_transactions?order=created_at.asc', 'GET', null, true);
        $txns = (is_array($res['data'] ?? null) && !isset($res['data']['code'])) ? $res['data'] : [];

        // Also fetch from xp_ledger table if exists
        $ledgerRes = supabaseRequest('xp_ledger?order=created_at.asc', 'GET', null, true);
        $ledgerRows = (is_array($ledgerRes['data'] ?? null) && !isset($ledgerRes['data']['code'])) ? $ledgerRes['data'] : [];

        // Combine and filter for employee if provided
        $roster = $this->getRoster();
        $empMap = [];
        foreach ($roster as $r) {
            $empMap[$r['id']] = $r['name'];
        }

        $allTxns = [];

        foreach ($txns as $t) {
            $recId = $t['recipient_id'] ?? '';
            if ($employeeId && $recId !== $employeeId) {
                continue; // User-specific privacy filter
            }
            $allTxns[] = [
                'id'         => $t['id'] ?? uniqid(),
                'date'       => !empty($t['created_at']) ? date('M d, Y', strtotime($t['created_at'])) : date('M d, Y'),
                'raw_date'   => $t['created_at'] ?? '',
                'recipient'  => $empMap[$recId] ?? 'My Account',
                'sender'     => empty($t['sender_id']) ? 'System LMS' : ($empMap[$t['sender_id']] ?? 'Supervisor'),
                'rule'       => strtoupper($t['source_type'] ?? 'XP_GRANT'),
                'category'   => $t['category'] ?? 'Hospitality Milestone',
                'amount'     => (int)($t['amount'] ?? 50),
                'note'       => $t['note'] ?? ''
            ];
        }

        foreach ($ledgerRows as $lr) {
            $eId = $lr['employee_id'] ?? '';
            if ($employeeId && $eId !== $employeeId) {
                continue; // User-specific privacy filter
            }
            $allTxns[] = [
                'id'         => $lr['id'] ?? uniqid(),
                'date'       => !empty($lr['created_at']) ? date('M d, Y', strtotime($lr['created_at'])) : date('M d, Y'),
                'raw_date'   => $lr['created_at'] ?? '',
                'recipient'  => $empMap[$eId] ?? 'My Account',
                'sender'     => 'Oxford Operations',
                'rule'       => strtoupper($lr['source_type'] ?? 'PERFORMANCE_XP'),
                'category'   => $lr['description'] ?? 'Performance & Development',
                'amount'     => (int)($lr['points'] ?? 50),
                'note'       => $lr['description'] ?? ''
            ];
        }

        // Sort chronologically ascending to calculate running balance
        usort($allTxns, function($a, $b) {
            return strcmp($a['raw_date'], $b['raw_date']);
        });

        $runningBalance = 0;
        $mapped = [];
        foreach ($allTxns as $t) {
            $runningBalance += $t['amount'];
            $mapped[] = [
                'id'        => $t['id'],
                'date'      => $t['date'],
                'recipient' => $t['recipient'],
                'sender'    => $t['sender'],
                'rule'      => $t['rule'],
                'category'  => $t['category'],
                'xpChange'  => '+' . $t['amount'] . ' XP',
                'balance'   => number_format($runningBalance) . ' XP'
            ];
        }

        return array_reverse($mapped);
    }

    /**
     * Compute Dynamic User-Scoped Milestone Badges based on their cumulative XP
     */
    public function getMilestoneBadges(?string $employeeId = null): array
    {
        // 1. Fetch real XP transactions
        $xpRes = supabaseRequest('xp_transactions?order=created_at.desc', 'GET', null, true);
        $txns = (is_array($xpRes['data'] ?? null) && !isset($xpRes['data']['code'])) ? $xpRes['data'] : [];

        $ledgerRes = supabaseRequest('xp_ledger?order=created_at.desc', 'GET', null, true);
        $ledgerRows = (is_array($ledgerRes['data'] ?? null) && !isset($ledgerRes['data']['code'])) ? $ledgerRes['data'] : [];

        $userTotalXp = 0;
        $userSafetyXp = 0;
        $userPeerXp = 0;
        $userCrisisXp = 0;

        foreach ($txns as $t) {
            $recId = $t['recipient_id'] ?? '';
            if ($employeeId && $recId !== $employeeId) continue;

            $pts = (int)($t['amount'] ?? 0);
            $cat = $t['category'] ?? '';
            $src = $t['source_type'] ?? '';

            $userTotalXp += $pts;
            if ($cat === 'safety_haccp' || str_contains($cat, 'safety')) $userSafetyXp += $pts;
            if ($src === 'peer_kudos' || $cat === 'collaboration') $userPeerXp += $pts;
            if ($cat === 'crisis_recovery' || str_contains($cat, 'crisis')) $userCrisisXp += $pts;
        }

        foreach ($ledgerRows as $lr) {
            $eId = $lr['employee_id'] ?? '';
            if ($employeeId && $eId !== $employeeId) continue;
            $pts = (int)($lr['points'] ?? 0);
            $desc = strtolower($lr['description'] ?? '');
            $src = $lr['source_type'] ?? '';

            $userTotalXp += $pts;
            if (str_contains($desc, 'haccp') || str_contains($desc, 'safety')) $userSafetyXp += $pts;
            if ($src === 'peer_kudos' || str_contains($desc, 'peer') || str_contains($desc, 'collaboration')) $userPeerXp += $pts;
            if (str_contains($desc, 'crisis') || str_contains($desc, 'de-escalation') || str_contains($desc, 'diplomacy')) $userCrisisXp += $pts;
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
            ['id' => 'emp-102', 'name' => 'Carlos Gomez', 'role' => 'Concierge Lead', 'dept' => 'Front Office', 'department' => 'Front Office', 'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'rating' => '4.60'],
            ['id' => 'emp-103', 'name' => 'Chef Marco Rossi', 'role' => 'Executive Sous Chef', 'dept' => 'Culinary', 'department' => 'Culinary', 'avatar' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80', 'rating' => '4.85'],
            ['id' => 'emp-104', 'name' => 'Chef Marco S.', 'role' => 'Line Cook Lead', 'dept' => 'Culinary', 'department' => 'Culinary', 'avatar' => 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=150&auto=format&fit=crop&q=80', 'rating' => '4.50'],
            ['id' => 'emp-106', 'name' => 'David Lee', 'role' => 'F&B Server Lead', 'dept' => 'F&B Service', 'department' => 'F&B Service', 'avatar' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 'rating' => '4.20'],
            ['id' => 'emp-105', 'name' => 'Elena Vance', 'role' => 'HR Director & Master Trainer', 'dept' => 'HR & Admin', 'department' => 'HR & Admin', 'avatar' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', 'rating' => '4.95']
        ];
    }
}
