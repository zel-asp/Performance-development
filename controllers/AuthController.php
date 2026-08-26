<?php

require_once __DIR__ . '/../models/AuthModel.php';

class AuthController
{
    private AuthModel $authModel;

    public function __construct()
    {
        $this->authModel = new AuthModel();
    }

    /**
     * Standard Login by Email or Employee Code with Password
     */
    public function login(array $payload): array
    {
        $identifier = trim($payload['identifier'] ?? $payload['email'] ?? $payload['employee_code'] ?? '');
        $password = trim($payload['password'] ?? '');

        if (empty($identifier)) {
            return [
                'success' => false,
                'message' => 'Please enter your Employee Code (e.g. OXF-EMP-1001) or Work Email.'
            ];
        }

        $user = $this->authModel->findByIdentifier($identifier);
        if (!$user) {
            return [
                'success' => false,
                'message' => "Account not found for '{$identifier}'. Please check your Employee Code or Work Email."
            ];
        }

        // If password is provided, verify it
        if (!empty($password)) {
            $isPasswordValid = $this->authModel->verifyPassword($user, $password);
            if (!$isPasswordValid) {
                return [
                    'success' => false,
                    'message' => 'Invalid password. (Demo Password: oxford2026)'
                ];
            }
        }

        // Start session if not started
        if (!headers_sent() && session_status() === PHP_SESSION_NONE) {
            @session_start();
        }
        $_SESSION['authenticated_user'] = $user;

        return [
            'success' => true,
            'message' => "Welcome back, {$user['full_name']}!",
            'data'    => [
                'user'         => $user,
                'role'         => $user['role'] ?? 'Associate',
                'session_token'=> bin2hex(random_bytes(16))
            ]
        ];
    }

    /**
     * Fast Persona Login using users.role column strictly
     */
    public function fastLogin(array $payload): array
    {
        $role = $payload['role'] ?? $payload['roleKey'] ?? $payload['role_key'] ?? 'Associate';
        $user = $this->authModel->findByRole($role);

        if (!$user) {
            return [
                'success' => false,
                'message' => "User for role '{$role}' not found in database."
            ];
        }

        if (session_status() === PHP_SESSION_NONE) {
            @session_start();
        }
        $_SESSION['authenticated_user'] = $user;

        return [
            'success' => true,
            'message' => "Signed in as {$user['full_name']} ({$user['title']})",
            'data'    => [
                'user'         => $user,
                'role'         => $user['role'],
                'session_token'=> bin2hex(random_bytes(16))
            ]
        ];
    }

    /**
     * Get Current Authenticated User Profile
     */
    public function getCurrentUser(): array
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $user = $_SESSION['authenticated_user'] ?? $this->authModel->findByRoleKey('employee');

        return [
            'success' => true,
            'data'    => $user
        ];
    }

    /**
     * Get All Users from users table
     */
    public function listUsers(): array
    {
        $users = $this->authModel->all();
        foreach ($users as &$u) {
            unset($u['password_hash']);
            unset($u['password']);
        }
        return [
            'success' => true,
            'data'    => $users,
            'count'   => count($users)
        ];
    }

    /**
     * Logout
     */
    public function logout(): array
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        unset($_SESSION['authenticated_user']);
        session_destroy();

        return [
            'success' => true,
            'message' => 'Signed out of session successfully.'
        ];
    }
}
