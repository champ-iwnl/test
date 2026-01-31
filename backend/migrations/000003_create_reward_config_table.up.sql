-- Create reward_config table
CREATE TABLE reward_config (
    id SERIAL PRIMARY KEY,
    checkpoint_val INTEGER UNIQUE NOT NULL,
    reward_name VARCHAR(100) NOT NULL,
    reward_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);