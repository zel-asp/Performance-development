<?php

require_once __DIR__ . '/../controllers/AuthController.php';

$auth = new AuthController();

echo "=== 1. Testing getEmployees ===\n";
$empRes = $auth->getEmployees();
echo "Total employees: " . ($empRes['count'] ?? 0) . "\n";
foreach ($empRes['employees'] as $emp) {
    echo "- {$emp['full_name']} ({$emp['email']}) | Role: {$emp['role']} | Registered: " . ($emp['is_registered'] ? 'YES' : 'NO') . "\n";
}

echo "\n=== 2. Testing requestOtp for Maria Santos ===\n";
$otpReq = $auth->requestOtp(['email' => 'maria.santos@oxfordsuitesmakati.com']);
echo "Request OTP status: " . ($otpReq['success'] ? 'SUCCESS' : 'FAILED') . "\n";
echo "Message: " . ($otpReq['message'] ?? '') . "\n";
echo "Dev OTP: " . ($otpReq['dev_otp'] ?? 'NONE') . "\n";

$devOtp = $otpReq['dev_otp'] ?? '';

echo "\n=== 3. Testing verifyOtp (Bad OTP) ===\n";
$badOtpRes = $auth->verifyOtp(['email' => 'maria.santos@oxfordsuitesmakati.com', 'otp' => '000000']);
echo "Bad OTP status (should fail): " . ($badOtpRes['success'] ? 'SUCCESS' : 'FAILED') . " - Message: " . ($badOtpRes['message'] ?? '') . "\n";

echo "\n=== 4. Testing verifyOtp (Valid OTP) ===\n";
$validOtpRes = $auth->verifyOtp(['email' => 'maria.santos@oxfordsuitesmakati.com', 'otp' => $devOtp]);
echo "Valid OTP status: " . ($validOtpRes['success'] ? 'SUCCESS' : 'FAILED') . "\n";
$setupToken = $validOtpRes['setup_token'] ?? '';
echo "Setup Token: {$setupToken}\n";

echo "\n=== 5. Testing createPassword (Password mismatch) ===\n";
$mismatchRes = $auth->createPassword([
    'setup_token' => $setupToken,
    'password' => 'SecurePass123!',
    'confirm_password' => 'WrongPass123!'
]);
echo "Mismatch status (should fail): " . ($mismatchRes['success'] ? 'SUCCESS' : 'FAILED') . " - Message: " . ($mismatchRes['message'] ?? '') . "\n";

echo "\n=== 6. Testing createPassword (Valid) ===\n";
$createPassRes = $auth->createPassword([
    'setup_token' => $setupToken,
    'password' => 'Oxford@2026!',
    'confirm_password' => 'Oxford@2026!'
]);
echo "Create password status: " . ($createPassRes['success'] ? 'SUCCESS' : 'FAILED') . "\n";
echo "Assigned Role: " . ($createPassRes['role'] ?? '') . "\n";
echo "Message: " . ($createPassRes['message'] ?? '') . "\n";

echo "\n=== 7. Testing login with newly created password ===\n";
$loginRes = $auth->login([
    'identifier' => 'maria.santos@oxfordsuitesmakati.com',
    'password' => 'Oxford@2026!'
]);
echo "Login status: " . ($loginRes['success'] ? 'SUCCESS' : 'FAILED') . "\n";
echo "User: " . ($loginRes['data']['user']['full_name'] ?? '') . "\n";
echo "Role: " . ($loginRes['data']['role'] ?? '') . "\n";

echo "\n=== 8. Testing login with wrong password ===\n";
$wrongLogin = $auth->login([
    'identifier' => 'maria.santos@oxfordsuitesmakati.com',
    'password' => 'InvalidPassword!'
]);
echo "Wrong password status (should fail): " . ($wrongLogin['success'] ? 'SUCCESS' : 'FAILED') . " - Message: " . ($wrongLogin['message'] ?? '') . "\n";

echo "\n=== 9. Testing directory after registration ===\n";
$empRes2 = $auth->getEmployees();
foreach ($empRes2['employees'] as $emp) {
    echo "- {$emp['full_name']} ({$emp['email']}) | Role: {$emp['role']} | Registered: " . ($emp['is_registered'] ? 'YES' : 'NO') . " | Account Role: " . ($emp['account_role'] ?? 'N/A') . "\n";
}

echo "\n=== Auth Flow Test Completed Successfully! ===\n";
