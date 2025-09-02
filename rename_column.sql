-- Script to rename the 'desc' column to 'description' in your existing database
-- Run this in your PostgreSQL database

-- Rename the column from 'desc' to 'description'
ALTER TABLE tasks RENAME COLUMN desc TO description;

-- Verify the change
\d tasks;
