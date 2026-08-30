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
    CREATE TYPE goal_status_type AS ENUM ('Pending Approval', 'Approved', 'Needs Revision', 'Completed', 'Failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
create table public.performance_goals (
  id serial not null,
  employee_id character varying(50) not null,
  role public.user_role not null default 'employee'::user_role,
  target_scope public.target_scope_type not null default 'single'::target_scope_type,
  title character varying(255) not null,
  department character varying(100) not null,
  target_date date not null,
  target_metric character varying(255) not null,
  weight character varying(100) null default 'Medium Priority (20% Weight)'::character varying,
  evidence text null,
  status public.goal_status_type null default 'Pending Approval'::goal_status_type,
  supervisor_id character varying(50) null,
  supervisor_notes text null,
  created_at timestamp without time zone null default CURRENT_TIMESTAMP,
  updated_at timestamp without time zone null default CURRENT_TIMESTAMP,
  retry_count integer null default 0,
  needs_training boolean null default false,
  in_training boolean null default false,
  constraint performance_goals_pkey primary key (id),
  constraint performance_goals_employee_id_fkey foreign KEY (employee_id) references users (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_emp_id on public.performance_goals using btree (employee_id) TABLESPACE pg_default;

create index IF not exists idx_role on public.performance_goals using btree (role) TABLESPACE pg_default;

create index IF not exists idx_dept on public.performance_goals using btree (department) TABLESPACE pg_default;

create index IF not exists idx_status on public.performance_goals using btree (status) TABLESPACE pg_default;