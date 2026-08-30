create table public.otp_codes (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  code_hash text not null,
  expires_at timestamp with time zone not null,
  used_at timestamp with time zone null,
  created_at timestamp with time zone not null default now(),
  attempts integer null default 0,
  email character varying(255) null,
  employee_name character varying(100) null,
  constraint otp_codes_pkey primary key (id),
  constraint otp_codes_user_id_created_at_key unique (user_id, created_at)
) TABLESPACE pg_default;