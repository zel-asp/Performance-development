CREATE TABLE public.lms_documents (
    id varchar(100) NOT NULL
        DEFAULT (extensions.uuid_generate_v4())::text,

    title varchar(255) NOT NULL,

    file_name varchar(255) NOT NULL,

    file_path text NOT NULL,

    file_type varchar(50) NOT NULL,

    file_size bigint NULL,

    department_id varchar(100) NULL,

    category varchar(100) NOT NULL,

    estimated_reading_minutes integer NULL,

    estimated_pages integer NULL,

    exp_reward integer NOT NULL DEFAULT 20,

    description text NULL,

    learning_outcomes text NULL,

    status varchar(20) NOT NULL DEFAULT 'Draft'
        CHECK (status IN ('Draft', 'Published', 'Archived')),

    uploaded_by varchar(64) NULL,

    created_at timestamptz NOT NULL DEFAULT now(),

    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT lms_documents_pkey PRIMARY KEY (id),

    CONSTRAINT lms_documents_department_id_fkey
        FOREIGN KEY (department_id)
        REFERENCES public.departments(id)
        ON DELETE SET NULL
);