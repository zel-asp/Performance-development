create table public.role_based_accounts (
  id uuid not null default gen_random_uuid (),
  email character varying(255) not null,
  password_hash text not null,
  role character varying(50) not null default 'Employee'::character varying,
  status character varying(20) not null default 'Active'::character varying,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint role_based_accounts_pkey primary key (id),
  constraint role_based_accounts_email_key unique (email)
) TABLESPACE pg_default;

create index IF not exists idx_role_based_accounts_email on public.role_based_accounts using btree (email) TABLESPACE pg_default;

create index IF not exists idx_role_based_accounts_role on public.role_based_accounts using btree (role) TABLESPACE pg_default;

create index IF not exists idx_role_based_accounts_status on public.role_based_accounts using btree (status) TABLESPACE pg_default; 