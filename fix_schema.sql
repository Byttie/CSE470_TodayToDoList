-- Fix the schema to work properly with the time management system
-- Run this in your PostgreSQL database

-- First, let's see what's in the time column currently
SELECT time FROM tasks LIMIT 5;

-- Change the time column from timestamp to numeric for hours
ALTER TABLE tasks ALTER COLUMN time TYPE NUMERIC(4,1) USING 1.0;

-- Add a created_at column for tracking when tasks were created
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing tasks to have a default created_at
UPDATE tasks SET created_at = NOW() WHERE created_at IS NULL;

-- Verify the changes
\d tasks;
