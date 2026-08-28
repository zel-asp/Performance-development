<?php
require_once __DIR__ . '/../models/SocialModel.php';

class SocialController
{
    private SocialModel $model;

    public function __construct()
    {
        $this->model = new SocialModel();
    }

    public function getSocialOverview(): array
    {
        $recognitions = $this->model->getRecognitions();
        $sentiments = $this->model->getShiftSentiments();

        // Calculate Gamified Metrics
        $totalRecognitions = count($recognitions);
        $totalXPAwarded = array_reduce($recognitions, function ($sum, $r) {
            return $sum + (int)($r['points_awarded'] ?? 50);
        }, 0);

        // Map Badges Unlocked
        $userPoints = [];
        foreach ($recognitions as $r) {
            $recId = $r['receiver_id'] ?? 'emp-101';
            $pts = (int)($r['points_awarded'] ?? 50);
            $userPoints[$recId] = ($userPoints[$recId] ?? 0) + $pts;
        }

        $badgesUnlocked = 0;
        foreach ($userPoints as $pts) {
            if ($pts >= 500) $badgesUnlocked++;
            if ($pts >= 1000) $badgesUnlocked++;
            if ($pts >= 1500) $badgesUnlocked++;
        }
        if ($badgesUnlocked === 0) $badgesUnlocked = 4; // Seed baseline badge count

        return [
            'success' => true,
            'data'    => [
                'kpis' => [
                    'totalRecognitions'   => $totalRecognitions,
                    'totalXPAwarded'      => $totalXPAwarded,
                    'badgesUnlocked'      => $badgesUnlocked,
                    'performanceSyncPct' => 100
                ],
                'recognitions' => $recognitions,
                'sentiments'   => $sentiments
            ]
        ];
    }

    public function giveRecognition(array $payload): array
    {
        $senderId = $payload['senderId'] ?? 'emp-105';
        $senderName = $payload['senderName'] ?? 'Supervisor / Peer';
        $senderType = $payload['senderType'] ?? 'Supervisor';

        $receiverId = $payload['receiverId'] ?? 'emp-101';
        $receiverName = $payload['receiverName'] ?? 'Maria Santos';
        $receiverRole = $payload['receiverRole'] ?? 'Front Desk Host';
        $receiverDept = $payload['receiverDept'] ?? 'Front Office';

        $categoryKey = $payload['categoryKey'] ?? 'guest_service';
        $categoryLabel = $payload['categoryLabel'] ?? 'Great Guest Service';
        $textContent = trim($payload['textContent'] ?? '');

        if (empty($textContent)) {
            return ['success' => false, 'message' => 'Recognition message is required.'];
        }

        // Deterministic Rule Engine for Points
        $points = 50;
        if ($senderType === 'Supervisor') {
            $points = 100;
        } elseif ($senderType === 'Executive') {
            $points = 200;
        }

        $data = [
            'sender_id'      => $senderId,
            'sender_name'    => $senderName,
            'sender_role'    => 'Hotel Leader',
            'sender_type'    => $senderType,
            'sender_avatar'  => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
            'receiver_id'    => $receiverId,
            'receiver_name'  => $receiverName,
            'receiver_role'  => $receiverRole,
            'receiver_dept'  => $receiverDept,
            'receiver_avatar'=> 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            'category_key'   => $categoryKey,
            'category_label' => $categoryLabel,
            'points_awarded' => $points,
            'text_content'   => $textContent,
            'reactions'      => ['clap' => 1, 'heart' => 1, 'star' => 1, 'fire' => 0]
        ];

        $ok = $this->model->createRecognition($data);
        return [
            'success' => $ok,
            'message' => $ok ? 'Recognition awarded and synced to Supabase!' : 'Failed to save recognition.',
            'data'    => $data
        ];
    }

    public function addReaction(string $postId, string $reactionType): array
    {
        $ok = $this->model->addReaction($postId, $reactionType);
        return [
            'success' => $ok,
            'message' => $ok ? 'Reaction updated!' : 'Failed to update reaction.'
        ];
    }

    public function logShiftSentiment(array $payload): array
    {
        $empId = $payload['employeeId'] ?? 'emp-101';
        $empName = $payload['employeeName'] ?? 'Maria Santos';
        $score = (int)($payload['sentimentScore'] ?? 4);
        $period = $payload['shiftPeriod'] ?? 'Morning Shift';
        $note = trim($payload['note'] ?? '');

        $data = [
            'employee_id'     => $empId,
            'employee_name'   => $empName,
            'sentiment_score' => $score,
            'shift_period'    => $period,
            'note'            => $note
        ];

        $ok = $this->model->logShiftSentiment($data);
        return [
            'success' => $ok,
            'message' => $ok ? 'Shift sentiment logged successfully!' : 'Failed to log sentiment.'
        ];
    }
}
