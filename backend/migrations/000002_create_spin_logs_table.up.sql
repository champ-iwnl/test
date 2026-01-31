-- Create spin_logs table
CREATE TABLE spin_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    points_gained INTEGER NOT NULL CHECK (points_gained > 0),
    source VARCHAR(20) NOT NULL CHECK (source IN ('GAME', 'BONUS', 'ADMIN')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_spin_logs_player_id ON spin_logs(player_id);
CREATE INDEX idx_spin_logs_created_at ON spin_logs(created_at);