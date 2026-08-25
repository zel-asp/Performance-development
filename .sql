-- =========================================================
-- Performance Goals Table Schema (PostgreSQL Compatible)
-- =========================================================

-- 1. Create ENUM Types (if not exist)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('employee', 'supervisor');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE target_scope_type AS ENUM ('single', 'dept', 'property');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE goal_status_type AS ENUM ('Pending Approval', 'Approved', 'Needs Revision', 'Completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create Performance Goals Table
CREATE TABLE IF NOT EXISTS performance_goals (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL,
    role user_role NOT NULL DEFAULT 'employee',
    target_scope target_scope_type NOT NULL DEFAULT 'single',
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    target_date DATE NOT NULL,
    target_metric VARCHAR(255) NOT NULL,
    weight VARCHAR(100) DEFAULT 'Medium Priority (20% Weight)',
    evidence TEXT NULL,
    status goal_status_type DEFAULT 'Pending Approval',
    supervisor_id VARCHAR(50) NULL,
    supervisor_notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Indexes
CREATE INDEX IF NOT EXISTS idx_emp_id ON performance_goals(employee_id);
CREATE INDEX IF NOT EXISTS idx_role ON performance_goals(role);
CREATE INDEX IF NOT EXISTS idx_dept ON performance_goals(department);
CREATE INDEX IF NOT EXISTS idx_status ON performance_goals(status);

-- =========================================================
-- Sample INSERT Queries
-- =========================================================

-- Goal Created by an Employee (Submitted for approval)
INSERT INTO performance_goals (
    employee_id,
    role,
    target_scope,
    title,
    department,
    target_date,
    target_metric,
    weight,
    evidence,
    status
) VALUES (
    'EMP-1001',
    'employee',
    'single',
    'Elevate VIP Guest Check-in Experience & NPS Loyalty Index',
    'Front Office & Guest Experience',
    '2026-09-30',
    'Net Promoter Score (NPS) >= +92 Score',
    'High Priority (35% Weight - Core Role Objective)',
    'Monthly guest ratings and Opera PMS check-in speed logs',
    'Pending Approval'
);

-- Goal Created/Cascaded by a Supervisor (Approved)
INSERT INTO performance_goals (
    employee_id,
    role,
    target_scope,
    title,
    department,
    target_date,
    target_metric,
    weight,
    evidence,
    status,
    supervisor_id,
    supervisor_notes
) VALUES (
    'EMP-1001',
    'supervisor',
    'dept',
    'Express Suite Turnover & 5-Star Sanitization Standard',
    'Housekeeping & Facilities',
    '2026-09-30',
    'Turnaround < 22 mins / suite',
    'Medium Priority (20% Weight - Standard Operational Goal)',
    'Housekeeping PMS floor logs',
    'Approved',
    'SUP-2001',
    'Calibrated and approved during Q3 planning.'
);
