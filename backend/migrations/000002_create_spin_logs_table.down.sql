-- Drop spin_logs table
DROP INDEX IF EXISTS idx_spin_logs_created_at;
DROP INDEX IF EXISTS idx_spin_logs_player_id;
DROP TABLE IF EXISTS spin_logs;