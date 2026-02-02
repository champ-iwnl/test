// =============================================================================
// Config Module - Export ทุกอย่างที่เกี่ยวกับ Config
// =============================================================================

// Types
export type {
  AppConfig,
  SpinWheelSettings,
  UISettings,
  APISettings,
  AppSettings,
  HomePageSettings,
} from './types'

// Default values
export { DEFAULT_CONFIG } from './defaults'

// Loader functions
export { loadConfig, getConfig, isConfigLoaded } from './loader'

// Env config functions (API, App, HomePage)
export { getAPIConfig, getAppSettings, getHomePageConfig } from './env'

// React Provider และ Hooks
export {
  ConfigProvider,
  useConfig,
  useSpinWheelConfig,
  useUIConfig,
  useConfigLoading,
} from './ConfigProvider'
