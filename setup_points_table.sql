-- Create the points table for the reward system
-- This table stores user points and ranks

CREATE TABLE IF NOT EXISTS points (
    id INTEGER PRIMARY KEY,
    points INTEGER DEFAULT 0,
    rank VARCHAR(20) DEFAULT 'Bronze',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraint to link with users table (if it exists)
-- ALTER TABLE points ADD CONSTRAINT fk_points_user_id FOREIGN KEY (id) REFERENCES users(id);

-- Create an index on points for better performance
CREATE INDEX IF NOT EXISTS idx_points_points ON points(points);

-- Create an index on rank for better performance
CREATE INDEX IF NOT EXISTS idx_points_rank ON points(rank);

-- Add a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_points_updated_at 
    BEFORE UPDATE ON points 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional - remove if not needed)
-- INSERT INTO points (id, points, rank) VALUES (1, 0, 'Bronze') ON CONFLICT (id) DO NOTHING;
