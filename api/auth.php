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
        // 1. Initial Role-Based Account Login (checks role_based_accounts)
        case 'role_login':
        case 'login':
            $response = $authController->roleLogin($payload);
            break;

        // 2. Fetch Employees for a Role (for the directory selection modal)
        case 'get_role_employees':
        case 'get_employees':
        case 'employees':
            $response = $authController->getRoleEmployees($payload);
            break;

        // 3. Request OTP for clicked employee
        case 'request_otp':
        case 'send_otp':
            $response = $authController->requestOtp($payload);
            break;

        // 4. Verify OTP (and auto-login if account exists + remember me)
        case 'verify_otp':
        case 'confirm_otp':
            $response = $authController->verifyOtp($payload);
            break;

        // 5. Create Password for First-Time User (inserts to users & sessions)
        case 'create_password':
        case 'set_password':
            $response = $authController->createPassword($payload);
            break;

        // 6. Direct Password Login for Remembered Staff
        case 'login_employee_password':
        case 'employee_login':
            $response = $authController->loginEmployeePassword($payload);
            break;

        // 7. Current Authenticated User Profile
        case 'current_user':
        case 'me':
            $response = $authController->getCurrentUser();
            break;

        // 8. Logout (sets is_active = false in sessions table)
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
