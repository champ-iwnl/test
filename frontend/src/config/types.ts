// =============================================================================
// Types สำหรับ App Configuration
// =============================================================================

// การตั้งค่าวงล้อหมุน
export interface SpinWheelSettings {
  duration: number
  easing: string
  speedPerFrame: number
  extraRotations: number
  pointerAngle: number
  jitterMaxAngle: number
  jitterEdgeBias: number
}

// การตั้งค่า UI
export interface UISettings {
  animationDuration: number
  toastDuration: number
  maxHistoryItems: number
}

// Config รวมทั้งหมด (จาก YAML)
export interface AppConfig {
  spinWheel: SpinWheelSettings
  ui: UISettings
}

// การตั้งค่า API (จาก .env)
export interface APISettings {
  url: string
  timeout: number
  retryCount: number
  retryDelay: number
}

// การตั้งค่าแอป (จาก .env)
export interface AppSettings {
  name: string
  description: string
  version: string
}

// การตั้งค่าหน้า Home (จาก .env)
export interface HomePageSettings {
  historyPageSize: number
  prefetchSize: number
}
