<?php

require_once __DIR__ . '/BaseModel.php';

class AuthModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct('users');
        $this->seedInitialEmployees();
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
        if (in_array($password, $validDemoPasswords)) {
            return true;
        }

        return false;
    }

    private function seedInitialEmployees(): void
    {
        $defaultHash = password_hash('oxford2026', PASSWORD_DEFAULT);

        $initial = [
            [
                'id'            => 'emp-101',
                'employee_code' => 'OXF-EMP-1001',
                'full_name'     => 'Maria Santos',
                'email'         => 'maria.santos@oxfordsuitesmakati.com',
                'password_hash' => $defaultHash,
                'role'          => 'Associate',
                'role_key'      => 'employee',
                'title'         => 'Front Desk Host',
                'dept'          => 'Front Office',
                'avatar_url'    => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                'current_level' => 3,
                'total_xp'      => 450,
                'status'        => 'Active'
            ],
            [
                'id'            => 'emp-102',
                'employee_code' => 'OXF-SUP-2001',
                'full_name'     => 'Chef Marco Rossi',
                'email'         => 'marco.rossi@oxfordsuitesmakati.com',
                'password_hash' => $defaultHash,
                'role'          => 'Supervisor',
                'role_key'      => 'manager',
                'title'         => 'Executive Sous Chef',
                'dept'          => 'Culinary & F&B',
                'avatar_url'    => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
                'current_level' => 5,
                'total_xp'      => 820,
                'status'        => 'Active'
            ],
            [
                'id'            => 'emp-103',
                'employee_code' => 'OXF-HR-3001',
                'full_name'     => 'Elena Vance',
                'email'         => 'elena.vance@oxfordsuitesmakati.com',
                'password_hash' => $defaultHash,
                'role'          => 'HR Director',
                'role_key'      => 'hr',
                'title'         => 'Director of People & Culture',
                'dept'          => 'Human Resources',
                'avatar_url'    => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
                'current_level' => 7,
                'total_xp'      => 1200,
                'status'        => 'Active'
            ],
            [
                'id'            => 'emp-104',
                'employee_code' => 'OXF-GM-4001',
                'full_name'     => 'Robert Sterling',
                'email'         => 'robert.sterling@oxfordsuitesmakati.com',
                'password_hash' => $defaultHash,
                'role'          => 'General Manager',
                'role_key'      => 'executive',
                'title'         => 'General Manager & Managing Director',
                'dept'          => 'Executive Office',
                'avatar_url'    => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                'current_level' => 10,
                'total_xp'      => 2500,
                'status'        => 'Active'
            ]
        ];
        $this->seedIfEmpty($initial);
    }
}
