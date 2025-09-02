-- SQL script to update the tasks table with new columns
-- Run this script in your PostgreSQL database to add the new columns

-- Add new columns to the tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high'));
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS time DECIMAL(4,1) DEFAULT 1.0;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing tasks with default values if they don't have these columns
UPDATE tasks SET 
    description = COALESCE(description, ''),
    priority = COALESCE(priority, 'medium'),
    time = COALESCE(time, 1.0),
    created_at = COALESCE(created_at, NOW())
WHERE description IS NULL OR priority IS NULL OR time IS NULL OR created_at IS NULL;

-- Create an index for better performance on user queries
CREATE INDEX IF NOT EXISTS idx_tasks_user_created ON tasks(id, created_at DESC);

-- Display the updated table structure
\d tasks;
