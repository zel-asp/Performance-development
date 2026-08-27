<?php

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../controllers/CompetencyController.php';

// Parse incoming request
$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

// Parse JSON body or form data
$rawBody = file_get_contents('php://input');
$jsonBody = !empty($rawBody) ? json_decode($rawBody, true) : [];
$payload = array_merge($_GET, $_POST, is_array($jsonBody) ? $jsonBody : []);

if (empty($action) && isset($payload['action'])) {
    $action = $payload['action'];
}

$controller = new CompetencyController();

try {
    switch ($action) {
        // 1. Get List of Departments
        case 'get_departments':
            $response = $controller->getDepartments();
            break;

        // 2. Get List of Competencies (General + Specific)
        case 'get_competencies':
            $response = $controller->getCompetencies($payload);
            break;

        // 3. Create / Add New Competency into Database
        case 'create_competency':
        case 'add_competency':
            $response = $controller->createCompetency($payload);
            break;

        // 4. Get Assessment Records
        case 'get_assessments':
            $response = $controller->getAssessments($payload);
            break;

        // 5. Save Single / Batch Competency Evaluation into Database
        case 'save_assessment':
        case 'save_evaluations':
        case 'submit_assessment':
            $response = $controller->saveAssessments($payload);
            break;

        // 6. Get Dynamic Competency Matrix Data (Filtered by Department)
        case 'get_matrix':
        case 'get_matrix_data':
            $response = $controller->getMatrixData($payload);
            break;

        // 7. Get Employees directly from public.employees table
        case 'get_employees':
        case 'list_employees':
            $response = $controller->getEmployees($payload);
            break;

        default:
            $response = [
                'success' => false,
                'message' => "Unknown or unsupported action: '{$action}'"
            ];
            break;
    }
} catch (Throwable $e) {
    $response = [
        'success' => false,
        'message' => 'API Execution Exception: ' . $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ];
}

echo json_encode($response);
exit;
