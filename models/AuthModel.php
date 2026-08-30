<?php

require_once __DIR__ . '/BaseModel.php';
require_once __DIR__ . '/../config/config.php';
if (file_exists(__DIR__ . '/../mailer.php')) {
    require_once __DIR__ . '/../mailer.php';
}

class AuthModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct('users');
    }

    /**
     * Generate standard UUID v4 string
     */
    public function generateUuid(): string
    {
        $data = random_bytes(16);
        $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }

    /**
     * Get client IP address
     */
    public function getClientIp(): string
    {
        $rawIp = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $ips = explode(',', $rawIp);
        $ip = trim($ips[0]);
        if ($ip === '::1' || $ip === '127.0.0.1') {
            return $ip;
        }
        return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : '127.0.0.1';
    }

    /**
     * Get client User Agent
     */
    public function getClientUserAgent(): string
    {
        return substr($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown Agent', 0, 255);
    }

    /**
     * 1. Verify Role-Based Gateway Login (checks role_based_accounts table)
     */
    public function verifyRoleBasedAccount(string $email, string $password): array
    {
        $email = trim($email);
        $password = trim($password);

        if (empty($email) || empty($password)) {
            return [
                'success' => false,
                'message' => 'Please enter both email and password.'
            ];
        }

        // Query role_based_accounts with case-insensitive ilike
        $res = supabaseRequest('role_based_accounts?email=ilike.' . urlencode($email), 'GET', null, true);
        if ($res['status'] !== 200 || empty($res['data'][0])) {
            // Also try fallback eq match
            $res = supabaseRequest('role_based_accounts?email=eq.' . urlencode($email), 'GET', null, true);
        }

        if ($res['status'] !== 200 || empty($res['data'][0])) {
            return [
                'success' => false,
                'message' => "Invalid role account for '{$email}'. Please check your credentials."
            ];
        }

        $account = $res['data'][0];
        if (($account['status'] ?? 'Active') !== 'Active') {
            return [
                'success' => false,
                'message' => 'This role-based account is currently inactive.'
            ];
        }

        $storedHash = $account['password_hash'] ?? '';

        // Verify password against bcrypt hash OR direct plaintext match (e.g. 'emp123', 'sup123')
        $isValid = false;
        if (password_verify($password, $storedHash)) {
            $isValid = true;
        } elseif ($storedHash === $password) {
            $isValid = true;
        }

        if (!$isValid) {
            return [
                'success' => false,
                'message' => 'Incorrect password for role-based access.'
            ];
        }

        $role = $account['role'] ?? 'Employee';

        return [
            'success' => true,
            'role'    => $role,
            'email'   => $account['email'],
            'message' => "Authenticated as {$role}. Please select an employee profile."
        ];
    }


    /**
     * 2. Get Employee Directory filtered by Role with has_account and is_remembered flags
     * An employee is remembered ONLY IF:
     * 1. Account exists in `users` table with password
     * 2. Active remembered record exists in `sessions` table where email, user_agent AND ip_address all match exactly
     */
    public function getEmployeesForRole(string $role): array
    {
        $isSupervisorTarget = (strcasecmp($role, 'Supervisor') === 0 || strcasecmp($role, 'manager') === 0);

        // Fetch active employees
        $empRes = supabaseRequest('employees?select=*&status=eq.Active&order=full_name.asc', 'GET', null, true);
        $allEmployees = ($empRes['status'] === 200 && is_array($empRes['data'])) ? $empRes['data'] : [];

        // Fetch users to know who has custom passwords
        $usrRes = supabaseRequest('users?select=id,email,password_hash,role,status', 'GET', null, true);
        $usersMap = [];
        if ($usrRes['status'] === 200 && is_array($usrRes['data'])) {
            foreach ($usrRes['data'] as $u) {
                if (!empty($u['email']) && !empty($u['password_hash'])) {
                    $usersMap[strtolower(trim($u['email']))] = $u;
                }
            }
        }

        // Fetch remembered sessions strictly matching current client user_agent AND ip_address AND unexpired remember_me
        $currentAgent = $this->getClientUserAgent();
        $currentIp = $this->getClientIp();
        $pdo = getSupabaseDb();
        $sessionsMap = [];

        if ($pdo) {
            try {
                $stmt = $pdo->prepare("
                    SELECT LOWER(TRIM(email)) as email, session_token, remember_me, is_active, expires_at_remember, user_agent, host(ip_address) as ip_str
                    FROM public.sessions
                    WHERE remember_me = true 
                      AND (expires_at_remember IS NULL OR expires_at_remember > NOW())
                      AND user_agent = :user_agent
                      AND (ip_address::text = :client_ip OR host(ip_address) = :client_ip OR ip_address = :client_ip::inet)
                ");
                $stmt->execute([
                    ':user_agent' => $currentAgent,
                    ':client_ip'  => $currentIp
                ]);
                while ($sRow = $stmt->fetch()) {
                    if (!empty($sRow['email'])) {
                        $sessionsMap[$sRow['email']] = $sRow;
                    }
                }
            } catch (\Throwable $e) {
                error_log("Session map fetch error: " . $e->getMessage());
            }
        }

        // Fallback to Supabase REST if PDO did not fetch
        if (empty($sessionsMap)) {
            $sessRes = supabaseRequest('sessions?remember_me=eq.true&user_agent=eq.' . urlencode($currentAgent) . '&ip_address=eq.' . urlencode($currentIp) . '&select=email,remember_me,expires_at_remember,user_agent,ip_address', 'GET', null, true);
            if ($sessRes['status'] === 200 && is_array($sessRes['data'])) {
                foreach ($sessRes['data'] as $sRow) {
                    if (!empty($sRow['email'])) {
                        $expRem = !empty($sRow['expires_at_remember']) ? strtotime($sRow['expires_at_remember']) : null;
                        if ($expRem === null || $expRem > time()) {
                            $sessionsMap[strtolower(trim($sRow['email']))] = $sRow;
                        }
                    }
                }
            }
        }

        $filtered = [];
        foreach ($allEmployees as $emp) {
            $empRole = $emp['role'] ?? 'Associate';
            $empTitle = $emp['title'] ?? '';
            $empIsSupervisor = (
                stripos($empRole, 'Supervisor') !== false ||
                stripos($empRole, 'Manager') !== false ||
                stripos($empRole, 'Director') !== false ||
                stripos($empTitle, 'Supervisor') !== false ||
                stripos($empTitle, 'Manager') !== false ||
                stripos($empTitle, 'Director') !== false
            );

            // Match role
            if ($isSupervisorTarget && !$empIsSupervisor) {
                continue;
            }
            if (!$isSupervisorTarget && $empIsSupervisor) {
                continue;
            }

            $emailLower = strtolower(trim($emp['email'] ?? ''));
            $hasAccount = isset($usersMap[$emailLower]);
            
            // Remembered ONLY IF has account in users table AND matching sessions row (email + user_agent + ip_address)
            $isRemembered = $hasAccount && isset($sessionsMap[$emailLower]);

            $filtered[] = [
                'id'            => $emp['id'],
                'employee_code' => $emp['employee_code'] ?? '',
                'full_name'     => $emp['full_name'],
                'email'         => $emp['email'],
                'role'          => $empRole,
                'title'         => $emp['title'] ?? 'Staff',
                'avatar_url'    => $emp['avatar_url'] ?? '',
                'department_id' => $emp['department_id'] ?? '',
                'has_account'   => $hasAccount,
                'is_remembered' => $isRemembered
            ];
        }

        return $filtered;
    }

    /**
     * 3. Generate and dispatch OTP with 3-request Rate Limiting (15-min window)
     */
    public function createOtp(string $email, string $employeeName, ?string $userId = null): array
    {
        $email = trim($email);
        $windowMinutes = 15;
        $maxRequests = 3;
        $cutoff = date('c', time() - ($windowMinutes * 60));

        // Check recent OTP request count for rate limiting
        $rateRes = supabaseRequest('otp_codes?email=eq.' . urlencode($email) . '&created_at=gte.' . urlencode($cutoff) . '&order=created_at.asc', 'GET', null, true);
        $recentRequests = is_array($rateRes['data'] ?? null) ? $rateRes['data'] : [];
        $recentCount = count($recentRequests);

        if ($recentCount >= $maxRequests) {
            $oldest = $recentRequests[0] ?? null;
            $oldestTime = !empty($oldest['created_at']) ? strtotime($oldest['created_at']) : time();
            $remainingSeconds = max(60, ($oldestTime + ($windowMinutes * 60)) - time());
            $remainingMinutes = ceil($remainingSeconds / 60);

            return [
                'success'          => false,
                'rate_limited'     => true,
                'remaining_sends'  => 0,
                'retry_after_min'  => $remainingMinutes,
                'message'          => "Rate limit reached: Maximum 3 verification codes allowed per {$windowMinutes} minutes. Please try again in {$remainingMinutes} minute(s)."
            ];
        }

        $remainingSends = $maxRequests - ($recentCount + 1);

        $otp = str_pad((string)random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $otpHash = hash('sha256', $otp);
        $expiresAt = date('c', time() + (10 * 60)); // 10 minutes expiry

        // Invalidate previous unused OTPs without deleting them (preserves rate-limit audit records)
        supabaseRequest('otp_codes?email=eq.' . urlencode($email) . '&used_at=is.null', 'PATCH', ['used_at' => date('c')], true);

        // Store new OTP in otp_codes
        $otpPayload = [
            'user_id'       => !empty($userId) && preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $userId) ? $userId : $this->generateUuid(),
            'email'         => $email,
            'employee_name' => $employeeName,
            'code_hash'     => $otpHash,
            'expires_at'    => $expiresAt,
            'attempts'      => 0
        ];

        $insRes = supabaseRequest('otp_codes', 'POST', $otpPayload, true);
        if ($insRes['status'] < 200 || $insRes['status'] >= 300) {
            return [
                'success' => false,
                'message' => 'Failed to initialize verification code in database.'
            ];
        }

        // Email body
        $subject = "Oxford Suites Makati - Portal Verification Code";
        $body = "
        <div style='font-family: Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;'>
            <div style='text-align: center; margin-bottom: 24px;'>
                <h2 style='color: #9E1B20; margin: 0; font-size: 22px; font-weight: 800;'>OXFORD SUITES MAKATI</h2>
                <p style='color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; margin: 4px 0 0;'>Staff Access Portal</p>
            </div>
            <p style='color: #1e293b; font-size: 15px;'>Hello <strong>" . htmlspecialchars($employeeName) . "</strong>,</p>
            <p style='color: #475569; font-size: 14px; line-height: 1.5;'>Please use the following 6-digit verification code to access your portal session:</p>
            <div style='margin: 24px 0; text-align: center;'>
                <span style='display: inline-block; font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #9E1B20; background-color: #fff1f2; padding: 14px 28px; border-radius: 6px; border: 1px dashed #f43f5e;'>
                    {$otp}
                </span>
            </div>
            <p style='color: #64748b; font-size: 13px;'>This code will expire in <strong>10 minutes</strong>.</p>
            <hr style='border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;' />
            <p style='color: #94a3b8; font-size: 11px; text-align: center; margin: 0;'>Internal Use Only &middot; Oxford Suites Makati Hospitality Portal</p>
        </div>";

        $emailSent = false;
        $mailError = '';
        if (function_exists('sendMail')) {
            $mailRes = sendMail($email, $subject, $body);
            $emailSent = !empty($mailRes['success']);
            if (!$emailSent) {
                $mailError = $mailRes['message'] ?? 'SMTP dispatch failed.';
            }
        }

        if (!$emailSent) {
            return [
                'success'    => false,
                'message'    => 'Failed to deliver OTP to employee email: ' . $mailError,
                'email_sent' => false
            ];
        }

        $remainingMsg = $remainingSends > 0
            ? " ({$remainingSends} send" . ($remainingSends > 1 ? "s" : "") . " remaining)"
            : " (Final attempt before cooldown)";

        return [
            'success'          => true,
            'remaining_sends'  => $remainingSends,
            'message'          => "A 6-digit verification code has been sent to {$email}.{$remainingMsg}",
            'email_sent'       => true
        ];
    }

    /**
     * 4. Verify OTP Code
     */
    public function verifyOtp(string $email, string $otp): array
    {
        $email = trim($email);
        $otp = trim($otp);
        $otpHash = hash('sha256', $otp);

        $res = supabaseRequest('otp_codes?email=eq.' . urlencode($email) . '&used_at=is.null&order=created_at.desc&limit=1', 'GET', null, true);
        if ($res['status'] !== 200 || empty($res['data'][0])) {
            return [
                'success' => false,
                'message' => 'No active verification code found for this email. Please request a new code.'
            ];
        }

        $record = $res['data'][0];
        $recordId = $record['id'];
        $expiresAt = strtotime($record['expires_at'] ?? '1970-01-01');

        if ($expiresAt < time()) {
            return [
                'success' => false,
                'message' => 'Verification code has expired. Please request a new one.'
            ];
        }

        $attempts = (int)($record['attempts'] ?? 0);
        if ($attempts >= 5) {
            return [
                'success' => false,
                'message' => 'Too many failed verification attempts. Please request a new code.'
            ];
        }

        if ($record['code_hash'] !== $otpHash) {
            supabaseRequest('otp_codes?id=eq.' . $recordId, 'PATCH', ['attempts' => $attempts + 1], true);
            return [
                'success' => false,
                'message' => 'Incorrect verification code.'
            ];
        }

        // Mark OTP as used
        supabaseRequest('otp_codes?id=eq.' . $recordId, 'PATCH', ['used_at' => date('c')], true);

        // Check if user already has an account in users table
        $usrRes = supabaseRequest('users?email=eq.' . urlencode($email), 'GET', null, true);
        $hasAccount = ($usrRes['status'] === 200 && !empty($usrRes['data'][0]) && !empty($usrRes['data'][0]['password_hash']));
        $user = $hasAccount ? $usrRes['data'][0] : null;

        return [
            'success'     => true,
            'has_account' => $hasAccount,
            'user'        => $user,
            'message'     => 'Verification code confirmed.'
        ];
    }

    /**
     * 5. Record / Upsert active session in sessions table
     */
    public function recordSession(string $userId, string $email, string $employeeName, bool $rememberMe = false): string
    {
        $token = bin2hex(random_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', time() + 86400); // 24 hours standard
        $expiresRemember = $rememberMe ? date('Y-m-d H:i:s', time() + (30 * 86400)) : null; // 30 days if remember me
        $ip = $this->getClientIp();
        $agent = $this->getClientUserAgent();

        $pdo = getSupabaseDb();
        if ($pdo) {
            try {
                $sql = "
                    INSERT INTO public.sessions (user_id, session_token, expires_at, ip_address, user_agent, is_active, email, hr_employee_name, remember_me, expires_at_remember, updated_at)
                    VALUES (:user_id, :token, :expires_at, :ip, :agent, true, :email, :name, :remember, :expires_remember, NOW())
                    ON CONFLICT (email) DO UPDATE SET
                        session_token = EXCLUDED.session_token,
                        expires_at = EXCLUDED.expires_at,
                        is_active = true,
                        remember_me = EXCLUDED.remember_me,
                        expires_at_remember = EXCLUDED.expires_at_remember,
                        ip_address = EXCLUDED.ip_address,
                        user_agent = EXCLUDED.user_agent,
                        updated_at = NOW()
                ";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([
                    ':user_id'          => $userId,
                    ':token'            => $token,
                    ':expires_at'       => $expiresAt,
                    ':ip'               => $ip,
                    ':agent'            => $agent,
                    ':email'            => $email,
                    ':name'             => $employeeName,
                    ':remember'         => $rememberMe ? 'true' : 'false',
                    ':expires_remember' => $expiresRemember
                ]);
            } catch (\Throwable $e) {
                error_log("Failed to record session in DB: " . $e->getMessage());
            }
        }

        return $token;
    }

    /**
     * 6. Create Password for Employee (saves to users table, inserts into sessions, and sets is_active = true)
     */
    public function createPasswordForEmployee(string $email, string $password, bool $rememberMe = false): array
    {
        $email = trim($email);
        if (strlen($password) < 6) {
            return [
                'success' => false,
                'message' => 'Password must be at least 6 characters long.'
            ];
        }

        // Find employee in employees table
        $empRes = supabaseRequest('employees?email=eq.' . urlencode($email), 'GET', null, true);
        if ($empRes['status'] !== 200 || empty($empRes['data'][0])) {
            return [
                'success' => false,
                'message' => 'Employee profile not found.'
            ];
        }
        $employee = $empRes['data'][0];

        $empRole = $employee['role'] ?? 'Associate';
        $empTitle = $employee['title'] ?? '';
        $isSupervisor = (
            stripos($empRole, 'Supervisor') !== false ||
            stripos($empRole, 'Manager') !== false ||
            stripos($empRole, 'Director') !== false ||
            stripos($empTitle, 'Supervisor') !== false ||
            stripos($empTitle, 'Manager') !== false
        );
        $systemRole = $isSupervisor ? 'Supervisor' : 'Employee';
        $passwordHash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

        // 1. Sync & Insert into Supabase Authentication (GoTrue auth.users)
        $authUserData = $this->syncSupabaseAuthUser($email, $password, $employee['full_name'], $systemRole);
        $authUid = $authUserData['id'] ?? null;

        // 2. Insert or update in application users table
        $usrPayload = [
            'id'            => $employee['id'] ?? ($authUid ?: ('emp-' . substr(bin2hex(random_bytes(3)), 0, 6))),
            'employee_code' => $employee['employee_code'] ?? ('OXF-EMP-' . rand(1000, 9999)),
            'full_name'     => $employee['full_name'],
            'email'         => $email,
            'password_hash' => $passwordHash,
            'role'          => $systemRole,
            'role_key'      => $isSupervisor ? 'manager' : 'employee',
            'title'         => $employee['title'] ?? ($isSupervisor ? 'Supervisor' : 'Associate'),
            'department'    => $employee['department_id'] ?? 'General',
            'avatar_url'    => $employee['avatar_url'] ?? '',
            'status'        => 'Active',
            'updated_at'    => date('c')
        ];

        // Check if user already in users table
        $existingUsr = supabaseRequest('users?email=eq.' . urlencode($email), 'GET', null, true);
        if (!empty($existingUsr['data'][0])) {
            supabaseRequest('users?id=eq.' . urlencode($existingUsr['data'][0]['id']), 'PATCH', [
                'password_hash' => $passwordHash,
                'role'          => $systemRole,
                'status'        => 'Active',
                'updated_at'    => date('c')
            ], true);
            $userId = $existingUsr['data'][0]['id'];
        } else {
            $createRes = supabaseRequest('users', 'POST', $usrPayload, true);
            $userId = $createRes['data'][0]['id'] ?? $employee['id'];
        }

        // 3. Record in sessions table with is_active = true
        $sessionToken = $this->recordSession($userId, $email, $employee['full_name'], $rememberMe);

        return [
            'success'       => true,
            'message'       => "Password created successfully. Welcome, {$employee['full_name']}!",
            'role'          => $systemRole,
            'user'          => array_merge($employee, ['role' => $systemRole, 'id' => $userId]),
            'session_token' => $sessionToken,
            'auth_user_id'  => $authUid
        ];
    }

    /**
     * Helper: Sync user with Supabase Authentication (GoTrue auth.users)
     */
    public function syncSupabaseAuthUser(string $email, string $password, string $fullName, string $role): ?array
    {
        if (!function_exists('supabaseAuthRequest')) {
            return null;
        }

        try {
            // Check if user exists in auth.users
            $listRes = supabaseAuthRequest('admin/users', 'GET', null, true);
            $existingAuthUser = null;
            if (!empty($listRes['data']['users']) && is_array($listRes['data']['users'])) {
                foreach ($listRes['data']['users'] as $u) {
                    if (strcasecmp($u['email'] ?? '', $email) === 0) {
                        $existingAuthUser = $u;
                        break;
                    }
                }
            }

            if ($existingAuthUser) {
                // Update password & metadata in Supabase Authentication
                $updateRes = supabaseAuthRequest('admin/users/' . $existingAuthUser['id'], 'PUT', [
                    'password'      => $password,
                    'email_confirm' => true,
                    'user_metadata' => [
                        'full_name' => $fullName,
                        'role'      => $role
                    ]
                ], true);
                return $updateRes['data'] ?? $existingAuthUser;
            } else {
                // Create user in Supabase Authentication
                $createRes = supabaseAuthRequest('admin/users', 'POST', [
                    'email'         => $email,
                    'password'      => $password,
                    'email_confirm' => true,
                    'user_metadata' => [
                        'full_name' => $fullName,
                        'role'      => $role
                    ]
                ], true);
                return $createRes['data'] ?? null;
            }
        } catch (\Throwable $e) {
            error_log("Supabase Auth sync error: " . $e->getMessage());
            return null;
        }
    }

    /**
     * 7. Direct Password Login for Remembered Employee
     */
    public function verifyEmployeePassword(string $email, string $password, bool $rememberMe = true): array
    {
        $email = trim($email);
        $password = trim($password);

        // Find user in users table
        $usrRes = supabaseRequest('users?email=eq.' . urlencode($email), 'GET', null, true);
        if ($usrRes['status'] !== 200 || empty($usrRes['data'][0])) {
            // Check employees table
            $empRes = supabaseRequest('employees?email=eq.' . urlencode($email), 'GET', null, true);
            if (!empty($empRes['data'][0])) {
                return [
                    'success' => false,
                    'needs_setup' => true,
                    'message' => 'No custom password set yet. Please verify with OTP to create your password.'
                ];
            }
            return [
                'success' => false,
                'message' => 'Employee account not found.'
            ];
        }

        $user = $usrRes['data'][0];

        // Verify password
        if (empty($user['password_hash']) || !password_verify($password, $user['password_hash'])) {
            return [
                'success' => false,
                'message' => 'Incorrect personal password.'
            ];
        }

        $role = $user['role'] ?? 'Employee';
        $userId = $user['id'];

        // Record active session
        $sessionToken = $this->recordSession($userId, $email, $user['full_name'], $rememberMe);

        return [
            'success'       => true,
            'message'       => "Welcome back, {$user['full_name']}!",
            'role'          => $role,
            'user'          => $user,
            'session_token' => $sessionToken
        ];
    }

    /**
     * 8. Direct Login via Verified OTP for Existing Users
     */
    public function directOtpLogin(string $email, bool $rememberMe = false): array
    {
        $email = trim($email);

        // Find user or employee
        $usrRes = supabaseRequest('users?email=eq.' . urlencode($email), 'GET', null, true);
        $user = (!empty($usrRes['data'][0])) ? $usrRes['data'][0] : null;

        if (!$user) {
            $empRes = supabaseRequest('employees?email=eq.' . urlencode($email), 'GET', null, true);
            $user = (!empty($empRes['data'][0])) ? $empRes['data'][0] : null;
        }

        if (!$user) {
            return [
                'success' => false,
                'message' => 'Account record not found.'
            ];
        }

        $userId = $user['id'];
        $fullName = $user['full_name'] ?? 'Staff Member';
        $role = $user['role'] ?? 'Employee';

        // Record active session
        $sessionToken = $this->recordSession($userId, $email, $fullName, $rememberMe);

        return [
            'success'       => true,
            'message'       => "Welcome back, {$fullName}!",
            'role'          => $role,
            'user'          => $user,
            'session_token' => $sessionToken
        ];
    }

    /**
     * 9. Invalidate session in sessions table on logout
     */
    public function invalidateSession(?string $email = null): void
    {
        if (empty($email)) {
            $email = $_SESSION['email'] ?? null;
        }

        if ($email) {
            $pdo = getSupabaseDb();
            if ($pdo) {
                try {
                    $stmt = $pdo->prepare("UPDATE public.sessions SET is_active = false, updated_at = NOW() WHERE email = :email");
                    $stmt->execute([':email' => $email]);
                } catch (\Throwable $e) {
                    error_log("Failed to set is_active false in sessions: " . $e->getMessage());
                }
            }
        }
    }

    /**
     * 10. Find user or employee by Employee Code or ID
     */
    public function findByEmployeeCode(string $code): ?array
    {
        $code = trim($code);
        if (empty($code)) {
            return null;
        }

        // 1. Try finding in employees table by employee_code
        $empRes = supabaseRequest('employees?employee_code=eq.' . urlencode($code), 'GET', null, true);
        if ($empRes['status'] === 200 && !empty($empRes['data'][0])) {
            return $this->normalizeRecord($empRes['data'][0]);
        }

        // 2. Try finding in employees table by id
        $empRes = supabaseRequest('employees?id=eq.' . urlencode($code), 'GET', null, true);
        if ($empRes['status'] === 200 && !empty($empRes['data'][0])) {
            return $this->normalizeRecord($empRes['data'][0]);
        }

        // 3. Try finding in users table by employee_code or id
        $usrRes = supabaseRequest('users?employee_code=eq.' . urlencode($code), 'GET', null, true);
        if ($usrRes['status'] === 200 && !empty($usrRes['data'][0])) {
            return $this->normalizeRecord($usrRes['data'][0]);
        }

        $usrRes = supabaseRequest('users?id=eq.' . urlencode($code), 'GET', null, true);
        if ($usrRes['status'] === 200 && !empty($usrRes['data'][0])) {
            return $this->normalizeRecord($usrRes['data'][0]);
        }

        return null;
    }

    /**
     * 11. Override find to check both users and employees table
     */
    public function find(string $id): ?array
    {
        $user = parent::find($id);
        if ($user) {
            return $user;
        }

        // Fallback to employees table
        $empRes = supabaseRequest('employees?id=eq.' . urlencode($id), 'GET', null, true);
        if ($empRes['status'] === 200 && !empty($empRes['data'][0])) {
            return $this->normalizeRecord($empRes['data'][0]);
        }

        return null;
    }

    /**
     * 12. Find user or employee by email address
     */
    public function findByEmail(string $email): ?array
    {
        $email = trim($email);
        if (empty($email)) {
            return null;
        }
        $usrRes = supabaseRequest('users?email=eq.' . urlencode($email), 'GET', null, true);
        if ($usrRes['status'] === 200 && !empty($usrRes['data'][0])) {
            return $this->normalizeRecord($usrRes['data'][0]);
        }
        $empRes = supabaseRequest('employees?email=eq.' . urlencode($email), 'GET', null, true);
        if ($empRes['status'] === 200 && !empty($empRes['data'][0])) {
            return $this->normalizeRecord($empRes['data'][0]);
        }
        return null;
    }
}

