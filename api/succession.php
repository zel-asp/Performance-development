<?php

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../controllers/SuccessionController.php';

$action = $_GET['action'] ?? '';
$rawBody = file_get_contents('php://input');
$jsonBody = !empty($rawBody) ? json_decode($rawBody, true) : [];
$payload = array_merge($_GET, $_POST, is_array($jsonBody) ? $jsonBody : []);

if (empty($action) && isset($payload['action'])) {
    $action = $payload['action'];
}

$controller = new SuccessionController();

try {
    switch ($action) {
        case 'get_overview':
        case 'bootstrap':
            $res = $controller->getSuccessionOverview();
            echo json_encode($res);
            break;

        case 'update_flag':
        case 'calibrate_flag':
            $candidateId = $payload['candidateId'] ?? ($payload['candidate_id'] ?? '');
            $flag = $payload['hrReadinessFlag'] ?? ($payload['hr_readiness_flag'] ?? ($payload['flag'] ?? ''));
            $notes = $payload['notes'] ?? '';
            $res = $controller->updateHRFlag($candidateId, $flag, $notes);
            echo json_encode($res);
            break;

        case 'create_position':
            $res = $controller->createPosition($payload);
            echo json_encode($res);
            break;

        case 'delete_position':
            $positionId = $payload['positionId'] ?? ($payload['id'] ?? '');
            $res = $controller->deletePosition($positionId);
            echo json_encode($res);
            break;

        default:
            echo json_encode([
                'success' => false,
                'message' => 'Invalid or missing action for Succession API',
                'requestedAction' => $action
            ]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Succession API Server Error: ' . $e->getMessage()
    ]);
}
