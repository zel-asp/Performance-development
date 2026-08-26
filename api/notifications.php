<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../controllers/NotificationController.php';

try {
    $action = $_GET['action'] ?? '';
    $method = $_SERVER['REQUEST_METHOD'];

    $rawInput = file_get_contents('php://input');
    $bodyPayload = !empty($rawInput) ? json_decode($rawInput, true) : [];
    if (!is_array($bodyPayload)) {
        $bodyPayload = [];
    }
    $queryParams = $_GET;
    $payload = array_merge($queryParams, $bodyPayload);

    $controller = new NotificationController();
    $response = null;

    switch ($action) {
        case 'get_notifications':
        case 'list':
            $response = $controller->getNotifications($payload);
            break;

        case 'create_notification':
        case 'create':
            $response = $controller->create($payload);
            break;

        case 'mark_read':
        case 'mark_as_read':
            $response = $controller->markAsRead($payload);
            break;

        case 'mark_all_read':
        case 'mark_all_as_read':
            $response = $controller->markAllAsRead($payload);
            break;

        default:
            http_response_code(400);
            $response = [
                'success' => false,
                'data'    => null,
                'message' => "Invalid or unspecified action '{$action}'."
            ];
            break;
    }

    echo json_encode($response, JSON_PRETTY_PRINT);

} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'data'    => null,
        'message' => 'Internal server error: ' . $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
