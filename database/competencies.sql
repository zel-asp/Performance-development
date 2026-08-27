create table public.competencies (
  id character varying(100) not null default (extensions.uuid_generate_v4 ())::text,
  key character varying(50) not null,
  name character varying(150) not null,
  category character varying(100) not null,
  department_id character varying(100) null,
  description text null,
  benchmark_score numeric(3, 2) null default 4.50,
  max_score numeric(3, 2) null default 5.00,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  scope character varying(20) not null default 'General'::character varying,
  position character varying(150) null,
  constraint competencies_pkey primary key (id),
  constraint competencies_key_key unique (key),
  constraint competencies_department_id_fkey foreign KEY (department_id) references departments (id) on delete set null,
  constraint competencies_scope_check check (
    (
      (scope)::text = any (
        (
          array[
            'General'::character varying,
            'Specific'::character varying
          ]
        )::text[]
      )
    )
  )
) TABLESPACE pg_default;