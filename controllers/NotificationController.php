<?php

require_once __DIR__ . '/../models/NotificationModel.php';

class NotificationController
{
    private NotificationModel $model;

    public function __construct()
    {
        $this->model = new NotificationModel();
    }

    /**
     * Get list of notifications for a role / user
     */
    public function getNotifications(array $payload): array
    {
        $role = $payload['role'] ?? 'all';
        $userId = $payload['user_id'] ?? null;

        $items = $this->model->getNotifications([
            'role'    => $role,
            'user_id' => $userId
        ]);

        $unreadCount = 0;
        foreach ($items as $n) {
            if (empty($n['is_read'])) {
                $unreadCount++;
            }
        }

        return [
            'success'     => true,
            'data'        => $items,
            'unreadCount' => $unreadCount,
            'count'       => count($items),
            'message'     => 'Notifications retrieved successfully.'
        ];
    }

    /**
     * Create notification
     */
    public function create(array $payload): array
    {
        $created = $this->model->createNotification($payload);
        return [
            'success' => true,
            'data'    => $created,
            'message' => 'Notification created successfully.'
        ];
    }

    /**
     * Mark single notification as read
     */
    public function markAsRead(array $payload): array
    {
        $id = $payload['id'] ?? '';
        if (empty($id)) {
            return ['success' => false, 'message' => 'Notification ID required'];
        }

        $updated = $this->model->markAsRead((string)$id);
        return [
            'success' => true,
            'data'    => $updated,
            'message' => 'Notification marked as read.'
        ];
    }

    /**
     * Mark all as read
     */
    public function markAllAsRead(array $payload): array
    {
        $role = $payload['role'] ?? 'all';
        $userId = $payload['user_id'] ?? null;
        $count = $this->model->markAllAsRead($role, $userId);
        return [
            'success' => true,
            'count'   => $count,
            'message' => "Marked {$count} notifications as read."
        ];
    }
}
