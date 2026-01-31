package constants

// SpinSource represents origin of points
type SpinSource string

const (
    SpinSourceGame  SpinSource = "GAME"
    SpinSourceBonus SpinSource = "BONUS"
    SpinSourceAdmin SpinSource = "ADMIN"
)

func (s SpinSource) IsValid() bool {
    switch s {
    case SpinSourceGame, SpinSourceBonus, SpinSourceAdmin:
        return true
    }
    return false
}