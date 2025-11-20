
-- Migration: Create translation management tables
-- Date: 2025-11-20
-- Description: Add tables for tracking translation operations and statistics

-- Create translation_operations table
CREATE TABLE IF NOT EXISTS translation_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  operation_type VARCHAR(50) NOT NULL CHECK (operation_type IN ('upload', 'download', 'verify', 'sync', 'fetch')),
  status VARCHAR(50) NOT NULL CHECK (status IN ('success', 'failed', 'partial')),
  keys_count INTEGER DEFAULT 0,
  languages_count INTEGER DEFAULT 2,
  namespaces TEXT[], -- Array of namespaces processed
  error_message TEXT,
  duration_ms INTEGER,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create translation_keys_stats table
CREATE TABLE IF NOT EXISTS translation_keys_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_keys INTEGER NOT NULL DEFAULT 0,
  translated_keys INTEGER NOT NULL DEFAULT 0,
  empty_keys INTEGER NOT NULL DEFAULT 0,
  error_keys INTEGER NOT NULL DEFAULT 0,
  language VARCHAR(10) NOT NULL,
  namespace VARCHAR(50) NOT NULL,
  last_sync_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(language, namespace)
);

-- Create translation_errors table
CREATE TABLE IF NOT EXISTS translation_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_name VARCHAR(255) NOT NULL,
  language VARCHAR(10) NOT NULL,
  namespace VARCHAR(50) NOT NULL,
  error_type VARCHAR(50) NOT NULL CHECK (error_type IN ('empty', 'missing', 'invalid', 'duplicate')),
  error_details TEXT,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_translation_operations_user_id ON translation_operations(user_id);
CREATE INDEX IF NOT EXISTS idx_translation_operations_type ON translation_operations(operation_type);
CREATE INDEX IF NOT EXISTS idx_translation_operations_created_at ON translation_operations(created_at);
CREATE INDEX IF NOT EXISTS idx_translation_keys_stats_language ON translation_keys_stats(language);
CREATE INDEX IF NOT EXISTS idx_translation_keys_stats_namespace ON translation_keys_stats(namespace);
CREATE INDEX IF NOT EXISTS idx_translation_errors_resolved ON translation_errors(resolved);
CREATE INDEX IF NOT EXISTS idx_translation_errors_language ON translation_errors(language);

-- Create trigger for updated_at
CREATE TRIGGER update_translation_keys_stats_updated_at BEFORE UPDATE ON translation_keys_stats
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Display result
SELECT 
  'Migration 004 completed successfully' as message,
  (SELECT COUNT(*) FROM translation_operations) as operations_count,
  (SELECT COUNT(*) FROM translation_keys_stats) as stats_count,
  (SELECT COUNT(*) FROM translation_errors) as errors_count;
