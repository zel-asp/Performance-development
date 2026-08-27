-- ============================================================================
-- Oxford Suites, Makati — Performance Evaluations Schema (Phase 4 & 5)
-- Table: public.performance_evaluations
-- ============================================================================

DROP TABLE IF EXISTS public.performance_evaluations CASCADE;

CREATE TABLE public.performance_evaluations (
    id VARCHAR(64) NOT NULL,
    employee_id VARCHAR(64) NOT NULL,
    evaluator_id VARCHAR(64) NULL,
    cycle_period VARCHAR(50) NOT NULL DEFAULT '2026 Q3',
    self_rating NUMERIC(3, 2) NOT NULL DEFAULT 0.00,
    supervisor_rating NUMERIC(3, 2) NOT NULL DEFAULT 0.00,
    calibrated_score NUMERIC(3, 2) NOT NULL DEFAULT 0.00,
    tier_label VARCHAR(100) NOT NULL DEFAULT 'Pending',
    status VARCHAR(50) NOT NULL DEFAULT 'Pending', -- 'Pending', 'Rated', 'Calibrated', 'Completed'
    criteria_scores JSONB NOT NULL DEFAULT '[]'::jsonb,
    self_breakdown JSONB NOT NULL DEFAULT '[]'::jsonb,
    supervisor_notes TEXT NULL,
    peer_feedback JSONB NOT NULL DEFAULT '[]'::jsonb,
    digital_signoffs JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT performance_evaluations_pkey
        PRIMARY KEY (id),

    CONSTRAINT performance_evaluations_employee_id_fkey
        FOREIGN KEY (employee_id)
        REFERENCES public.users (id)
        ON DELETE CASCADE
);

-- Indexes for performance lookups
CREATE INDEX IF NOT EXISTS idx_perf_eval_emp_id ON public.performance_evaluations(employee_id);
CREATE INDEX IF NOT EXISTS idx_perf_eval_status ON public.performance_evaluations(status);
CREATE INDEX IF NOT EXISTS idx_perf_eval_cycle ON public.performance_evaluations(cycle_period);
