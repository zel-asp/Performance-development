<?php

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../controllers/CoachingController.php';

try {
    $action = $_GET['action'] ?? '';
    $rawInput = file_get_contents('php://input');
    $bodyPayload = !empty($rawInput) ? json_decode($rawInput, true) : [];
    if (!is_array($bodyPayload)) {
        $bodyPayload = [];
    }
    $payload = array_merge($_GET, $_POST, $bodyPayload);
    if (empty($action) && isset($payload['action'])) {
        $action = $payload['action'];
    }

    $controller = new CoachingController();
    $response = null;

    switch ($action) {
        // Fetch coaching notes
        case 'get_notes':
        case 'list':
            $response = $controller->getNotes($payload);
            break;

        // Save human-approved coaching note
        case 'create_note':
        case 'save':
            $response = $controller->createNote($payload);
            break;

        default:
            // Default to list if GET request
            if ($_SERVER['REQUEST_METHOD'] === 'GET') {
                $response = $controller->getNotes($payload);
            } else {
                http_response_code(400);
                $response = [
                    'success' => false,
                    'message' => "Invalid coaching action '{$action}'."
                ];
            }
            break;
    }

} catch (\Throwable $e) {
    http_response_code(500);
    $response = [
        'success' => false,
        'message' => 'Server error in coaching pipeline: ' . $e->getMessage()
    ];
}

echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
exit;
