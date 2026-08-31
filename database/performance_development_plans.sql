-- ============================================================================
-- Oxford Suites, Makati — Performance Development Plans (Single Staging Table)
-- Purpose: Holds draft action tasks and LMS book prescriptions in Phase 6.
--          Items do NOT go into performance_tasks or lms_prescribed until a
--          supervisor explicitly deploys the plan in Phase 7.
--
-- item_type = 'task'     → draft action task (copies to performance_tasks on deploy)
-- item_type = 'lms_book' → draft LMS prescription (copies to lms_prescribed on deploy)
-- ============================================================================

CREATE TABLE IF NOT EXISTS performance_development_plans (
    id                  VARCHAR(100)    NOT NULL DEFAULT (extensions.uuid_generate_v4())::TEXT,

    -- Who this draft belongs to
    employee_id         VARCHAR(100)    NOT NULL,
    goal_id             BIGINT          NULL
        REFERENCES performance_goals(id) ON DELETE CASCADE,

    -- Context
    cycle_period        VARCHAR(50)     NOT NULL DEFAULT '2026-Q3',
    plan_type           VARCHAR(50)     NOT NULL DEFAULT 'IDP'
        CHECK (plan_type IN ('IDP', 'PIP')),

    -- What kind of draft item this row represents
    item_type           VARCHAR(50)     NOT NULL DEFAULT 'task'
        CHECK (item_type IN ('task', 'lms_book')),

    -- -------------------------------------------------------------------------
    -- Task fields (used when item_type = 'task')
    -- -------------------------------------------------------------------------
    title               VARCHAR(255)    NULL,
    description         TEXT            NULL,
    target_date         DATE            NULL,

    -- -------------------------------------------------------------------------
    -- LMS Book fields (used when item_type = 'lms_book')
    -- -------------------------------------------------------------------------
    lms_document_id     VARCHAR(100)    NULL
        REFERENCES lms_documents(id) ON DELETE CASCADE,

    -- -------------------------------------------------------------------------
    -- Shared / status fields
    -- -------------------------------------------------------------------------
    status              VARCHAR(50)     NOT NULL DEFAULT 'Draft'
        CHECK (status IN ('Draft', 'Committed', 'Archived')),
    notes               TEXT            NULL,
    created_by          VARCHAR(100)    NULL,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT performance_development_plans_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_pdp_employee_id   ON public.performance_development_plans USING btree (employee_id)       TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_pdp_goal_id        ON public.performance_development_plans USING btree (goal_id)           TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_pdp_status         ON public.performance_development_plans USING btree (status)            TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_pdp_item_type      ON public.performance_development_plans USING btree (item_type)         TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_pdp_lms_document   ON public.performance_development_plans USING btree (lms_document_id)  TABLESPACE pg_default;
