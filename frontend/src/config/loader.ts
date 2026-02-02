// =============================================================================
// Config Loader - โหลด YAML config ครั้งเดียวตอนเริ่ม app
// =============================================================================

import yaml from 'js-yaml'
import { AppConfig } from './types'
import { DEFAULT_CONFIG } from './defaults'

// Cache สำหรับเก็บ config (singleton)
let cachedConfig: AppConfig | null = null
let configPromise: Promise<AppConfig> | null = null

/**
 * โหลด config จาก YAML file (client-side)
 * ใช้ fetch เพื่อดึงไฟล์จาก public folder
 */
async function fetchConfig(): Promise<AppConfig> {
  try {
    const response = await fetch('/config/app.yaml')
    if (!response.ok) {
      throw new Error(`Failed to fetch config: ${response.status}`)
    }
    const yamlText = await response.text()
    const config = yaml.load(yamlText) as AppConfig

    // Validate และ merge กับ default config
    return mergeWithDefaults(config)
  } catch (error) {
    console.error('Failed to load app config, using defaults:', error)
    return DEFAULT_CONFIG
  }
}

/**
 * Merge config กับ default values เพื่อให้มั่นใจว่ามีค่าครบ
 */
function mergeWithDefaults(config: Partial<AppConfig>): AppConfig {
  return {
    spinWheel: { ...DEFAULT_CONFIG.spinWheel, ...config.spinWheel },
    ui: { ...DEFAULT_CONFIG.ui, ...config.ui },
  }
}

/**
 * โหลด config แบบ async (ใช้ครั้งแรกตอนเริ่ม app)
 * - โหลดแค่ครั้งเดียว แล้ว cache ไว้
 * - ถ้าเรียกซ้ำจะได้ config จาก cache
 */
export async function loadConfig(): Promise<AppConfig> {
  // ถ้ามี cache แล้ว return ทันที
  if (cachedConfig) {
    return cachedConfig
  }

  // ถ้ากำลังโหลดอยู่ รอ promise เดิม
  if (configPromise) {
    return configPromise
  }

  // โหลดใหม่
  configPromise = fetchConfig().then((config) => {
    cachedConfig = config
    configPromise = null
    return config
  })

  return configPromise
}

/**
 * ดึง config แบบ sync (ใช้หลังจากโหลดแล้ว)
 * - ถ้ายังไม่โหลด จะ return default config
 */
export function getConfig(): AppConfig {
  return cachedConfig || DEFAULT_CONFIG
}

/**
 * ตรวจสอบว่า config โหลดแล้วหรือยัง
 */
export function isConfigLoaded(): boolean {
  return cachedConfig !== null
}
