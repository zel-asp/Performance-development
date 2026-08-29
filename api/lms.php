<?php

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../controllers/LmsController.php';

$action = $_GET['action'] ?? '';
$rawBody = file_get_contents('php://input');
$jsonBody = !empty($rawBody) ? json_decode($rawBody, true) : [];
$payload = array_merge($_GET, $_POST, is_array($jsonBody) ? $jsonBody : []);

if (empty($action) && isset($payload['action'])) {
    $action = $payload['action'];
}

$controller = new LmsController();

try {
    switch ($action) {
        // 1. Get Documents list from Supabase
        case 'get_documents':
        case 'list_documents':
        case 'get_books':
            $response = $controller->getDocuments($payload);
            break;

        // 2. Direct Storage Publish (metadata after direct browser-to-Supabase upload)
        case 'publish_document':
        case 'create_document_record':
            $response = $controller->publishDocumentRecord($payload);
            break;

        // 2b. Multipart Upload Fallback (via PHP server)
        case 'upload_document':
        case 'upload_book':
            $file = $_FILES['document'] ?? $_FILES['file'] ?? (!empty($_FILES) ? reset($_FILES) : null);
            $response = $controller->uploadDocument($file, $payload);
            break;



        // 3. Prescribe LMS Document to Employee (Insert into lms_prescribed)
        case 'prescribe_document':
        case 'prescribe_lms':
        case 'enroll_lms':
            $response = $controller->prescribeDocument($payload);
            break;

        // 4. Get Prescribed LMS Documents for Employee
        case 'get_prescribed_documents':
        case 'get_prescribed':
        case 'list_prescribed':
            $response = $controller->getPrescribedDocuments($payload);
            break;

        // 4b. Update Prescription Status / Progress in lms_prescribed
        case 'update_prescription':
        case 'update_prescribed':
            $response = $controller->updatePrescriptionStatus($payload);
            break;

        // 4c. Get Needs Analysis (TNA) Top 4 Category Cards
        case 'get_needs_analysis':
        case 'get_tna_categories':
        case 'get_tna_cards':
            $response = $controller->getNeedsAnalysisData();
            break;

        // 5. Delete Document from Supabase SQL & Storage
        case 'delete_document':
        case 'remove_document':
            $id = $payload['id'] ?? $payload['document_id'] ?? '';
            $response = $controller->deleteDocument($id);
            break;

        default:
            $response = [
                'success' => false,
                'message' => "Unknown or unsupported LMS action: '{$action}'"
            ];
            break;
    }
} catch (Throwable $e) {
    $response = [
        'success' => false,
        'message' => 'LMS API Execution Exception: ' . $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ];
}

echo json_encode($response);
exit;
