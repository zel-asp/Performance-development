create table public.departments (
  id character varying(100) not null default (extensions.uuid_generate_v4 ())::text,
  code character varying(30) null,
  name character varying(150) not null,
  description text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint departments_pkey primary key (id),
  constraint departments_code_key unique (code)
) TABLESPACE pg_default;

INSERT INTO "public"."departments" ("id", "code", "name", "description", "created_at", "updated_at") VALUES ('3726eda4-303f-44f1-b572-3dc7eaf1c115', null, 'Human Resources', null, '2026-08-27 19:59:07.533013+00', '2026-08-27 19:59:07.533013+00'), ('47514966-bb18-415a-9fa0-ae95fd3af976', null, 'Sales & Marketing', null, '2026-08-27 19:59:07.533013+00', '2026-08-27 19:59:07.533013+00'), ('505ff947-5c21-4f4a-a117-27d4d7dac341', null, 'Housekeeping', null, '2026-08-27 19:59:07.533013+00', '2026-08-27 19:59:07.533013+00'), ('543ce4b1-5fe7-4a2e-928b-a6a231c020c8', null, 'Food & Beverage', null, '2026-08-27 19:59:07.533013+00', '2026-08-27 19:59:07.533013+00'), ('5faaf16b-0110-4075-8c0b-0d5574a377f0', null, 'Kitchen', null, '2026-08-27 19:59:07.533013+00', '2026-08-27 19:59:07.533013+00'), ('67f88bfa-289e-4365-b985-5cf24b915198', null, 'Security', null, '2026-08-27 19:59:07.533013+00', '2026-08-27 19:59:07.533013+00'), ('8828aa21-6da6-427a-bd06-743606e27b1d', null, 'Engineering', null, '2026-08-27 19:59:07.533013+00', '2026-08-27 19:59:07.533013+00'), ('92ebfa72-fc2b-46e5-93d1-30bf73cd31bc', null, 'Finance', null, '2026-08-27 19:59:07.533013+00', '2026-08-27 19:59:07.533013+00'), ('967ff30a-61cf-4bda-a839-58439aaaa231', null, 'Front Office', null, '2026-08-27 19:59:07.533013+00', '2026-08-27 19:59:07.533013+00');