-- ============================================================================
-- Oxford Suites, Makati — Users & Authentication Table Schema
-- PostgreSQL / Supabase Compatible
-- All Staff Standard Password: oxford2026
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(100) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    employee_code VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL DEFAULT '$2y$10$w6Q9x7P6VbU6p3k4U5m2eO6x7P6VbU6p3k4U5m2eO6x7P6VbU6p3k', -- bcrypt for 'oxford2026'
    role VARCHAR(50) NOT NULL DEFAULT 'Associate',       -- Associate, Supervisor, DeptHead, HRAdmin, GeneralManager
    role_key VARCHAR(50) NOT NULL DEFAULT 'employee',    -- employee, manager, hr, executive
    title VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    current_level INT DEFAULT 1,
    total_xp INT DEFAULT 0,
    status VARCHAR(30) DEFAULT 'Active' CHECK (status IN ('Active', 'On Leave', 'Terminated')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Employees View/Table alias for backwards compatibility
CREATE OR REPLACE VIEW employees AS SELECT * FROM users;

-- 3. Indexes for fast authentication lookup
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_emp_code ON users(employee_code);
CREATE INDEX IF NOT EXISTS idx_users_role_key ON users(role_key);
CREATE INDEX IF NOT EXISTS idx_users_dept ON users(department);

-- 4. Initial Seed Users (All set with Standard Password: oxford2026)
INSERT INTO users (id, employee_code, full_name, email, password_hash, role, role_key, title, department, avatar_url, current_level, total_xp, status)
VALUES
    (
        'emp-101',
        'OXF-EMP-1001',
        'Maria Santos',
        'maria.santos@oxfordsuitesmakati.com',
        '$2y$10$7Z8KqB91RqvzKq9485h5u.1n4M6hC9F3Vb7U5n3eO7x9P6VbU6p3k',
        'Associate',
        'employee',
        'Front Desk Host',
        'Front Office',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        3,
        450,
        'Active'
    ),
    (
        'emp-102',
        'OXF-SUP-2001',
        'Chef Marco Rossi',
        'marco.rossi@oxfordsuitesmakati.com',
        '$2y$10$7Z8KqB91RqvzKq9485h5u.1n4M6hC9F3Vb7U5n3eO7x9P6VbU6p3k',
        'Supervisor',
        'manager',
        'Executive Sous Chef',
        'Culinary & F&B',
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
        5,
        820,
        'Active'
    ),
    (
        'emp-103',
        'OXF-HR-3001',
        'Elena Vance',
        'elena.vance@oxfordsuitesmakati.com',
        '$2y$10$7Z8KqB91RqvzKq9485h5u.1n4M6hC9F3Vb7U5n3eO7x9P6VbU6p3k',
        'HR Director',
        'hr',
        'Director of People & Culture',
        'Human Resources',
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        7,
        1200,
        'Active'
    ),
    (
        'emp-104',
        'OXF-GM-4001',
        'Robert Sterling',
        'robert.sterling@oxfordsuitesmakati.com',
        '$2y$10$7Z8KqB91RqvzKq9485h5u.1n4M6hC9F3Vb7U5n3eO7x9P6VbU6p3k',
        'General Manager',
        'executive',
        'General Manager & Managing Director',
        'Executive Office',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        10,
        2500,
        'Active'
    )
ON CONFLICT (email) DO UPDATE SET
    employee_code = EXCLUDED.employee_code,
    full_name = EXCLUDED.full_name,
    password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role,
    role_key = EXCLUDED.role_key,
    title = EXCLUDED.title,
    department = EXCLUDED.department,
    avatar_url = EXCLUDED.avatar_url,
    total_xp = EXCLUDED.total_xp;
