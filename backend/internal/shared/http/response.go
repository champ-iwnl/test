package http

import (
	"github.com/gofiber/fiber/v2"

	"backend/internal/shared/constants"
)

// Response is the standard API response format
type Response struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   *ErrorBody  `json:"error,omitempty"`
}

type ErrorBody struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

// Helper functions
func Success(c *fiber.Ctx, status int, data interface{}) error {
	return c.Status(status).JSON(Response{
		Success: true,
		Data:    data,
	})
}

func Created(c *fiber.Ctx, data interface{}) error {
	return Success(c, constants.StatusCreated, data)
}

func Error(c *fiber.Ctx, status int, code string, message string) error {
	return c.Status(status).JSON(Response{
		Success: false,
		Error: &ErrorBody{
			Code:    code,
			Message: message,
		},
	})
}

func BadRequest(c *fiber.Ctx, code string, message string) error {
	return Error(c, constants.StatusBadRequest, code, message)
}

func NotFound(c *fiber.Ctx, code string, message string) error {
	return Error(c, constants.StatusNotFound, code, message)
}

func Conflict(c *fiber.Ctx, code string, message string) error {
	return Error(c, constants.StatusConflict, code, message)
}

func TooManyRequests(c *fiber.Ctx, code string, message string) error {
	return Error(c, constants.StatusTooManyRequests, code, message)
}

func InternalError(c *fiber.Ctx, message string) error {
	return Error(c, constants.StatusInternalServerError, constants.ErrCodeValidationFailed, message)
}
