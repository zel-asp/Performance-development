<?php

require_once __DIR__ . '/BaseModel.php';

class AuthModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct('users');
    }

    /**
     * Find employee by Email OR Employee Code
     */
    public function findByIdentifier(string $identifier): ?array
    {
        $identifier = strtolower(trim($identifier));
        $all = $this->all();

        foreach ($all as $emp) {
            $email = strtolower($emp['email'] ?? '');
            $code = strtolower($emp['employee_code'] ?? '');
            if ($email === $identifier || $code === $identifier) {
                return $emp;
            }
        }
        return null;
    }

    public function findByEmail(string $email): ?array
    {
        return $this->findByIdentifier($email);
    }

    public function findByEmployeeCode(string $code): ?array
    {
        return $this->findByIdentifier($code);
    }

    public function findByRole(string $role): ?array
    {
        $targetRole = strtolower(trim($role));
        $all = $this->all();

        // 1. Match strictly by role column in users table
        foreach ($all as $emp) {
            if (strtolower($emp['role'] ?? '') === $targetRole) {
                return $emp;
            }
        }

        // 2. Match by user ID (e.g. emp-101, emp-102)
        foreach ($all as $emp) {
            if (strtolower($emp['id'] ?? '') === $targetRole) {
                return $emp;
            }
        }

        return !empty($all) ? $all[0] : null;
    }

    public function findByRoleKey(string $roleKey): ?array
    {
        return $this->findByRole($roleKey);
    }

    /**
     * Verify Password against hash or demo default
     */
    public function verifyPassword(array $user, string $password): bool
    {
        if (empty($password)) {
            return false;
        }

        // 1. Check direct password_hash if set
        if (!empty($user['password_hash'])) {
            if (password_verify($password, $user['password_hash'])) {
                return true;
            }
        }

        // 2. Default demo passwords accepted for hospitality testing
        $validDemoPasswords = ['oxford2026', 'password123', 'admin123', 'demo2026'];
        if (in_array($password, $validDemoPasswords) || (!empty($user['password']) && $user['password'] === $password)) {
            return true;
        }

        return false;
    }
}
