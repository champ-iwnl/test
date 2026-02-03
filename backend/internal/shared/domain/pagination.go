package domain

import (
	"encoding/base64"
	"fmt"
	"strings"
	"time"
)

// PaginationConfig holds pagination configuration
type PaginationConfig struct {
	DefaultLimit  int
	MaxLimit      int
	DefaultOffset int
}

// ========== Offset-based Pagination (Legacy) ==========

// PaginationParams holds pagination input
type PaginationParams struct {
	Limit  int
	Offset int
}

func NewPaginationParams(limit, offset int, cfg PaginationConfig) PaginationParams {
	// Apply defaults
	if limit <= 0 {
		limit = cfg.DefaultLimit
	}
	if limit > cfg.MaxLimit {
		limit = cfg.MaxLimit
	}
	if offset < 0 {
		offset = cfg.DefaultOffset
	}

	return PaginationParams{
		Limit:  limit,
		Offset: offset,
	}
}

// PaginatedResult holds paginated response
type PaginatedResult[T any] struct {
	Data   []T   `json:"data"`
	Total  int64 `json:"total"`
	Limit  int   `json:"limit"`
	Offset int   `json:"offset"`
}

func NewPaginatedResult[T any](data []T, total int64, params PaginationParams) PaginatedResult[T] {
	return PaginatedResult[T]{
		Data:   data,
		Total:  total,
		Limit:  params.Limit,
		Offset: params.Offset,
	}
}

// ========== Cursor-based Pagination ==========

// CursorParams holds cursor pagination input
type CursorParams struct {
	Limit  int
	Cursor string // base64 encoded: "created_at|id"
}

// CursorData holds decoded cursor values
type CursorData struct {
	CreatedAt time.Time
	ID        string
}

// NewCursorParams creates cursor params with defaults
func NewCursorParams(limit int, cursor string, cfg PaginationConfig) CursorParams {
	if limit <= 0 {
		limit = cfg.DefaultLimit
	}
	if limit > cfg.MaxLimit {
		limit = cfg.MaxLimit
	}

	return CursorParams{
		Limit:  limit,
		Cursor: cursor,
	}
}

// DecodeCursor decodes a cursor string into CursorData
func DecodeCursor(cursor string) (*CursorData, error) {
	if cursor == "" {
		return nil, nil
	}

	decoded, err := base64.StdEncoding.DecodeString(cursor)
	if err != nil {
		return nil, fmt.Errorf("invalid cursor format")
	}

	parts := strings.Split(string(decoded), "|")
	if len(parts) != 2 {
		return nil, fmt.Errorf("invalid cursor format")
	}

	createdAt, err := time.Parse(time.RFC3339Nano, parts[0])
	if err != nil {
		return nil, fmt.Errorf("invalid cursor timestamp")
	}

	return &CursorData{
		CreatedAt: createdAt,
		ID:        parts[1],
	}, nil
}

// EncodeCursor encodes CursorData into a cursor string
func EncodeCursor(createdAt time.Time, id string) string {
	raw := fmt.Sprintf("%s|%s", createdAt.Format(time.RFC3339Nano), id)
	return base64.StdEncoding.EncodeToString([]byte(raw))
}

// CursorResult holds cursor paginated response
type CursorResult[T any] struct {
	Data       []T    `json:"data"`
	NextCursor string `json:"next_cursor,omitempty"`
	HasMore    bool   `json:"has_more"`
}

func NewCursorResult[T any](data []T, nextCursor string, hasMore bool) CursorResult[T] {
	return CursorResult[T]{
		Data:       data,
		NextCursor: nextCursor,
		HasMore:    hasMore,
	}
}
