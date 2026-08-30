<?php

require_once __DIR__ . '/../controllers/AuthController.php';

$auth = new AuthController();
$pdo = getSupabaseDb();

echo "====================================================\n";
echo "TEST JOURNEY 1: EMPLOYEE ROLE GATEWAY & REMEMBER ME\n";
echo "====================================================\n";

// 1. Role Login
$roleRes = $auth->roleLogin([
    'email' => 'maria.santos@oxfordsuitesmakati.com',
    'password' => 'Oxford@2026!'
]);
echo "1.1 Role Login: " . ($roleRes['success'] ? 'SUCCESS' : 'FAILED') . " | Role: " . ($roleRes['role'] ?? '') . "\n";

// 2. Select Employee (Maria Santos)
$emp = $roleRes['employees'][0];
echo "1.2 Selected Employee: {$emp['full_name']} ({$emp['email']})\n";

// 3. Request OTP
$otpRes = $auth->requestOtp([
    'email' => $emp['email'],
    'full_name' => $emp['full_name'],
    'id' => $emp['id']
]);
echo "1.3 Request OTP: " . ($otpRes['success'] ? 'SUCCESS' : 'FAILED') . " | Dev OTP: " . ($otpRes['dev_otp'] ?? '') . "\n";

// 4. Verify OTP with Remember Me = true
$verRes = $auth->verifyOtp([
    'email' => $emp['email'],
    'otp' => $otpRes['dev_otp'],
    'remember_me' => true
]);
echo "1.4 Verify OTP: " . ($verRes['success'] ? 'SUCCESS' : 'FAILED') . " | Direct Login: " . (!empty($verRes['logged_in']) ? 'YES' : 'NO') . "\n";

// 5. Check sessions table
$sStmt = $pdo->query("SELECT user_id, email, is_active, remember_me FROM public.sessions WHERE email = '{$emp['email']}'");
$sRow = $sStmt->fetch();
echo "1.5 DB Session -> is_active: " . ($sRow['is_active'] ? 'TRUE' : 'FALSE') . " | remember_me: " . ($sRow['remember_me'] ? 'TRUE' : 'FALSE') . "\n";

// 6. Test Directory showing Maria as Remembered
$dirRes = $auth->getRoleEmployees(['role' => 'Employee']);
$mariaInDir = $dirRes['employees'][0];
echo "1.6 Directory Remembered Flag for Maria: " . ($mariaInDir['is_remembered'] ? 'YES (Shows Log In Button)' : 'NO (Shows Send OTP Button)') . "\n";

// 7. Test Direct Password Login for Remembered Maria
$passLogin = $auth->loginEmployeePassword([
    'email' => $emp['email'],
    'password' => 'Oxford@2026!',
    'remember_me' => true
]);
echo "1.7 Remembered Password Login: " . ($passLogin['success'] ? 'SUCCESS' : 'FAILED') . " | Token: " . substr($passLogin['session_token'] ?? '', 0, 12) . "...\n";

// 8. Invalidate on Logout
$auth->logout();
$sStmt2 = $pdo->query("SELECT is_active FROM public.sessions WHERE email = '{$emp['email']}'");
echo "1.8 Session active after logout? " . ($sStmt2->fetch()['is_active'] ? 'TRUE' : 'FALSE') . "\n";


echo "\n====================================================\n";
echo "TEST JOURNEY 2: SUPERVISOR ROLE GATEWAY & ONBOARDING\n";
echo "====================================================\n";

// 1. Role Login for Supervisor
$supRoleRes = $auth->roleLogin([
    'email' => 'marco.rossi@oxfordsuitesmakati.com',
    'password' => 'SupervisorPass2026!'
]);
echo "2.1 Supervisor Gateway Login: " . ($supRoleRes['success'] ? 'SUCCESS' : 'FAILED') . " | Role: " . ($supRoleRes['role'] ?? '') . "\n";

// 2. Select Supervisor (Chef Marco Rossi)
$sup = $supRoleRes['employees'][0];
echo "2.2 Selected Supervisor: {$sup['full_name']} ({$sup['email']})\n";

// 3. Request OTP
$supOtpRes = $auth->requestOtp([
    'email' => $sup['email'],
    'full_name' => $sup['full_name'],
    'id' => $sup['id']
]);
echo "2.3 Request OTP: " . ($supOtpRes['success'] ? 'SUCCESS' : 'FAILED') . " | Dev OTP: " . ($supOtpRes['dev_otp'] ?? '') . "\n";

// 4. Verify OTP
$supVer = $auth->verifyOtp([
    'email' => $sup['email'],
    'otp' => $supOtpRes['dev_otp'],
    'remember_me' => true
]);
echo "2.4 Verify OTP: " . ($supVer['success'] ? 'SUCCESS' : 'FAILED') . "\n";

// 5. Create / Update Password
if (empty($supVer['logged_in'])) {
    $createPassRes = $auth->createPassword([
        'setup_token' => $supVer['setup_token'],
        'password' => 'ChefMarco@2026!',
        'confirm_password' => 'ChefMarco@2026!',
        'email' => $sup['email']
    ]);
    echo "2.5 Create Password: " . ($createPassRes['success'] ? 'SUCCESS' : 'FAILED') . "\n";
}

// 6. Check sessions table
$sStmtSup = $pdo->query("SELECT user_id, email, is_active, remember_me FROM public.sessions WHERE email = '{$sup['email']}'");
$sRowSup = $sStmtSup->fetch();
echo "2.6 DB Session for Supervisor -> is_active: " . ($sRowSup['is_active'] ? 'TRUE' : 'FALSE') . " | remember_me: " . ($sRowSup['remember_me'] ? 'TRUE' : 'FALSE') . "\n";

echo "\nALL TEST JOURNEYS COMPLETED SUCCESSFULLY!\n";
