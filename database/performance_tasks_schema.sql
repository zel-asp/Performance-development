-- 1. Create Performance General Tasks Table (Master templates managed by Supervisor)
CREATE TABLE IF NOT EXISTS public.performance_general_tasks (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Operational Excellence',
    target_days_offset INT NOT NULL DEFAULT 7,
    weight VARCHAR(50) DEFAULT 'Standard',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Performance Concrete Tasks Table (Assigned to goals & employees)
create table public.performance_tasks (
  id character varying(64) not null,
  goal_id bigint null,
  employee_id character varying(64) not null,
  task_type character varying(20) not null default 'specific'::character varying,
  general_task_id character varying(64) null,
  title character varying(255) not null,
  description text null,
  target_date date not null,
  status character varying(50) not null default 'pending'::character varying,
  completed_at timestamp with time zone null,
  employee_learnings text null,
  employee_feedback text null,
  supervisor_feedback text null,
  supervisor_accomplishment text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  prescribed_lms_id text null,
  constraint performance_tasks_pkey primary key (id),
  constraint performance_tasks_goal_id_fkey foreign KEY (goal_id) references performance_goals (id) on delete CASCADE,
  constraint performance_tasks_prescribed_lms_id_fkey foreign KEY (prescribed_lms_id) references lms_prescribed (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_perf_tasks_goal_id on public.performance_tasks using btree (goal_id) TABLESPACE pg_default;

create index IF not exists idx_perf_tasks_emp_id on public.performance_tasks using btree (employee_id) TABLESPACE pg_default;

create index IF not exists idx_perf_tasks_status on public.performance_tasks using btree (status) TABLESPACE pg_default;

create index IF not exists idx_perf_tasks_type on public.performance_tasks using btree (task_type) TABLESPACE pg_default;
