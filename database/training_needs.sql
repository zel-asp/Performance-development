create table public.training_needs (
  id character varying(100) not null default (extensions.uuid_generate_v4 ())::text,
  need_code character varying(50) null,
  title character varying(250) not null,
  source_type character varying(50) not null,
  source_label character varying(50) null,
  category character varying(100) not null,
  dept character varying(100) not null,
  department_id character varying(100) null,
  employee_id character varying(100) null,
  associate_name character varying(150) null,
  associate_role character varying(100) null,
  associate_avatar text null,
  target_competency_id character varying(100) null,
  target_competency character varying(150) null,
  competency_key character varying(50) null,
  current_score numeric(3, 2) null,
  required_score numeric(3, 2) null,
  gap numeric(3, 2) null,
  urgency character varying(20) null default 'High'::character varying,
  status character varying(30) null default 'Identified'::character varying,
  linked_program_id character varying(100) null,
  date_identified character varying(50) null,
  notes text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  target_goal_id character varying null,
  constraint training_needs_pkey primary key (id),
  constraint training_needs_department_id_fkey foreign KEY (department_id) references departments (id) on delete set null,
  constraint training_needs_employee_id_fkey foreign KEY (employee_id) references employees (id) on delete CASCADE,
  constraint training_needs_target_competency_id_fkey foreign KEY (target_competency_id) references competencies (id) on delete set null,
  constraint training_needs_target_goal_id_fkey foreign KEY (target_goal_id) references performance_goals (id) on update CASCADE on delete CASCADE,
  constraint training_needs_source_type_check check (
    (
      (source_type)::text = any (
        (
          array[
            'competency_gap'::character varying,
            'compliance'::character varying
          ]
        )::text[]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_tn_dept on public.training_needs using btree (dept) TABLESPACE pg_default;

create index IF not exists idx_tn_status on public.training_needs using btree (status) TABLESPACE pg_default;