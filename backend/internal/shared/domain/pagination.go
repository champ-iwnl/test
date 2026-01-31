package domain

// PaginationConfig holds pagination configuration
type PaginationConfig struct {
    DefaultLimit int
    MaxLimit     int
    DefaultOffset int
}

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