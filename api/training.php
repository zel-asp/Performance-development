<?php

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../controllers/TrainingController.php';
require_once __DIR__ . '/../controllers/AttendanceController.php';
require_once __DIR__ . '/../controllers/EvaluationController.php';
require_once __DIR__ . '/../controllers/CertificationController.php';

// Parse incoming request
$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

// Parse JSON body or form data
$rawBody = file_get_contents('php://input');
$jsonBody = !empty($rawBody) ? json_decode($rawBody, true) : [];
$payload = array_merge($_GET, $_POST, is_array($jsonBody) ? $jsonBody : []);

// If action is in payload body
if (empty($action) && isset($payload['action'])) {
    $action = $payload['action'];
}

$trainingController = new TrainingController();
$attendanceController = new AttendanceController();
$evaluationController = new EvaluationController();
$certificationController = new CertificationController();

try {
    switch ($action) {
        // Master initial bootstrap
        case 'bootstrap':
            $response = $trainingController->getBootstrapData();
            break;

        // 1. Training Needs
        case 'get_needs':
            $response = $trainingController->getNeeds($payload);
            break;

        case 'create_need':
            $response = $trainingController->createNeed($payload);
            break;

        // 2. Training Programs
        case 'get_programs':
            $response = $trainingController->getPrograms($payload);
            break;

        case 'create_program':
            $response = $trainingController->createProgram($payload);
            break;

        // 3. Training Sessions
        case 'get_sessions':
            $response = $trainingController->getSessions($payload);
            break;

        case 'create_session':
            $response = $trainingController->createSession($payload);
            break;

        // 4. Attendance Check-In Console
        case 'update_attendance':
            $response = $attendanceController->updateAttendance($payload);
            break;

        // 5. Post-Training Evaluation & Auto-Grading
        case 'submit_evaluation':
            $response = $evaluationController->submitEvaluation($payload);
            break;

        // 6. Certificates
        case 'get_certificates':
            $response = $certificationController->getCertificates($payload);
            break;

        // 7. Training Reports & Department Audit
        case 'get_reports':
            $response = $trainingController->getReports($payload);
            break;

        default:
            http_response_code(400);
            $response = [
                'success' => false,
                'message' => "Invalid or unspecified action '{$action}'."
            ];
            break;
    }
} catch (\Throwable $e) {
    http_response_code(500);
    $response = [
        'success' => false,
        'message' => 'Internal server error: ' . $e->getMessage()
    ];
}

echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
exit;
