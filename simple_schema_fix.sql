-- Simple fix: Add new columns without modifying existing ones
-- Run this in your PostgreSQL database

-- Add a new column for time in hours (numeric)
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS time_hours NUMERIC(4,1) DEFAULT 1.0;

-- Add a created_at column for tracking when tasks were created
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing tasks to have default values
UPDATE tasks SET 
    time_hours = COALESCE(time_hours, 1.0),
    created_at = COALESCE(created_at, NOW())
WHERE time_hours IS NULL OR created_at IS NULL;

-- Verify the changes
\d tasks;
