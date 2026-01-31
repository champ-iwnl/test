-- Create reward_transactions table
CREATE TABLE reward_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    checkpoint_val INTEGER NOT NULL,
    claimed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(player_id, checkpoint_val)
);