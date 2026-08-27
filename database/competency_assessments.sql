create table public.competency_assessments (
  id character varying(100) not null default (extensions.uuid_generate_v4 ())::text,
  employee_id character varying(64) not null,
  competency_id character varying(100) not null,
  score numeric(3, 2) not null default 0.00,
  comments text null,
  assessed_by character varying(64) null,
  assessment_date timestamp with time zone not null default now(),
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint competency_assessments_pkey primary key (id),
  constraint competency_assessments_competency_id_fkey foreign KEY (competency_id) references competencies (id) on delete CASCADE
) TABLESPACE pg_default;