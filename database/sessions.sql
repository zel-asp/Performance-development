create table if not exists public.sessions (
  id uuid not null default gen_random_uuid (),
  user_id character varying(100) not null,
  session_token text not null,
  expires_at timestamp with time zone not null,
  ip_address inet null,
  user_agent text null,
  created_at timestamp with time zone not null default now(),
  is_active boolean null default true,
  email character varying(255) null,
  hr_employee_name character varying(100) null,
  remember_me boolean null default false,
  expires_at_remember timestamp with time zone null,
  updated_at timestamp with time zone null,
  constraint sessions_pkey primary key (id),
  constraint sessions_session_token_key unique (session_token),
  constraint unique_email_per_session unique (email),
  constraint sessions_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_sessions_user_id on public.sessions using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_sessions_session_token on public.sessions using btree (session_token) TABLESPACE pg_default;

create index IF not exists idx_sessions_expires_at on public.sessions using btree (expires_at) TABLESPACE pg_default;

create unique INDEX IF not exists idx_sessions_unique_active_email on public.sessions using btree (email) TABLESPACE pg_default
where
  (is_active = true);

create index IF not exists idx_sessions_email on public.sessions using btree (email) TABLESPACE pg_default;