create table public.notifications (
  id character varying(100) not null default (extensions.uuid_generate_v4 ())::text,
  recipient_role character varying(50) not null,
  user_id character varying(100) null,
  type character varying(50) not null,
  title character varying(255) not null,
  message text not null,
  related_id character varying(100) null,
  is_read boolean null default false,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  goal_id integer null,
  constraint notifications_pkey primary key (id),
  constraint notifications_goal_id_fkey foreign KEY (goal_id) references performance_goals (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_notifications_recipient on public.notifications using btree (recipient_role, is_read) TABLESPACE pg_default;

create index IF not exists idx_notifications_user_id on public.notifications using btree (user_id, is_read) TABLESPACE pg_default;