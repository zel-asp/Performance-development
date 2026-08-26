-- 1. Create Performance General Tasks Table (Master templates managed by Supervisor)
CREATE TABLE IF NOT EXISTS public.performance_general_tasks (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Operational Excellence',
    target_days_offset INT NOT NULL DEFAULT 7,
    weight VARCHAR(50) DEFAULT 'Standard',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Performance Concrete Tasks Table (Assigned to goals & employees)
CREATE TABLE IF NOT EXISTS public.performance_tasks (
    id VARCHAR(64) PRIMARY KEY,
    goal_id BIGINT NULL,
    employee_id VARCHAR(64) NOT NULL,
    task_type VARCHAR(20) NOT NULL DEFAULT 'specific', -- 'general' or 'specific'
    general_task_id VARCHAR(64) NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    target_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed'
    completed_at TIMESTAMP WITH TIME ZONE NULL,
    employee_learnings TEXT NULL,
    employee_feedback TEXT NULL,
    supervisor_feedback TEXT NULL,
    supervisor_accomplishment TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT performance_tasks_goal_id_fkey
        FOREIGN KEY (goal_id)
        REFERENCES public.performance_goals (id)
        ON DELETE CASCADE
);

-- 3. Create Indexes
CREATE INDEX IF NOT EXISTS idx_perf_tasks_goal_id ON public.performance_tasks(goal_id);
CREATE INDEX IF NOT EXISTS idx_perf_tasks_emp_id ON public.performance_tasks(employee_id);
CREATE INDEX IF NOT EXISTS idx_perf_tasks_status ON public.performance_tasks(status);
CREATE INDEX IF NOT EXISTS idx_perf_tasks_type ON public.performance_tasks(task_type);
