create table public.xp_ledger (
  id character varying(100) not null default (extensions.uuid_generate_v4 ())::text,
  employee_id character varying(100) not null,
  source_type character varying(50) not null,
  performance_eval_id character varying(100) null,
  points integer not null,
  balance_after integer not null,
  description text null,
  created_at timestamp with time zone null default now(),
  constraint xp_ledger_pkey primary key (id),
  constraint xp_ledger_performance_eval_id_fkey foreign KEY (performance_eval_id) references performance_evaluations (id)
) TABLESPACE pg_default;