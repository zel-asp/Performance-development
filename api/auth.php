<?php

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../controllers/AuthController.php';

$action = $_GET['action'] ?? '';
$rawBody = file_get_contents('php://input');
$jsonBody = !empty($rawBody) ? json_decode($rawBody, true) : [];
$payload = array_merge($_GET, $_POST, is_array($jsonBody) ? $jsonBody : []);

if (empty($action) && isset($payload['action'])) {
    $action = $payload['action'];
}

$authController = new AuthController();

try {
    switch ($action) {
        case 'login':
            $response = $authController->login($payload);
            break;

        case 'fast_login':
            $response = $authController->fastLogin($payload);
            break;

        case 'current_user':
            $response = $authController->getCurrentUser();
            break;

        case 'logout':
            $response = $authController->logout();
            break;

        default:
            http_response_code(400);
            $response = [
                'success' => false,
                'message' => "Invalid auth action '{$action}'."
            ];
            break;
    }
} catch (\Throwable $e) {
    http_response_code(500);
    $response = [
        'success' => false,
        'message' => 'Auth error: ' . $e->getMessage()
    ];
}

echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
exit;
