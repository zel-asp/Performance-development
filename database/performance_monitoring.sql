DROP TABLE IF EXISTS public.performance_monitoring CASCADE;

CREATE TABLE public.performance_monitoring (
    id character varying(64) NOT NULL,
    goal_id bigint NULL,
    employee_id character varying(64) NULL,
    milestone_title character varying(255) NOT NULL,
    actual_metric character varying(255) NOT NULL,
    progress integer NOT NULL DEFAULT 85,
    accomplishments text NULL,
    challenges text NULL,
    feedback text NULL,
    supporting_evidence text NULL,
    supervisor_notes text NULL,
    created_at timestamp with time zone NULL DEFAULT now(),
    updated_at timestamp with time zone NULL DEFAULT now(),

    CONSTRAINT performance_monitoring_pkey
        PRIMARY KEY (id),

    CONSTRAINT performance_monitoring_employee_id_fkey
        FOREIGN KEY (employee_id)
        REFERENCES public.users (id)
        ON DELETE CASCADE,

    CONSTRAINT performance_monitoring_goal_id_fkey
        FOREIGN KEY (goal_id)
        REFERENCES public.performance_goals (id)
        ON DELETE CASCADE
) TABLESPACE pg_default;