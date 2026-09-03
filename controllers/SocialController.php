<?php
require_once __DIR__ . '/../models/SocialModel.php';

class SocialController
{
    private SocialModel $model;

    public function __construct()
    {
        $this->model = new SocialModel();
    }

    /**
     * Complete Social Recognition Hub State
     */
    public function getSocialOverview(?string $employeeId = null, ?string $sentimentFilterType = null, ?string $sentimentFilterValue = null): array
    {
        $recognitions = $this->model->getRecognitions();
        $sentiments = $this->model->getShiftSentiments($sentimentFilterType, $sentimentFilterValue);
        $roster = $this->model->getRoster();
        $ledger = $this->model->getLedger($employeeId);
        $badges = $this->model->getMilestoneBadges($employeeId);

        // Calculate Gamified Live Metrics from unified ledger
        $totalRecognitions = count($recognitions);
        $totalXPAwarded = 0;
        try {
            $pdoSc = getSupabaseDb();
            if ($pdoSc) {
                $stmtXp = $pdoSc->query("SELECT COALESCE(SUM(points), 0) AS total_xp FROM public.xp_ledger");
                $rXp = $stmtXp ? $stmtXp->fetch(PDO::FETCH_ASSOC) : null;
                if ($rXp && isset($rXp['total_xp'])) {
                    $totalXPAwarded = (int)$rXp['total_xp'];
                }
            }
        } catch (Throwable $e) {}

        if ($totalXPAwarded === 0) {
            $totalXPAwarded = array_reduce($recognitions, function ($sum, $r) {
                return $sum + (int)($r['points_awarded'] ?? 50);
            }, 0);
        }

        // Compute unlocked badges count
        $unlockedBadges = count(array_filter($badges, function($b) {
            return !empty($b['isUnlocked']);
        }));

        // Hourly / Rush Sentiment Calculations
        $avgScore = 0.0;
        if (!empty($sentiments)) {
            $totalScore = array_reduce($sentiments, function($sum, $s) {
                return $sum + (float)($s['sentiment_score'] ?? 4);
            }, 0);
            $avgScore = round($totalScore / count($sentiments), 1);
        }

        return [
            'success' => true,
            'data'    => [
                'kpis' => [
                    'totalRecognitions'   => $totalRecognitions,
                    'totalXPAwarded'      => $totalXPAwarded,
                    'badgesUnlocked'      => $unlockedBadges,
                    'averageSentiment'    => $avgScore,
                    'performanceSyncPct'  => $totalRecognitions > 0 ? 100 : 0
                ],
                'recognitions' => $recognitions,
                'sentiments'   => $sentiments,
                'roster'       => $roster,
                'ledger'       => $ledger,
                'badges'       => $badges,
                'champions'    => $this->model->getTop5XpChampions()
            ]
        ];
    }

    /**
     * Get Top 5 Gamified XP Champions ranked directly from xp_ledger
     */
    public function getTop5Champions(): array
    {
        return [
            'success' => true,
            'data'    => $this->model->getTop5XpChampions()
        ];
    }

    /**
     * Get Staff Roster for Kudos Multi-Select
     */
    public function getRoster(): array
    {
        return [
            'success' => true,
            'data'    => $this->model->getRoster()
        ];
    }

    /**
     * Get Deterministic Ledger
     */
    public function getLedger(?string $employeeId = null): array
    {
        return [
            'success' => true,
            'data'    => $this->model->getLedger($employeeId)
        ];
    }

    /**
     * Get Milestone Badges
     */
    public function getBadges(): array
    {
        return [
            'success' => true,
            'data'    => $this->model->getMilestoneBadges()
        ];
    }

