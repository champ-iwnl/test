// =============================================================================
// Config from Environment Variables
// ดึงค่า settings จาก .env file
// =============================================================================

import { APISettings, AppSettings, HomePageSettings } from './types'

/**
 * ดึง API config จาก environment variables
 * ค่า default จะใช้เมื่อไม่มีการตั้งค่าใน .env
 */
export function getAPIConfig(): APISettings {
  const url = process.env.NEXT_PUBLIC_API_URL || ''
  console.log('NEXT_PUBLIC_API_URL:', url) // Debug
  return {
    url,
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000', 10),
    retryCount: parseInt(process.env.NEXT_PUBLIC_API_RETRY_COUNT || '3', 10),
    retryDelay: parseInt(process.env.NEXT_PUBLIC_API_RETRY_DELAY || '1000', 10),
  }
}

/**
 * ดึง App config จาก environment variables
 */
export function getAppSettings(): AppSettings {
  return {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Spin Game',
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'หมุนวงล้อลุ้นรางวัล',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  }
}

/**
 * ดึง Home Page config จาก environment variables
 */
export function getHomePageConfig(): HomePageSettings {
  return {
    historyPageSize: parseInt(process.env.NEXT_PUBLIC_HISTORY_PAGE_SIZE || '10', 10),
    prefetchSize: parseInt(process.env.NEXT_PUBLIC_PREFETCH_SIZE || '5', 10),
  }
}
