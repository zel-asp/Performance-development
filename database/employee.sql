do not use the json file, hardcoded data, or static data use the data in the database:
create table public.employees (
  id character varying(100) not null default (extensions.uuid_generate_v4 ())::text,
  employee_code character varying(50) null,
  full_name character varying(150) not null,
  email character varying(150) null,
  role character varying(50) null default 'Associate'::character varying,
  title character varying(100) null,
  department_id character varying(100) null,
  avatar_url text null,
  current_level integer null default 1,
  total_xp integer null default 0,
  status character varying(30) null default 'Active'::character varying,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint employees_pkey primary key (id),
  constraint employees_email_key unique (email),
  constraint employees_employee_code_key unique (employee_code),
  constraint employees_department_id_fkey foreign KEY (department_id) references departments (id) on delete set null
) TABLESPACE pg_default;