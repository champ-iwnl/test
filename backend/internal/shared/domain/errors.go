package domain

import "errors"

// Domain-level errors
var (
    ErrPlayerNotFound     = errors.New("player not found")
    ErrInsufficientPoints = errors.New("insufficient points")
    ErrAlreadyClaimed     = errors.New("reward already claimed")
    ErrDailyLimitExceeded = errors.New("daily spin limit exceeded")
    ErrInvalidCheckpoint  = errors.New("invalid checkpoint value")
    ErrInvalidNickname    = errors.New("invalid nickname")
    ErrNegativePoints     = errors.New("points cannot be negative")
)

// DomainError wraps errors with code
type DomainError struct {
    Code    string
    Message string
    Err     error
}

func (e *DomainError) Error() string {
    if e.Err != nil {
        return e.Message + ": " + e.Err.Error()
    }
    return e.Message
}

func (e *DomainError) Unwrap() error {
    return e.Err
}

func NewDomainError(code string, message string, err error) *DomainError {
    return &DomainError{
        Code:    code,
        Message: message,
        Err:     err,
    }
}