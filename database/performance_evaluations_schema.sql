-- ============================================================================
-- Oxford Suites, Makati — Performance Evaluations Schema (Phase 4 & 5)
-- Table: public.performance_evaluations
-- ============================================================================

DROP TABLE IF EXISTS public.performance_evaluations CASCADE;

create table public.performance_evaluations (
  id character varying(64) not null,
  employee_id character varying(64) not null,
  evaluator_id character varying(64) null,
  cycle_period character varying(50) not null default '2026 Q3'::character varying,
  supervisor_rating numeric(3, 2) not null default 0.00,
  calibrated_score numeric(3, 2) not null default 0.00,
  tier_label character varying(100) not null default 'Pending'::character varying,
  status character varying(50) not null default 'Pending'::character varying,
  criteria_scores jsonb not null default '[]'::jsonb,
  self_breakdown jsonb not null default '[]'::jsonb,
  supervisor_notes text null,
  peer_feedback jsonb not null default '[]'::jsonb,
  digital_signoffs jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  new_supervisor_rating numeric null default '0'::numeric,
  new_calibrated_score numeric null default '0'::numeric,
  constraint performance_evaluations_pkey primary key (id),
  constraint performance_evaluations_employee_id_fkey foreign KEY (employee_id) references users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_perf_eval_emp_id on public.performance_evaluations using btree (employee_id) TABLESPACE pg_default;

create index IF not exists idx_perf_eval_status on public.performance_evaluations using btree (status) TABLESPACE pg_default;

create index IF not exists idx_perf_eval_cycle on public.performance_evaluations using btree (cycle_period) TABLESPACE pg_default;