-- ============================================================================
-- Oxford Suites, Makati — Performance & Development Hub
-- Comprehensive Database Schema (PostgreSQL / Supabase Compatible)
-- ============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. CORE & USER MANAGEMENT
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    head_employee_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_code VARCHAR(30) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Associate', -- e.g. Associate, Supervisor, DeptHead, HRAdmin, GeneralManager
    title VARCHAR(100) NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    avatar_url TEXT,
    current_level INT DEFAULT 1,
    total_xp INT DEFAULT 0,
    hire_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'On Leave', 'Terminated')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraint for department head
ALTER TABLE departments 
    ADD CONSTRAINT fk_dept_head 
    FOREIGN KEY (head_employee_id) 
    REFERENCES employees(id) 
    ON DELETE SET NULL;

-- ----------------------------------------------------------------------------
-- 2. COMPETENCY MANAGEMENT MODULE
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS competencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'de_escalation', 'haccp_safety', 'pms_mastery'
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Service Excellence', 'Food Safety & Hygiene', 'Technical PMS', etc.
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    description TEXT,
    benchmark_score NUMERIC(3,2) DEFAULT 4.50,
    max_score NUMERIC(3,2) DEFAULT 5.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employee_competencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    competency_id UUID NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
    current_score NUMERIC(3,2) NOT NULL DEFAULT 3.00,
    target_score NUMERIC(3,2) NOT NULL DEFAULT 5.00,
    last_assessed_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_emp_competency UNIQUE (employee_id, competency_id)
);

CREATE TABLE IF NOT EXISTS competency_gaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    competency_id UUID NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
    current_score NUMERIC(3,2) NOT NULL,
    required_score NUMERIC(3,2) NOT NULL,
    gap_score NUMERIC(3,2) GENERATED ALWAYS AS (current_score - required_score) STORED,
    urgency VARCHAR(20) DEFAULT 'Medium' CHECK (urgency IN ('Low', 'Medium', 'High', 'Critical')),
    status VARCHAR(30) DEFAULT 'Identified' CHECK (status IN ('Identified', 'Training Linked', 'Resolved')),
    identified_at TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT
);

-- ----------------------------------------------------------------------------
-- 3. TRAINING MANAGEMENT MODULE (5-Stage Operational Pipeline)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS training_needs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    need_code VARCHAR(30) UNIQUE,
    title VARCHAR(200) NOT NULL,
    source_type VARCHAR(30) NOT NULL CHECK (source_type IN ('competency_gap', 'compliance')),
    category VARCHAR(100) NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE, -- NULL if department-wide
    target_competency_id UUID REFERENCES competencies(id) ON DELETE SET NULL,
    current_score NUMERIC(3,2),
    required_score NUMERIC(3,2),
    gap NUMERIC(3,2),
    urgency VARCHAR(20) DEFAULT 'High' CHECK (urgency IN ('Low', 'Medium', 'High', 'Critical')),
    status VARCHAR(30) DEFAULT 'Identified' CHECK (status IN ('Identified', 'Program Linked', 'Scheduled', 'Completed')),
    date_identified DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS training_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_code VARCHAR(30) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    category_type VARCHAR(30) NOT NULL CHECK (category_type IN ('skill_gap', 'compliance')),
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    target_competency_id UUID REFERENCES competencies(id) ON DELETE SET NULL,
    duration VARCHAR(50) NOT NULL, -- e.g. '3.5 Hours'
    format VARCHAR(100) NOT NULL, -- e.g. 'In-Person Workshop & Roleplay'
    trainer_type VARCHAR(50) NOT NULL, -- 'Internal Master Trainer', 'Certified External Auditor'
    passing_score INT DEFAULT 80,
    xp_award INT DEFAULT 150,
    icon VARCHAR(50) DEFAULT 'fa-graduation-cap',
    badge_color VARCHAR(30) DEFAULT 'terracotta',
    description TEXT,
    syllabus_modules JSONB DEFAULT '[]'::jsonb, -- Array of module titles
    quiz_questions JSONB DEFAULT '[]'::jsonb, -- Array of {q, options, correct}
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS training_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_code VARCHAR(30) UNIQUE NOT NULL,
    program_id UUID NOT NULL REFERENCES training_programs(id) ON DELETE CASCADE,
    title VARCHAR(250) NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    trainer_name VARCHAR(150) NOT NULL,
    trainer_title VARCHAR(150),
    trainer_avatar TEXT,
    location VARCHAR(150) NOT NULL,
    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    capacity INT DEFAULT 20,
    status VARCHAR(30) DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'In Progress', 'Completed', 'Cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS session_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES training_sessions(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    attendance_status VARCHAR(20) DEFAULT 'Pending' CHECK (attendance_status IN ('Pending', 'Attended', 'Absent', 'Completed')),
    check_in_timestamp TIMESTAMPTZ,
    completion_rate INT DEFAULT 0 CHECK (completion_rate BETWEEN 0 AND 100),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_session_participant UNIQUE (session_id, employee_id)
);

