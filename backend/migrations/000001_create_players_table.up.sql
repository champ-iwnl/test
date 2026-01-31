-- Create players table
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nickname VARCHAR(50) UNIQUE NOT NULL,
    total_points INTEGER NOT NULL DEFAULT 0 CHECK (total_points >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create trigger to update updated_at on row changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_players_updated_at
    BEFORE UPDATE ON players
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();