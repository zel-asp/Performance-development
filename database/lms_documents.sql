create table public.lms_documents (
  id character varying(100) not null default (extensions.uuid_generate_v4 ())::text,
  title character varying(255) not null,
  file_name character varying(255) not null,
  file_path text not null,
  file_type text not null,
  file_size bigint null,
  department_id character varying(100) null,
  category text not null,
  estimated_reading_minutes integer null,
  estimated_pages integer null,
  exp_reward integer not null default 20,
  description text null,
  learning_outcomes text null,
  status character varying(20) not null default 'Draft'::character varying,
  uploaded_by character varying(64) null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  manatory boolean null default false,
  constraint lms_documents_pkey primary key (id),
  constraint lms_documents_department_id_fkey foreign KEY (department_id) references departments (id) on delete set null,
  constraint lms_documents_status_check check (
    (
      (status)::text = any (
        (
          array[
            'Draft'::character varying,
            'Published'::character varying,
            'Archived'::character varying
          ]
        )::text[]
      )
    )
  )
) TABLESPACE pg_default;