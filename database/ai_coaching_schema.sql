-- ============================================================================
-- Oxford Suites, Makati - AI Coaching & Rate Limiting Schema
-- Supporting: SBI Feedback Refiner, Realtime Sentiment & Compliance Audit Log
-- ============================================================================

-- 1. Coaching Notes Table (Human-in-the-loop approved coaching records)
CREATE TABLE IF NOT EXISTS public.coaching_notes (
    id VARCHAR(64) PRIMARY KEY,
    employee_id VARCHAR(64) NOT NULL,
    supervisor_id VARCHAR(64) NOT NULL,
    situation TEXT NOT NULL,
    behavior TEXT NOT NULL,
    impact TEXT NOT NULL,
    source VARCHAR(20) NOT NULL DEFAULT 'manual', -- 'manual' or 'ai_refined'
    tone_tag VARCHAR(30) DEFAULT 'balanced',       -- 'balanced', 'direct', 'growth', 'empathy'
    visibility_flag BOOLEAN NOT NULL DEFAULT TRUE, -- TRUE = visible to supervisor/HR (or employee if calibrated)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coaching_notes_employee ON public.coaching_notes(employee_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_coaching_notes_supervisor ON public.coaching_notes(supervisor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_coaching_notes_source ON public.coaching_notes(source);

-- 2. Per-User Rate Limits Table (Sliding Window / Request Bucket)
CREATE TABLE IF NOT EXISTS public.rate_limits (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    request_count INT NOT NULL DEFAULT 1,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_user_window ON public.rate_limits(user_id, window_start);

-- 3. AI Request Log Table (HR Compliance & Academic Audit Trail)
CREATE TABLE IF NOT EXISTS public.ai_request_log (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'Supervisor',
    feature VARCHAR(30) NOT NULL, -- 'sbi_refiner', 'sentiment'
    input_reference TEXT,
    tokens_used INT DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'SUCCESS', -- 'SUCCESS', 'RATE_LIMITED', 'ERROR', 'FALLBACK'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_request_log_user ON public.ai_request_log(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_request_log_feature ON public.ai_request_log(feature, created_at DESC);
