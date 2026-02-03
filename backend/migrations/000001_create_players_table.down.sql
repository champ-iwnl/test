-- Drop players table
DROP TRIGGER IF EXISTS update_players_updated_at ON players;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP TABLE IF EXISTS players;