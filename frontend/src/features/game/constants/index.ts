// Spin wheel configuration
export const SPIN_CONFIG = {
  speedPerFrame: 26,
  settleDuration: 1800,
  extraRotations: 3,
  pointerAngle: 270,
  jitterMaxAngle: 44,
  jitterEdgeBias: 0.85,
} as const

// Segment center angles for each point value
export const SEGMENT_CENTER_ANGLES: Record<number, number> = {
  1000: 315,
  500: 45,
  3000: 135,
  300: 225,
}

// Available segments on the wheel
export const WHEEL_SEGMENTS = [300, 1000, 500, 3000] as const

export type WheelSegment = (typeof WHEEL_SEGMENTS)[number]

// Game error messages
export const GAME_MESSAGES = {
  spinError: 'เกิดข้อผิดพลาด กรุณาลองใหม่',
  dailyLimitReached: 'หมุนครบจำนวนวันนี้แล้ว',
  notAuthenticated: 'กรุณาเข้าสู่ระบบก่อน',
} as const