CREATE TABLE IF NOT EXISTS training_evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES training_sessions(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES training_programs(id) ON DELETE CASCADE,
    quiz_score INT NOT NULL CHECK (quiz_score BETWEEN 0 AND 100),
    kirkpatrick_rating NUMERIC(2,1) CHECK (kirkpatrick_rating BETWEEN 1.0 AND 5.0),
    feedback_notes TEXT,
    is_passed BOOLEAN GENERATED ALWAYS AS (quiz_score >= 80) STORED,
    certificate_reference VARCHAR(50) UNIQUE,
    xp_awarded INT DEFAULT 0,
    evaluated_at TIMESTAMPTZ DEFAULT NOW(),
    evaluated_by UUID REFERENCES employees(id) ON DELETE SET NULL,
    CONSTRAINT uq_evaluation UNIQUE (session_id, employee_id)
);

CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'OXF-CERT-2026-0889'
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES training_programs(id) ON DELETE CASCADE,
    session_id UUID REFERENCES training_sessions(id) ON DELETE SET NULL,
    evaluation_id UUID REFERENCES training_evaluations(id) ON DELETE SET NULL,
    score INT NOT NULL,
    issue_date DATE DEFAULT CURRENT_DATE,
    expiry_date DATE,
    gm_signed BOOLEAN DEFAULT TRUE,
    verification_seal_code VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. SUCCESSION PLANNING MODULE
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS succession_positions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    current_incumbent_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    critical_level VARCHAR(20) DEFAULT 'High' CHECK (critical_level IN ('Standard', 'High', 'Critical')),
    risk_of_loss VARCHAR(20) DEFAULT 'Medium' CHECK (risk_of_loss IN ('Low', 'Medium', 'High')),
    impact_of_loss VARCHAR(20) DEFAULT 'High' CHECK (impact_of_loss IN ('Low', 'Medium', 'High', 'Severe')),
    planned_transition_horizon VARCHAR(50) DEFAULT '6-12 Months',
    emergency_backup_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    required_competencies JSONB DEFAULT '[]'::jsonb, -- Array of {competency_key, min_rating}
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS succession_candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    position_id UUID NOT NULL REFERENCES succession_positions(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    closed_performance_score NUMERIC(3,2) DEFAULT 0.00, -- From Performance module (0-5)
    target_competency_match_pct INT DEFAULT 0 CHECK (target_competency_match_pct BETWEEN 0 AND 100),
    computed_readiness_pct INT GENERATED ALWAYS AS (
        CAST(ROUND((closed_performance_score / 5.0 * 40) + (target_competency_match_pct * 0.60)) AS INT)
    ) STORED,
    hr_readiness_flag VARCHAR(30) DEFAULT 'Not Ready' CHECK (hr_readiness_flag IN ('Ready Now', 'Ready in 1-2 Years', 'Not Ready')),
    nine_box_grid VARCHAR(50) DEFAULT 'Core Contributor', -- e.g. 'Star / Future Leader', 'High Potential', etc.
    notes TEXT,
    updated_by UUID REFERENCES employees(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_position_candidate UNIQUE (position_id, employee_id)
);

CREATE TABLE IF NOT EXISTS individual_development_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    target_position_id UUID REFERENCES succession_positions(id) ON DELETE SET NULL,
    goal_title VARCHAR(250) NOT NULL,
    pillar_type VARCHAR(30) NOT NULL CHECK (pillar_type IN ('70_on_the_job', '20_social_mentorship', '10_formal_training')),
    target_date DATE,
    progress_pct INT DEFAULT 0 CHECK (progress_pct BETWEEN 0 AND 100),
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. SOCIAL RECOGNITION & GAMIFICATION MODULE
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS recognition_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    post_type VARCHAR(30) NOT NULL CHECK (post_type IN ('peer', 'supervisor', 'gm_citation')),
    category VARCHAR(100) NOT NULL, -- e.g. 'Great Guest Service', 'Team Collaboration', 'Safety & HACCP'
    message TEXT NOT NULL,
    xp_awarded INT NOT NULL, -- Peer: 50, Supervisor: 100, GM: 200
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    is_included_in_appraisal BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recognition_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES recognition_posts(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) NOT NULL CHECK (reaction_type IN ('clap', 'heart', 'star', 'fire')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_reaction UNIQUE (post_id, employee_id, reaction_type)
);

CREATE TABLE IF NOT EXISTS xp_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    source_type VARCHAR(40) NOT NULL CHECK (source_type IN (
        'peer_kudos', 
        'supervisor_kudos', 
        'gm_citation', 
        'training_completion', 
        'badge_milestone', 
        'lms_completion',
        'manual_adjustment'
    )),
    reference_id UUID, -- Links to recognition_posts.id, certificates.id, etc.
    points INT NOT NULL,
    balance_after INT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    threshold_type VARCHAR(50) NOT NULL, -- e.g. 'guest_reviews_count', 'peer_kudos_count', 'training_passed'
    threshold_count INT NOT NULL DEFAULT 1,
    xp_reward INT DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employee_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_emp_badge UNIQUE (employee_id, badge_id)
);

