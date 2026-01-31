package migrations

import (
	"context"
	"fmt"
	"log"

	"backend/internal/infrastructure/config"

	"gorm.io/gorm"
)

// Seeder handles database seeding
type Seeder struct {
	db     *gorm.DB
	config *config.Config
}

// NewSeeder creates a new seeder instance
func NewSeeder(db *gorm.DB, cfg *config.Config) *Seeder {
	return &Seeder{
		db:     db,
		config: cfg,
	}
}

// SeedRewardConfig seeds the reward_config table with data from YAML config
func (s *Seeder) SeedRewardConfig(ctx context.Context) error {
	log.Println("[Seeder] Starting reward config seeding...")

	if len(s.config.Rewards.Checkpoints) == 0 {
		log.Println("[Seeder] No reward checkpoints configured, skipping seed")
		return nil
	}

	// Use raw SQL for upsert to handle conflicts
	for _, checkpoint := range s.config.Rewards.Checkpoints {
		query := `
			INSERT INTO reward_config (checkpoint_val, reward_name, reward_description, created_at)
			VALUES ($1, $2, $3, NOW())
			ON CONFLICT (checkpoint_val)
			DO UPDATE SET
				reward_name = EXCLUDED.reward_name,
				reward_description = EXCLUDED.reward_description
		`

		if err := s.db.Exec(query, checkpoint.CheckpointVal, checkpoint.RewardName, checkpoint.RewardDescription).Error; err != nil {
			return fmt.Errorf("failed to seed checkpoint %d: %w", checkpoint.CheckpointVal, err)
		}

		log.Printf("[Seeder] ✓ Seeded checkpoint: %d - %s", checkpoint.CheckpointVal, checkpoint.RewardName)
	}

	log.Printf("[Seeder] ✓ Successfully seeded %d reward checkpoints", len(s.config.Rewards.Checkpoints))
	return nil
}

// SeedAll runs all seeders
func (s *Seeder) SeedAll(ctx context.Context) error {
	if err := s.SeedRewardConfig(ctx); err != nil {
		return fmt.Errorf("reward config seeding failed: %w", err)
	}

	log.Println("[Seeder] ✓ All seeding completed successfully")
	return nil
}
