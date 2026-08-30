<?php

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../controllers/AIController.php';

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

    $controller = new AIController();
    $response = null;

    switch ($action) {
        // Conversational AI Coach Chatbot
        case 'chat':
            $response = $controller->chat($payload);
            break;

        // Refine rough observation into structured 3-part SBI format
        case 'refine_sbi':
        case 'refine_feedback':
            $response = $controller->refineSBI($payload);
            break;

        // Passive department workplace sentiment diagnostics
        case 'department_sentiment':
        case 'sentiment_pulse':
            $response = $controller->getDepartmentSentiment($payload);
            break;

        // HR Compliance audit trail
        case 'audit_logs':
        case 'ai_logs':
            $response = $controller->getAuditLogs($payload);
            break;

        default:
            http_response_code(400);
            $response = [
                'success' => false,
                'message' => "Invalid or unspecified AI action '{$action}'."
            ];
            break;
    }

} catch (\Throwable $e) {
    http_response_code(500);
    $response = [
        'success' => false,
        'message' => 'Server error in AI processing pipeline: ' . $e->getMessage()
    ];
}

echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
exit;
