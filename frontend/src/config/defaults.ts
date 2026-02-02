// =============================================================================
// ค่า Default สำหรับ Config (ใช้เมื่อโหลด YAML ไม่สำเร็จ)
// =============================================================================

import { AppConfig } from './types'

export const DEFAULT_CONFIG: AppConfig = {
  spinWheel: {
    duration: 2200,
    easing: 'cubic-bezier(0.15, 0.85, 0.2, 1)',
    speedPerFrame: 26,
    extraRotations: 3,
    pointerAngle: 270,
    jitterMaxAngle: 44,
    jitterEdgeBias: 0.85,
  },
  ui: {
    animationDuration: 300,
    toastDuration: 3000,
    maxHistoryItems: 100,
  },
}
