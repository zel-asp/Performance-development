<?php

require_once __DIR__ . '/BaseModel.php';

class NotificationModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct('notifications');
    }

    /**
     * Fetch notifications filtered strictly by role or user_id
     */
    public function getNotifications(array $filters = []): array
    {
        $all = $this->all();

        if (!is_array($all)) {
            return [];
        }

        $filtered = [];
        $targetRole = isset($filters['role']) ? strtolower(trim($filters['role'])) : null;
        $userId = isset($filters['user_id']) ? strtolower(trim($filters['user_id'])) : null;

        foreach ($all as $item) {
            $itemRole = strtolower(trim($item['recipient_role'] ?? ''));
            $itemUser = strtolower(trim($item['user_id'] ?? ''));

            // 1. If notification is specifically targeted to a specific user_id
            if (!empty($itemUser)) {
                if ($userId && $itemUser === $userId) {
                    $filtered[] = $item;
                }
                // Strictly exclude from any other user
                continue;
            }

            // 2. If notification is broad / role-broadcast (no specific user_id)
            if ($targetRole && $targetRole !== 'all') {
                $isMatch = ($itemRole === $targetRole || $itemRole === 'all' || $itemRole === 'broadcast');
                if (!$isMatch) {
                    if (($targetRole === 'associate' || $targetRole === 'employee') && ($itemRole === 'associate' || $itemRole === 'employee')) {
                        $isMatch = true;
                    } elseif (($targetRole === 'supervisor' || $targetRole === 'manager') && ($itemRole === 'supervisor' || $itemRole === 'manager')) {
                        $isMatch = true;
                    }
                }
                if ($isMatch) {
                    $filtered[] = $item;
                }
            } else {
                $filtered[] = $item;
            }
        }

        // Sort by created_at DESC
        usort($filtered, function ($a, $b) {
            $tA = strtotime($a['created_at'] ?? 'now');
            $tB = strtotime($b['created_at'] ?? 'now');
            return $tB - $tA;
        });

        return $filtered;
    }

    /**
     * Create a new notification with goal_id foreign key support
     */
    public function createNotification(array $data): array
    {
        $goalId = null;
        if (!empty($data['goal_id']) && is_numeric($data['goal_id'])) {
            $goalId = (int)$data['goal_id'];
        } elseif (!empty($data['related_id']) && is_numeric($data['related_id'])) {
            $goalId = (int)$data['related_id'];
        }

        $recipientRole = $data['recipient_role'] ?? 'Associate';
        if (strcasecmp($recipientRole, 'employee') === 0) {
            $recipientRole = 'Associate';
        } elseif (strcasecmp($recipientRole, 'manager') === 0) {
            $recipientRole = 'Supervisor';
        }

        $record = [
            'id'             => $data['id'] ?? ('notif-' . bin2hex(random_bytes(4))),
            'recipient_role' => $recipientRole,
            'user_id'        => !empty($data['user_id']) ? trim($data['user_id']) : null,
            'type'           => trim($data['type'] ?? 'alert'), // goal_created, goal_revised, goal_approved
            'title'          => trim($data['title'] ?? 'Notification'),
            'message'        => trim($data['message'] ?? ''),
            'related_id'     => !empty($data['related_id']) ? (string)$data['related_id'] : ($goalId ? (string)$goalId : null),
            'goal_id'        => $goalId,
            'is_read'        => false,
            'created_at'     => date('c'),
            'updated_at'     => date('c')
        ];

        // 1. Attempt Supabase REST insert via BaseModel create()
        return $this->create($record);
    }

    /**
     * Mark single notification as read
     */
    public function markAsRead(string $id): ?array
    {
        return $this->update($id, ['is_read' => true, 'updated_at' => date('c')]);
    }

    /**
     * Mark all notifications as read strictly for a given role and optional user_id
     */
    public function markAllAsRead(string $role, ?string $userId = null): int
    {
        $all = $this->all();
        $targetRole = strtolower(trim($role));
        $targetUser = $userId ? strtolower(trim($userId)) : null;
        $count = 0;

        foreach ($all as $item) {
            $itemRole = strtolower(trim($item['recipient_role'] ?? ''));
            $itemUser = strtolower(trim($item['user_id'] ?? ''));

            if (!empty($itemUser)) {
                if (!$targetUser || $itemUser !== $targetUser) {
                    continue;
                }
            } elseif ($targetRole !== 'all') {
                $isMatch = ($itemRole === $targetRole || $itemRole === 'all');
                if (!$isMatch) {
                    if (($targetRole === 'associate' || $targetRole === 'employee') && ($itemRole === 'associate' || $itemRole === 'employee')) {
                        $isMatch = true;
                    } elseif (($targetRole === 'supervisor' || $targetRole === 'manager') && ($itemRole === 'supervisor' || $itemRole === 'manager')) {
                        $isMatch = true;
                    }
                }
                if (!$isMatch) continue;
            }

            if (empty($item['is_read']) && !empty($item['id'])) {
                $this->update($item['id'], ['is_read' => true, 'updated_at' => date('c')]);
                $count++;
            }
        }

        return $count;
    }
}
