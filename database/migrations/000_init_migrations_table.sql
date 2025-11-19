-- Migration: Create migrations tracking table
-- Date: 2025-11-19
-- Description: Track applied migrations to prevent re-execution

-- Create migrations tracking table
CREATE TABLE IF NOT EXISTS pg_migrations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Display result
SELECT 
  'Migration tracking table created' as message,
  (SELECT COUNT(*) FROM pg_migrations) as migrations_count;
