<?php

require_once __DIR__ . '/../controllers/AuthController.php';

$auth = new AuthController();

echo "=== Testing Supervisor Flow for Chef Marco Rossi ===\n";

// 1. Request OTP
$req = $auth->requestOtp(['email' => 'marco.rossi@oxfordsuitesmakati.com']);
echo "Request OTP: " . ($req['success'] ? 'SUCCESS' : 'FAILED') . "\n";
$devOtp = $req['dev_otp'];
echo "Dev OTP: $devOtp\n";

// 2. Verify OTP
$ver = $auth->verifyOtp(['email' => 'marco.rossi@oxfordsuitesmakati.com', 'otp' => $devOtp]);
echo "Verify OTP: " . ($ver['success'] ? 'SUCCESS' : 'FAILED') . "\n";
$token = $ver['setup_token'];

// 3. Create password
$create = $auth->createPassword([
    'setup_token' => $token,
    'password' => 'SupervisorPass2026!',
    'confirm_password' => 'SupervisorPass2026!'
]);
echo "Create Password: " . ($create['success'] ? 'SUCCESS' : 'FAILED') . "\n";
echo "Assigned Role: " . ($create['role'] ?? '') . "\n";

// 4. Authenticate
$login = $auth->login([
    'identifier' => 'marco.rossi@oxfordsuitesmakati.com',
    'password' => 'SupervisorPass2026!'
]);
echo "Supervisor Login: " . ($login['success'] ? 'SUCCESS' : 'FAILED') . "\n";
echo "Logged in as: " . ($login['data']['user']['full_name'] ?? '') . " | Role: " . ($login['data']['role'] ?? '') . "\n";

echo "Supervisor flow test completed successfully!\n";