    /**
     * Award Recognition & Record Deterministic XP
     */
    public function giveRecognition(array $payload): array
    {
        $senderType = $payload['senderType'] ?? ($payload['sender_type'] ?? ($_SESSION['role'] ?? 'Supervisor'));
        $defaultSenderName = ($senderType === 'Supervisor') ? ($_SESSION['full_name'] ?? 'Chef Marco Rossi') : ($_SESSION['full_name'] ?? 'Maria Santos');
        $defaultSenderRole = ($senderType === 'Supervisor') ? 'Supervisor' : 'Front Desk Host';
        $defaultSenderId = ($senderType === 'Supervisor') ? ($_SESSION['user_id'] ?? ($_SESSION['employee_id'] ?? 'emp-102')) : ($_SESSION['user_id'] ?? ($_SESSION['employee_id'] ?? 'emp-101'));
        $defaultSenderAvatar = ($senderType === 'Supervisor')
            ? 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

        $senderName = $payload['senderName'] ?? ($payload['sender_name'] ?? $defaultSenderName);
        if (stripos($senderName, 'Elena Vance') !== false) {
            $senderName = $defaultSenderName;
        }

        $senderRole = $payload['senderRole'] ?? ($payload['sender_role'] ?? $defaultSenderRole);
        if (stripos($senderRole, 'HR Director') !== false) {
            $senderRole = $defaultSenderRole;
        }

        $senderId = $payload['senderId'] ?? ($payload['sender_id'] ?? $defaultSenderId);
        if ($senderId === 'emp-105') {
            $senderId = $defaultSenderId;
        }

        $senderAvatar = $payload['senderAvatar'] ?? ($payload['sender_avatar'] ?? $defaultSenderAvatar);

        $receiverId = $payload['receiverId'] ?? ($payload['receiver_id'] ?? 'emp-101');
        $receiverName = $payload['receiverName'] ?? ($payload['receiver_name'] ?? 'Maria Santos');
        $receiverRole = $payload['receiverRole'] ?? ($payload['receiver_role'] ?? 'Front Desk Host');
        $receiverDept = $payload['receiverDept'] ?? ($payload['receiver_dept'] ?? ($payload['receiverDepartment'] ?? 'Front Office'));
        $receiverAvatar = $payload['receiverAvatar'] ?? ($payload['receiver_avatar'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');

        $categoryKey = $payload['categoryKey'] ?? ($payload['category_key'] ?? 'guest_service');
        $categoryLabel = $payload['categoryLabel'] ?? ($payload['category_label'] ?? 'Great Guest Service');
        $textContent = trim($payload['textContent'] ?? ($payload['text'] ?? ($payload['message'] ?? '')));

        if (empty($textContent)) {
            $textContent = 'Outstanding teamwork and hospitality excellence!';
        }

        // Deterministic Rule Engine for Points:
        // Peer: +50 XP, Supervisor: +100 XP, Executive/GM: +200 XP
        $points = 50;
        if (strcasecmp($senderType, 'Supervisor') === 0) {
            $points = 100;
        } elseif (strcasecmp($senderType, 'Executive') === 0 || strcasecmp($senderType, 'GM') === 0) {
            $points = 200;
        }

        $data = [
            'id'             => !empty($payload['id']) ? trim($payload['id']) : ('post-' . time() . '-' . rand(100, 999)),
            'sender_id'      => $senderId,
            'sender_name'    => $senderName,
            'sender_role'    => $senderRole,
            'sender_type'    => $senderType,
            'sender_avatar'  => $senderAvatar,
            'receiver_id'    => $receiverId,
            'receiver_name'  => $receiverName,
            'receiver_role'  => $receiverRole,
            'receiver_dept'  => $receiverDept,
            'receiver_avatar'=> $receiverAvatar,
            'category_key'   => $categoryKey,
            'category_label' => $categoryLabel,
            'points_awarded' => $points,
            'text_content'   => $textContent,
            'reactions'      => ['clap' => 0, 'heart' => 0, 'star' => 0, 'fire' => 0, 'user_reactions' => []],
            'comments'       => [],
            'created_at'     => date('c')
        ];

        $ok = $this->model->createRecognition($data);
        if ($ok) {
            $this->model->checkAndAwardBadges($receiverId);
        }

        return [
            'success' => $ok,
            'message' => $ok ? 'Recognition awarded & synced to Supabase!' : 'Failed to save recognition.',
            'data'    => $data
        ];
    }

    /**
     * Trigger Automatic LMS XP Grant
     */
    public function triggerLmsQuizPass(array $payload): array
    {
        $recipientId = $payload['employeeId'] ?? 'emp-101';
        $amount = (int)($payload['amount'] ?? 150);
        $quizName = $payload['quizName'] ?? 'Standard Operating Procedure';
        
        $ok = $this->model->createLmsGrant($recipientId, $amount, $quizName);
        if ($ok) {
            $this->model->checkAndAwardBadges($recipientId);
        }

        return [
            'success' => $ok,
            'message' => $ok ? 'LMS XP Grant recorded in ledger!' : 'Failed to record LMS grant.',
            'data' => [
                'employeeId' => $recipientId,
                'amount' => $amount
            ]
        ];
    }

    /**
     * Add, toggle, or switch reaction emoji (1 only per user, anti-spam)
     */
    public function addReaction(string $postId, string $reactionType, ?string $userId = null): array
    {
        return $this->model->addReaction($postId, $reactionType, $userId);
    }

    /**
     * Add Comment / Cheer
     */
    public function addComment(string $postId, array $payload): array
    {
        $rawName = $payload['author_name'] ?? ($payload['authorName'] ?? ($_SESSION['full_name'] ?? 'Hospitality Colleague'));
        $authorName = (stripos($rawName, 'Elena Vance') !== false) ? ($_SESSION['full_name'] ?? 'Chef Marco Rossi') : $rawName;

        $rawRole = $payload['author_role'] ?? ($payload['authorRole'] ?? ($_SESSION['role'] ?? 'Team Associate'));
        $authorRole = (stripos($rawRole, 'HR Director') !== false) ? 'Supervisor' : $rawRole;

        $authorAvatar = $payload['author_avatar'] ?? ($payload['authorAvatar'] ?? ($authorRole === 'Supervisor' 
            ? 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'));
        $text = trim($payload['text'] ?? '');

        if (empty($text)) {
            return ['success' => false, 'message' => 'Comment text cannot be empty.'];
        }

        $comment = [
            'author_name'   => $authorName,
            'author_role'   => $authorRole,
            'author_avatar' => $authorAvatar,
            'authorName'    => $authorName,
            'authorRole'    => $authorRole,
            'authorAvatar'  => $authorAvatar,
            'text'          => $text
        ];

        $ok = $this->model->addComment($postId, $comment);
        return [
            'success' => $ok,
            'message' => $ok ? 'Comment posted successfully!' : 'Failed to post comment.',
            'data'    => $comment
        ];
    }

    /**
     * Log Shift Sentiment Pulse
     */
    public function logShiftSentiment(array $payload): array
    {
        $empId = $payload['employeeId'] ?? 'emp-101';
        $empName = $payload['employeeName'] ?? 'Maria Santos';
        $dept = $payload['department'] ?? 'Front Office';
        $score = (int)($payload['sentimentScore'] ?? ($payload['score'] ?? 5));
        $period = $payload['shiftPeriod'] ?? 'Morning Shift';
        $sentimentType = $payload['sentimentType'] ?? ($score >= 4 ? 'Positive' : ($score === 3 ? 'Neutral' : 'Stressful'));
        $note = trim($payload['note'] ?? ($payload['notes'] ?? ''));

        $data = [
            'id'              => 'sent-' . time() . '-' . rand(100, 999),
            'employee_id'     => $empId,
            'employee_name'   => $empName,
            'department'      => $dept,
            'sentiment_score' => $score,
            'shift_period'    => $period,
            'sentiment_type'  => $sentimentType,
            'note'            => $note,
            'created_at'      => date('c')
        ];

        $ok = $this->model->logShiftSentiment($data);
        return [
            'success' => $ok,
            'message' => $ok ? 'Shift sentiment logged successfully to Supabase!' : 'Failed to log sentiment.',
            'data'    => $data
        ];
    }
}
