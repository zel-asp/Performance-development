-- ====================================================================
-- Table: public.lms_prescribed
-- Description: Tracks prescribed learning modules, progress, scores,
--              ratings, and completion status for employees.
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.lms_prescribed (
    id varchar(100) NOT NULL DEFAULT (extensions.uuid_generate_v4())::text,

    -- Foreign Key: Goal ID (can be NULL if prescribed independently)
    goal_id integer NULL,

    -- Foreign Key: LMS Document ID (NOT NULL)
    lms_id varchar(100) NOT NULL,

    -- Employee identifier (Do not reference, NOT NULL)
    employee varchar(100) NOT NULL,

    -- Evaluation & Progress metrics
    scores numeric(5, 2) NOT NULL DEFAULT 0.00,
    ratings numeric(3, 2) NOT NULL DEFAULT 0.00,
    progress integer NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),

    -- Status: 'needs retake', 'passed', 'In Progress', 'Pending'
    status varchar(50) NOT NULL DEFAULT 'Needs Retake'
        CHECK (status IN ('needs retake', 'passed', 'Needs Retake', 'Passed', 'In Progress', 'Pending')),

    -- Attempt & Time Tracking
    last_attempt timestamptz NULL,
    time_consumed integer NULL DEFAULT 0, -- Time consumed in seconds or minutes

    -- Targeted Scope: 'goal', 'competency', or 'both'
    "for" varchar(50) NOT NULL DEFAULT 'both'
        CHECK (LOWER("for") IN ('goal', 'competency', 'both')),

    -- Audit Timestamps
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    -- Constraints
    CONSTRAINT lms_prescribed_pkey PRIMARY KEY (id),

    CONSTRAINT lms_prescribed_goal_id_fkey
        FOREIGN KEY (goal_id)
        REFERENCES public.performance_goals(id)
        ON DELETE SET NULL,

    CONSTRAINT lms_prescribed_lms_id_fkey
        FOREIGN KEY (lms_id)
        REFERENCES public.lms_documents(id)
        ON DELETE CASCADE
);

-- Indexes for performant filtering
CREATE INDEX IF NOT EXISTS idx_lms_prescribed_employee ON public.lms_prescribed(employee);
CREATE INDEX IF NOT EXISTS idx_lms_prescribed_goal_id ON public.lms_prescribed(goal_id);
CREATE INDEX IF NOT EXISTS idx_lms_prescribed_lms_id ON public.lms_prescribed(lms_id);
CREATE INDEX IF NOT EXISTS idx_lms_prescribed_status ON public.lms_prescribed(status);
CREATE INDEX IF NOT EXISTS idx_lms_prescribed_for ON public.lms_prescribed("for");

-- Enable Row Level Security (RLS)
ALTER TABLE public.lms_prescribed ENABLE ROW LEVEL SECURITY;

-- Allow anon and authenticated users full access
CREATE POLICY "Allow public full access to lms_prescribed"
    ON public.lms_prescribed
    FOR ALL
    USING (true)
    WITH CHECK (true);
