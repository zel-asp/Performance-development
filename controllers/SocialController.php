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

        // Calculate Gamified Live Metrics
        $totalRecognitions = count($recognitions);
        $totalXPAwarded = array_reduce($recognitions, function ($sum, $r) {
            return $sum + (int)($r['points_awarded'] ?? 50);
        }, 0);

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
        $senderId = $payload['senderId'] ?? 'emp-105';
        $senderName = $payload['senderName'] ?? 'Elena Vance';
        $senderType = $payload['senderType'] ?? 'Supervisor';
        $senderRole = $payload['senderRole'] ?? ($senderType === 'Supervisor' ? 'HR Director & Master Trainer' : 'Front Desk Host');
        $senderAvatar = $payload['senderAvatar'] ?? ($senderType === 'Supervisor' 
            ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' 
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');

        $receiverId = $payload['receiverId'] ?? 'emp-101';
        $receiverName = $payload['receiverName'] ?? 'Maria Santos';
        $receiverRole = $payload['receiverRole'] ?? 'Front Desk Host';
        $receiverDept = $payload['receiverDept'] ?? ($payload['receiverDepartment'] ?? 'Front Office');
        $receiverAvatar = $payload['receiverAvatar'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

        $categoryKey = $payload['categoryKey'] ?? 'guest_service';
        $categoryLabel = $payload['categoryLabel'] ?? 'Great Guest Service';
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
            'id'             => 'post-' . time() . '-' . rand(100, 999),
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
            'reactions'      => ['clap' => 1, 'heart' => 1, 'star' => 1, 'fire' => 0],
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
     * Increment Reaction Emoji
     */
    public function addReaction(string $postId, string $reactionType): array
    {
        $ok = $this->model->addReaction($postId, $reactionType);
        return [
            'success' => $ok,
            'message' => $ok ? 'Reaction updated!' : 'Failed to update reaction.'
        ];
    }

    /**
     * Add Comment / Cheer
     */
    public function addComment(string $postId, array $payload): array
    {
        $authorName = $payload['authorName'] ?? 'Hospitality Colleague';
        $authorRole = $payload['authorRole'] ?? 'Team Associate';
        $authorAvatar = $payload['authorAvatar'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
        $text = trim($payload['text'] ?? '');

        if (empty($text)) {
            return ['success' => false, 'message' => 'Comment text cannot be empty.'];
        }

        $comment = [
            'author_name'   => $authorName,
            'author_role'   => $authorRole,
            'author_avatar' => $authorAvatar,
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
