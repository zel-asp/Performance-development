-- ============================================================================
-- Oxford Suites, Makati — Training Management Module Schema
-- Fully Self-Contained, Idempotent, and Supabase / PostgreSQL Compatible
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 0. CORE PREREQUISITES (Created if not already existing)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(100) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    code VARCHAR(30) UNIQUE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR(100) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    employee_code VARCHAR(50) UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE,
    role VARCHAR(50) DEFAULT 'Associate',
    title VARCHAR(100),
    department_id VARCHAR(100) REFERENCES departments(id) ON DELETE SET NULL,
    avatar_url TEXT,
    current_level INT DEFAULT 1,
    total_xp INT DEFAULT 0,
    status VARCHAR(30) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS competencies (
    id VARCHAR(100) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    key VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    department_id VARCHAR(100) REFERENCES departments(id) ON DELETE SET NULL,
    description TEXT,
    benchmark_score NUMERIC(3,2) DEFAULT 4.50,
    max_score NUMERIC(3,2) DEFAULT 5.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employee_competencies (
    id VARCHAR(100) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    employee_id VARCHAR(100) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    competency_id VARCHAR(100) NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
    current_score NUMERIC(3,2) NOT NULL DEFAULT 3.00,
    target_score NUMERIC(3,2) NOT NULL DEFAULT 5.00,
    last_assessed_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_emp_comp UNIQUE (employee_id, competency_id)
);

CREATE TABLE IF NOT EXISTS competency_gaps (
    id VARCHAR(100) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    employee_id VARCHAR(100) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    competency_id VARCHAR(100) NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
    current_score NUMERIC(3,2) NOT NULL,
    required_score NUMERIC(3,2) NOT NULL,
    gap_score NUMERIC(3,2),
    urgency VARCHAR(20) DEFAULT 'Medium',
    status VARCHAR(30) DEFAULT 'Identified',
    identified_at TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT
);

-- ----------------------------------------------------------------------------
-- 1. TRAINING NEEDS & GAPS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS training_needs (
    id VARCHAR(100) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    need_code VARCHAR(50),
    title VARCHAR(250) NOT NULL,
    source_type VARCHAR(50) NOT NULL CHECK (source_type IN ('competency_gap', 'compliance')),
    source_label VARCHAR(50),
    category VARCHAR(100) NOT NULL,
    dept VARCHAR(100) NOT NULL,
    department_id VARCHAR(100) REFERENCES departments(id) ON DELETE SET NULL,
    employee_id VARCHAR(100) REFERENCES employees(id) ON DELETE CASCADE,
    associate_name VARCHAR(150),
    associate_role VARCHAR(100),
    associate_avatar TEXT,
    target_competency_id VARCHAR(100) REFERENCES competencies(id) ON DELETE SET NULL,
    target_competency VARCHAR(150),
    competency_key VARCHAR(50),
    current_score NUMERIC(3,2),
    required_score NUMERIC(3,2),
    gap NUMERIC(3,2),
    urgency VARCHAR(20) DEFAULT 'High',
    status VARCHAR(30) DEFAULT 'Identified',
    linked_program_id VARCHAR(100),
    date_identified VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. TRAINING PROGRAMS (Curriculum, Modules & Quizzes)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS training_programs (
    id VARCHAR(100) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    title VARCHAR(250) NOT NULL,
    category VARCHAR(100) NOT NULL,
    category_type VARCHAR(50) NOT NULL CHECK (category_type IN ('skill_gap', 'compliance')),
    dept VARCHAR(100) NOT NULL,
    department_id VARCHAR(100) REFERENCES departments(id) ON DELETE SET NULL,
    target_competency_id VARCHAR(100) REFERENCES competencies(id) ON DELETE SET NULL,
    target_competency VARCHAR(150),
    competency_key VARCHAR(50),
    duration VARCHAR(50) NOT NULL,
    format VARCHAR(100) NOT NULL,
    trainer_type VARCHAR(100) NOT NULL,
    passing_score INT DEFAULT 80,
    xp_award INT DEFAULT 150,
    icon VARCHAR(50) DEFAULT 'fa-graduation-cap',
    badge_color VARCHAR(30) DEFAULT 'terracotta',
    description TEXT,
    modules JSONB DEFAULT '[]'::jsonb,
    quiz_questions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. TRAINING SESSIONS (Scheduled Cohorts & Dates)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS training_sessions (
    id VARCHAR(100) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    program_id VARCHAR(100) NOT NULL REFERENCES training_programs(id) ON DELETE CASCADE,
    title VARCHAR(250) NOT NULL,
    dept VARCHAR(100) NOT NULL,
    department_id VARCHAR(100) REFERENCES departments(id) ON DELETE SET NULL,
    trainer_employee_id VARCHAR(100) REFERENCES employees(id) ON DELETE SET NULL,
    trainer_name VARCHAR(150) NOT NULL,
    trainer_title VARCHAR(150),
    trainer_avatar TEXT,
    location VARCHAR(150) NOT NULL,
    session_date VARCHAR(50) NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    capacity INT DEFAULT 20,
    status VARCHAR(30) DEFAULT 'Scheduled',
    roster JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. SESSION PARTICIPANTS & ATTENDANCE LOGS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS session_participants (
    id VARCHAR(100) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    session_id VARCHAR(100) NOT NULL REFERENCES training_sessions(id) ON DELETE CASCADE,
    employee_id VARCHAR(100) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    attendance_status VARCHAR(30) DEFAULT 'Pending',
    attendance_rate INT DEFAULT 0,
    check_in_time VARCHAR(30),
    evaluation_status VARCHAR(30) DEFAULT 'Pending',
    score INT,
    result_id VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_session_emp UNIQUE (session_id, employee_id)
);

-- ----------------------------------------------------------------------------
-- 5. POST-TRAINING EVALUATION RESULTS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS training_evaluations (
    id VARCHAR(100) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    session_id VARCHAR(100) NOT NULL REFERENCES training_sessions(id) ON DELETE CASCADE,
    program_id VARCHAR(100) NOT NULL REFERENCES training_programs(id) ON DELETE CASCADE,
    program_title VARCHAR(250),
    category VARCHAR(100),
    dept VARCHAR(100),
    associate_id VARCHAR(100) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    associate_name VARCHAR(150) NOT NULL,
    associate_role VARCHAR(100),
    associate_avatar TEXT,
    trainer_name VARCHAR(150),
    completion_date VARCHAR(50),
    attendance_rate VARCHAR(20) DEFAULT '100%',
    quiz_score INT NOT NULL,
    passing_threshold INT DEFAULT 80,
    result_status VARCHAR(50) NOT NULL,
    feedback_rating NUMERIC(2,1),
    feedback_notes TEXT,
    certificate_reference VARCHAR(100) UNIQUE,
    competency_target VARCHAR(150),
    competency_key VARCHAR(50),
    competency_score_before NUMERIC(3,2),
    competency_score_after NUMERIC(3,2),
    xp_awarded INT DEFAULT 150,
    synced_to_profile BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. DIGITAL CERTIFICATES
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS certificates (
    id VARCHAR(100) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    certificate_number VARCHAR(100) UNIQUE NOT NULL,
    employee_id VARCHAR(100) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    program_id VARCHAR(100) REFERENCES training_programs(id) ON DELETE SET NULL,
    evaluation_id VARCHAR(100) REFERENCES training_evaluations(id) ON DELETE SET NULL,
    associate_name VARCHAR(150) NOT NULL,
    program_title VARCHAR(250) NOT NULL,
    category VARCHAR(100),
    dept VARCHAR(100),
    score INT NOT NULL,
    issue_date VARCHAR(50),
    gm_signature VARCHAR(150) DEFAULT 'General Manager, Oxford Suites',
    verification_seal_code VARCHAR(150) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. GAMIFICATION XP LEDGER (Interconnected)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS xp_ledger (
    id VARCHAR(100) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    employee_id VARCHAR(100) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    source_type VARCHAR(50) NOT NULL,
    reference_id VARCHAR(100),
    points INT NOT NULL,
    balance_after INT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 8. INDEXES FOR PERFORMANCE
-- ----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_tn_dept ON training_needs(dept);
CREATE INDEX IF NOT EXISTS idx_tn_status ON training_needs(status);
CREATE INDEX IF NOT EXISTS idx_tp_dept ON training_programs(dept);
CREATE INDEX IF NOT EXISTS idx_ts_program ON training_sessions(program_id);
CREATE INDEX IF NOT EXISTS idx_sp_session ON session_participants(session_id);
CREATE INDEX IF NOT EXISTS idx_te_emp ON training_evaluations(associate_id);
CREATE INDEX IF NOT EXISTS idx_cert_num ON certificates(certificate_number);
