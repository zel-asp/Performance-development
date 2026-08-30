<?php

require_once __DIR__ . '/../controllers/AuthController.php';

$auth = new AuthController();

echo "=== 1. Testing Role-Based Initial Sign-In ===\n";
// Let's test roleLogin with employee role credentials in role_based_accounts
$roleRes = $auth->roleLogin([
    'email' => 'maria.santos@oxfordsuitesmakati.com',
    'password' => 'Oxford@2026!'
]);
echo "Role login result: " . ($roleRes['success'] ? 'SUCCESS' : 'FAILED') . "\n";
echo "Identified Role: " . ($roleRes['role'] ?? '') . "\n";
echo "Total employees in this role: " . ($roleRes['count'] ?? 0) . "\n";
foreach ($roleRes['employees'] ?? [] as $emp) {
    echo "- [{$emp['id']}] {$emp['full_name']} ({$emp['email']}) | Remembered: " . ($emp['is_remembered'] ? 'YES' : 'NO') . " | Has Account: " . ($emp['has_account'] ? 'YES' : 'NO') . "\n";
}

echo "\n=== 2. Testing Request OTP for Employee ===\n";
$targetEmp = $roleRes['employees'][0];
$otpRes = $auth->requestOtp([
    'email' => $targetEmp['email'],
    'full_name' => $targetEmp['full_name'],
    'user_id' => $targetEmp['id']
]);
echo "Request OTP status: " . ($otpRes['success'] ? 'SUCCESS' : 'FAILED') . "\n";
$devOtp = $otpRes['dev_otp'];
echo "Dev OTP: $devOtp\n";

echo "\n=== 3. Testing Verify OTP with Remember Me ===\n";
$verRes = $auth->verifyOtp([
    'email' => $targetEmp['email'],
    'otp' => $devOtp,
    'remember_me' => true
]);
echo "Verify OTP status: " . ($verRes['success'] ? 'SUCCESS' : 'FAILED') . "\n";
echo "Logged in directly? " . (!empty($verRes['logged_in']) ? 'YES' : 'NO') . "\n";
if (!empty($verRes['logged_in'])) {
    echo "Session Token: " . ($verRes['session_token'] ?? '') . "\n";
}

echo "\n=== 4. Check sessions table in database ===\n";
$pdo = getSupabaseDb();
$stmt = $pdo->query("SELECT id, user_id, email, is_active, remember_me FROM public.sessions WHERE email = '{$targetEmp['email']}'");
$sessionRow = $stmt->fetch();
print_r($sessionRow);

echo "\n=== 5. Testing Directory after Remember Me ===\n";
$empListAfter = $auth->getRoleEmployees(['role' => 'Employee']);
foreach ($empListAfter['employees'] ?? [] as $emp) {
    echo "- [{$emp['id']}] {$emp['full_name']} | Remembered: " . ($emp['is_remembered'] ? 'YES' : 'NO') . "\n";
}

echo "\n=== 6. Testing Direct Password Login for Remembered Staff ===\n";
$passLogin = $auth->loginEmployeePassword([
    'email' => $targetEmp['email'],
    'password' => 'Oxford@2026!',
    'remember_me' => true
]);
echo "Password Login: " . ($passLogin['success'] ? 'SUCCESS' : 'FAILED') . "\n";
echo "Welcome Message: " . ($passLogin['message'] ?? '') . "\n";

echo "\n=== 7. Testing Logout (Setting is_active = false in sessions) ===\n";
$logoutRes = $auth->logout();
echo "Logout status: " . ($logoutRes['success'] ? 'SUCCESS' : 'FAILED') . "\n";

$stmt2 = $pdo->query("SELECT id, email, is_active FROM public.sessions WHERE email = '{$targetEmp['email']}'");
$sessionRowAfterLogout = $stmt2->fetch();
echo "Session active after logout? " . ($sessionRowAfterLogout['is_active'] ? 'YES' : 'NO') . "\n";

echo "\n=== Test finished successfully! ===\n";
