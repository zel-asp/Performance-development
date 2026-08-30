<?php

require_once __DIR__ . '/../models/AuthModel.php';

class AuthController
{
    private AuthModel $authModel;

    public function __construct()
    {
        $this->authModel = new AuthModel();
    }

    private function startSession(): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            @session_start();
        }
    }

    private function safeRegenerateSession(): void
    {
        $this->startSession();
        if (session_status() === PHP_SESSION_ACTIVE) {
            @session_regenerate_id(true);
        }
    }

    /**
     * 1. Initial Role-Based Gateway Login (checks role_based_accounts table)
     * Returns the verified role and employees for the directory modal
     */
    public function roleLogin(array $payload): array
    {
        $email = trim($payload['email'] ?? $payload['identifier'] ?? '');
        $password = trim($payload['password'] ?? '');

        if (empty($email) || empty($password)) {
            return [
                'success' => false,
                'message' => 'Please enter both your role email and password.'
            ];
        }

        $verify = $this->authModel->verifyRoleBasedAccount($email, $password);
        if (!$verify['success']) {
            return $verify;
        }

        $role = $verify['role'];
        $employees = $this->authModel->getEmployeesForRole($role);

        $this->startSession();
        $_SESSION['authenticated_gateway_role'] = $role;

        return [
            'success'   => true,
            'role'      => $role,
            'employees' => $employees,
            'count'     => count($employees),
            'message'   => "Signed into {$role} gateway. Please select your employee profile."
        ];
    }

    /**
     * 2. Get Employees for a specific role
     */
    public function getRoleEmployees(array $payload = []): array
    {
        $role = $payload['role'] ?? $_SESSION['authenticated_gateway_role'] ?? 'Employee';
        $employees = $this->authModel->getEmployeesForRole($role);

        return [
            'success'   => true,
            'role'      => $role,
            'employees' => $employees,
            'count'     => count($employees)
        ];
    }

    /**
     * 3. Request OTP for selected employee
     */
    public function requestOtp(array $payload): array
    {
        $email = trim($payload['email'] ?? '');
        $fullName = trim($payload['full_name'] ?? $payload['employee_name'] ?? '');
        $userId = $payload['user_id'] ?? $payload['id'] ?? null;

        if (empty($email)) {
            return [
                'success' => false,
                'message' => 'Employee email is missing.'
            ];
        }

        // If name missing, lookup in directory
        if (empty($fullName)) {
            $res = supabaseRequest('employees?email=eq.' . urlencode($email), 'GET', null, true);
            if (!empty($res['data'][0])) {
                $fullName = $res['data'][0]['full_name'];
                $userId = $res['data'][0]['id'];
            } else {
                $fullName = 'Staff Member';
            }
        }

        $otpRes = $this->authModel->createOtp($email, $fullName, $userId);
        if (!$otpRes['success']) {
            return $otpRes;
        }

        return [
            'success'          => true,
            'step'             => 'OTP_REQUIRED',
            'email'            => $email,
            'remaining_sends'  => $otpRes['remaining_sends'] ?? 0,
            'message'          => $otpRes['message'] ?? 'Verification code sent to employee email.',
            'email_sent'       => $otpRes['email_sent'] ?? true
        ];
    }

    /**
     * 4. Verify OTP
     * If user already has an account -> directly log in, record session in sessions with is_active = true!
     * If first-time user -> require password setup.
     */
    public function verifyOtp(array $payload): array
    {
        $email = trim($payload['email'] ?? '');
        $otp = trim($payload['otp'] ?? $payload['code'] ?? '');
        $rememberMe = !empty($payload['remember_me']) && ($payload['remember_me'] === true || $payload['remember_me'] === 'true' || $payload['remember_me'] === '1');

        if (empty($email) || empty($otp)) {
            return [
                'success' => false,
                'message' => 'Please provide both email and 6-digit verification code.'
            ];
        }

        $verRes = $this->authModel->verifyOtp($email, $otp);
        if (!$verRes['success']) {
            return $verRes;
        }

        // Check if user already has an account in users table
        if (!empty($verRes['has_account'])) {
            // Already has account -> DIRECT LOGIN!
            $loginRes = $this->authModel->directOtpLogin($email, $rememberMe);
            if (!$loginRes['success']) {
                return $loginRes;
            }

            $user = $loginRes['user'];
            $role = $loginRes['role'];

            $this->safeRegenerateSession();
            $_SESSION['user_id']            = $user['id'];
            $_SESSION['employee_id']        = $user['id'];
            $_SESSION['email']              = $user['email'];
            $_SESSION['full_name']          = $user['full_name'];
            $_SESSION['role']               = $role;
            $_SESSION['authenticated_user'] = $user;

            return [
                'success'       => true,
                'logged_in'     => true,
                'role'          => $role,
                'user'          => $user,
                'session_token' => $loginRes['session_token'],
                'redirect'      => 'index.php',
                'message'       => "Welcome back, {$user['full_name']}!"
            ];
        }

        // First-Time Setup Required
        $this->startSession();
        $setupToken = bin2hex(random_bytes(16));
        $_SESSION['setup_verified_email'] = $email;
        $_SESSION['setup_token'] = $setupToken;
        $_SESSION['setup_remember_me'] = $rememberMe;

        return [
            'success'     => true,
            'logged_in'   => false,
            'step'        => 'PASSWORD_SETUP_REQUIRED',
            'setup_token' => $setupToken,
            'email'       => $email,
            'message'     => 'Verification code confirmed. Please create your secure password.'
        ];
    }

    /**
     * 5. Create Password for First-Time User
     * Saves to users table, records in sessions with is_active = true, logs in.
     */
    public function createPassword(array $payload): array
    {
        $this->startSession();

        $setupToken = $payload['setup_token'] ?? '';
        $password = $payload['password'] ?? '';
        $confirmPassword = $payload['confirm_password'] ?? '';
        $email = $_SESSION['setup_verified_email'] ?? ($payload['email'] ?? null);
        $rememberMe = isset($_SESSION['setup_remember_me']) ? $_SESSION['setup_remember_me'] : (!empty($payload['remember_me']));

        if (empty($email) || empty($_SESSION['setup_token']) || $_SESSION['setup_token'] !== $setupToken) {
            return [
                'success' => false,
                'message' => 'Session expired or unauthorized. Please verify with OTP again.'
            ];
        }

        if (strlen($password) < 6) {
            return [
                'success' => false,
                'message' => 'Password must be at least 6 characters long.'
            ];
        }

        if ($password !== $confirmPassword) {
            return [
                'success' => false,
                'message' => 'Passwords do not match.'
            ];
        }

        $createRes = $this->authModel->createPasswordForEmployee($email, $password, (bool)$rememberMe);
        if (!$createRes['success']) {
            return $createRes;
        }

        $user = $createRes['user'];
        $role = $createRes['role'];

        unset($_SESSION['setup_verified_email'], $_SESSION['setup_token'], $_SESSION['setup_remember_me']);

        $this->safeRegenerateSession();
        $_SESSION['user_id']            = $user['id'];
        $_SESSION['employee_id']        = $user['id'];
        $_SESSION['email']              = $user['email'];
        $_SESSION['full_name']          = $user['full_name'];
        $_SESSION['role']               = $role;
        $_SESSION['authenticated_user'] = $user;

        return [
            'success'       => true,
            'logged_in'     => true,
            'role'          => $role,
            'user'          => $user,
            'session_token' => $createRes['session_token'],
            'redirect'      => 'index.php',
            'message'       => $createRes['message']
        ];
    }

    /**
     * 6. Direct Password Login for Remembered Employee
     */
    public function loginEmployeePassword(array $payload): array
    {
        $email = trim($payload['email'] ?? '');
        $password = trim($payload['password'] ?? '');
        $rememberMe = !empty($payload['remember_me']) && ($payload['remember_me'] === true || $payload['remember_me'] === 'true' || $payload['remember_me'] === '1');

        if (empty($email) || empty($password)) {
            return [
                'success' => false,
                'message' => 'Please enter your password.'
            ];
        }

        $verifyRes = $this->authModel->verifyEmployeePassword($email, $password, $rememberMe);
        if (!$verifyRes['success']) {
            return $verifyRes;
        }

        $user = $verifyRes['user'];
        $role = $verifyRes['role'];

        $this->safeRegenerateSession();
        $_SESSION['user_id']            = $user['id'];
        $_SESSION['employee_id']        = $user['id'];
        $_SESSION['email']              = $user['email'];
        $_SESSION['full_name']          = $user['full_name'];
        $_SESSION['role']               = $role;
        $_SESSION['authenticated_user'] = $user;

        return [
            'success'       => true,
            'logged_in'     => true,
            'role'          => $role,
            'user'          => $user,
            'session_token' => $verifyRes['session_token'],
            'redirect'      => 'index.php',
            'message'       => $verifyRes['message']
        ];
    }

    /**
     * 7. Current User Profile
     */
    public function getCurrentUser(): array
    {
        $this->startSession();
        $user = $_SESSION['authenticated_user'] ?? null;

        if (!$user) {
            return [
                'success' => false,
                'message' => 'No active authenticated session.'
            ];
        }

        return [
            'success' => true,
            'data'    => $user,
            'role'    => $_SESSION['role'] ?? 'Employee'
        ];
    }

    /**
     * 8. Logout (sets is_active = false in sessions table)
     */
    public function logout(): array
    {
        $this->startSession();
        $email = $_SESSION['email'] ?? null;

        $this->authModel->invalidateSession($email);

        $_SESSION = [];
        if (!headers_sent() && ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params["path"],
                $params["domain"],
                $params["secure"],
                $params["httponly"]
            );
        }
        if (session_status() === PHP_SESSION_ACTIVE) {
            @session_destroy();
        }

        return [
            'success'  => true,
            'message'  => 'Signed out successfully.',
            'redirect' => 'login.php'
        ];
    }

}
