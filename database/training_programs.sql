create table public.training_programs (
  id character varying(100) not null default (extensions.uuid_generate_v4 ())::text,
  title character varying(250) not null,
  category character varying(100) not null,
  category_type character varying(50) not null default 'skill_gap'::character varying,
  dept character varying(100) not null,
  target_competency character varying(150) null,
  competency_key character varying(50) null,
  duration character varying(50) not null,
  format character varying(100) not null,
  trainer_type character varying(100) not null default 'Internal Trainer'::character varying,
  passing_score integer null default 80,
  xp_award integer null default 150,
  icon character varying(50) null default 'fa-graduation-cap'::character varying,
  badge_color character varying(30) null default 'terracotta'::character varying,
  description text null,
  modules jsonb null default '[]'::jsonb,
  quiz_questions jsonb null default '[]'::jsonb,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint training_programs_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists idx_tp_dept on public.training_programs using btree (dept) TABLESPACE pg_default;