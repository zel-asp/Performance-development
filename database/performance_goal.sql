-- 1. Create ENUM Types
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
