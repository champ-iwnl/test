package domain

import (
	"errors"

	"backend/internal/infrastructure/config"
)

// SpinDistributionItem represents a weighted outcome
type SpinDistributionItem struct {
	Points int
	Weight int
}

// SpinDistribution encapsulates weighted random logic
type SpinDistribution struct {
	items       []SpinDistributionItem
	totalWeight int
}

// NewSpinDistribution creates from config
func NewSpinDistribution(items []config.SpinDistributionItem) (*SpinDistribution, error) {
	if len(items) == 0 {
		return nil, errors.New("distribution must have at least one item")
	}

	dist := &SpinDistribution{
		items: make([]SpinDistributionItem, len(items)),
	}

	for i, item := range items {
		if item.Points <= 0 || item.Weight <= 0 {
			return nil, errors.New("points and weight must be positive")
		}
		dist.items[i] = SpinDistributionItem{
			Points: item.Points,
			Weight: item.Weight,
		}
		dist.totalWeight += item.Weight
	}

	return dist, nil
}

// Items returns copy of distribution items
func (d *SpinDistribution) Items() []SpinDistributionItem {
	result := make([]SpinDistributionItem, len(d.items))
	copy(result, d.items)
	return result
}

// TotalWeight returns sum of all weights
func (d *SpinDistribution) TotalWeight() int {
	return d.totalWeight
}
