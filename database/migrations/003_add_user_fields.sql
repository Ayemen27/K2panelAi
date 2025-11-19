-- Migration: Add missing user fields to match GraphQL schema
-- Date: 2025-11-19
-- Description: Add username, firstName, lastName, avatarUrl, isActive fields to users table

-- Add missing columns to users table
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS username VARCHAR(255) UNIQUE,
  ADD COLUMN IF NOT EXISTS first_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS last_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Create index for username lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Display result
SELECT 
  'Migration 003 completed successfully' as message,
  (SELECT COUNT(*) FROM users) as users_count;