-- ----------------------------------------------------------------------------
-- 6. PERFORMANCE MANAGEMENT MODULE (7-Stage Appraisal & Calibrations)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS appraisal_cycles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL, -- e.g. '2026 Q3 Mid-Year Operational Review'
    cycle_year INT NOT NULL,
    cycle_quarter VARCHAR(10) NOT NULL, -- 'Q1', 'Q2', 'Q3', 'Q4', 'Annual'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(30) DEFAULT 'Active' CHECK (status IN ('Upcoming', 'Active', 'Calibrating', 'Closed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS performance_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cycle_id UUID NOT NULL REFERENCES appraisal_cycles(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    current_phase VARCHAR(30) DEFAULT 'Phase 1' CHECK (current_phase IN (
        'Phase 1 - Self Assessment',
        'Phase 2 - Supervisor Assessment',
        'Phase 3 - 360 Feedback Synthesis',
        'Phase 4 - Calibration Committee',
        'Phase 5 - 1-on-1 Discussion',
        'Phase 6 - Associate Signoff',
        'Phase 7 - Closed & Audited'
    )),
    self_rating NUMERIC(3,2),
    supervisor_rating NUMERIC(3,2),
    calibrated_final_score NUMERIC(3,2), -- Scale 1.00 to 5.00
    qualitative_synthesis TEXT,
    social_quotes_aggregated JSONB DEFAULT '[]'::jsonb,
    is_closed BOOLEAN DEFAULT FALSE,
    closed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_cycle_employee UNIQUE (cycle_id, employee_id)
);

-- ----------------------------------------------------------------------------
-- 7. NOTIFICATIONS & REALTIME SHIFT SENTIMENT
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    type VARCHAR(40) NOT NULL, -- 'kudos_received', 'training_scheduled', 'cert_issued', 'gap_detected'
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    action_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shift_sentiment_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    shift_name VARCHAR(50) NOT NULL, -- 'Morning Shift', 'Rush Hour Dinner', 'Night Audit'
    sentiment_score NUMERIC(3,2) NOT NULL, -- 0.00 to 5.00
    stress_level VARCHAR(20) DEFAULT 'Moderate' CHECK (stress_level IN ('Low', 'Moderate', 'High', 'Critical')),
    operational_friction_notes TEXT,
    logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 8. INDEXES FOR PERFORMANCE OPTIMIZATION
-- ----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_emp_dept ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_emp_comp_emp ON employee_competencies(employee_id);
CREATE INDEX IF NOT EXISTS idx_emp_comp_comp ON employee_competencies(competency_id);
CREATE INDEX IF NOT EXISTS idx_training_needs_status ON training_needs(status);
CREATE INDEX IF NOT EXISTS idx_training_sessions_prog ON training_sessions(program_id);
CREATE INDEX IF NOT EXISTS idx_session_part_sess ON session_participants(session_id);
CREATE INDEX IF NOT EXISTS idx_session_part_emp ON session_participants(employee_id);
CREATE INDEX IF NOT EXISTS idx_succession_pos_dept ON succession_positions(department_id);
CREATE INDEX IF NOT EXISTS idx_succession_cand_pos ON succession_candidates(position_id);
CREATE INDEX IF NOT EXISTS idx_kudos_recip ON recognition_posts(recipient_id);
CREATE INDEX IF NOT EXISTS idx_kudos_dept ON recognition_posts(department_id);
CREATE INDEX IF NOT EXISTS idx_xp_ledger_emp ON xp_ledger(employee_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
