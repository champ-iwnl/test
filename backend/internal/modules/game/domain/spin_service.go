package domain

import (
	"math/rand"
	"time"

	shared "backend/internal/shared/domain"
)

// RandomGenerator interface for testability
type RandomGenerator interface {
	Intn(n int) int
}

// DefaultRandomGenerator uses math/rand
type DefaultRandomGenerator struct {
	rng *rand.Rand
}

// NewDefaultRandomGenerator creates a new random generator
func NewDefaultRandomGenerator() *DefaultRandomGenerator {
	return &DefaultRandomGenerator{
		rng: rand.New(rand.NewSource(time.Now().UnixNano())),
	}
}

// Intn returns a random int
func (g *DefaultRandomGenerator) Intn(n int) int {
	return g.rng.Intn(n)
}

// SpinDomainService handles spin logic
type SpinDomainService struct {
	distribution *SpinDistribution
	randomGen    RandomGenerator
}

// NewSpinDomainService creates a new spin service
func NewSpinDomainService(dist *SpinDistribution, rng RandomGenerator) *SpinDomainService {
	return &SpinDomainService{
		distribution: dist,
		randomGen:    rng,
	}
}

// Spin performs weighted random selection
// Algorithm: Cumulative distribution
// Example: [300:40, 500:35, 1000:20, 3000:5] → total=100
// Random=30 → 30-40<0 → return 300
// Random=50 → 50-40=10, 10-35<0 → return 500
// Random=80 → 80-40=40, 40-35=5, 5-20<0 → return 1000
// Random=99 → 99-40=59, 59-35=24, 24-20=4, 4-5<0 → return 3000
func (s *SpinDomainService) Spin() (*shared.Points, error) {
	random := s.randomGen.Intn(s.distribution.TotalWeight())

	for _, item := range s.distribution.Items() {
		random -= item.Weight
		if random < 0 {
			return shared.NewPoints(item.Points)
		}
	}

	// Fallback to last item (edge case)
	lastIdx := len(s.distribution.Items()) - 1
	return shared.NewPoints(s.distribution.Items()[lastIdx].Points)
}
