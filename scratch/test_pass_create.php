<?php

require_once __DIR__ . '/../controllers/AuthController.php';

$auth = new AuthController();

echo "=== Testing create password for Maria Santos ===\n";
$authModel = new AuthModel();
$res = $authModel->createPasswordForEmployee('maria.santos@oxfordsuitesmakati.com', 'Oxford@2026!', true);
echo "Create password result: " . ($res['success'] ? 'SUCCESS' : 'FAILED') . "\n";

echo "=== Testing loginEmployeePassword with Oxford@2026! ===\n";
$passRes = $auth->loginEmployeePassword([
    'email' => 'maria.santos@oxfordsuitesmakati.com',
    'password' => 'Oxford@2026!',
    'remember_me' => true
]);
echo "Password Login result: " . ($passRes['success'] ? 'SUCCESS' : 'FAILED') . "\n";
echo "Message: " . ($passRes['message'] ?? '') . "\n";
echo "Session Token: " . ($passRes['session_token'] ?? '') . "\n";
