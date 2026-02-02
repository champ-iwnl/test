# Build stage
FROM golang:1.25-alpine AS builder
WORKDIR /src

# Install git for fetching modules if needed
RUN apk add --no-cache git

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Build the API binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /app/spin-api ./cmd/api

# Final stage
FROM alpine:3.18
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app

# Copy binary and necessary static files
COPY --from=builder /app/spin-api /app/spin-api
COPY --from=builder /src/configs /app/configs
COPY --from=builder /src/migrations /app/migrations
COPY --from=builder /src/.env /app/.env

EXPOSE 3001

USER app
ENTRYPOINT ["/app/spin-api"]
