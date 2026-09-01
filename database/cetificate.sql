create table public.certificates (
  id character varying(100) not null default (extensions.uuid_generate_v4 ())::text,
  certificate_number character varying(100) not null,
  employee_id character varying(100) not null,
  program_id character varying(100) null,
  evaluation_id character varying(100) null,
  associate_name character varying(150) not null,
  program_title character varying(250) not null,
  category character varying(100) null,
  dept character varying(100) null,
  score integer not null,
  issue_date character varying(50) null,
  gm_signature character varying(150) null default 'General Manager, Oxford Suites'::character varying,
  verification_seal_code character varying(150) not null,
  created_at timestamp with time zone null default now(),
  constraint certificates_pkey primary key (id),
  constraint certificates_certificate_number_key unique (certificate_number),
  constraint certificates_employee_id_fkey foreign KEY (employee_id) references employees (id) on delete CASCADE,
  constraint certificates_evaluation_id_fkey foreign KEY (evaluation_id) references training_evaluations (id) on delete set null,
  constraint certificates_program_id_fkey foreign KEY (program_id) references training_programs (id) on delete set null
) TABLESPACE pg_default;

create index IF not exists idx_cert_num on public.certificates using btree (certificate_number) TABLESPACE pg_default;