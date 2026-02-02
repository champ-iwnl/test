'use client'

// =============================================================================
// Config Provider - React Context สำหรับ App Config
// โหลด config ครั้งเดียวตอนเริ่ม app แล้วแชร์ให้ทั้ง app ใช้
// =============================================================================

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { AppConfig } from './types'
import { DEFAULT_CONFIG } from './defaults'
import { loadConfig, getConfig, isConfigLoaded } from './loader'

// Context
const ConfigContext = createContext<AppConfig>(DEFAULT_CONFIG)

// Loading state context
const ConfigLoadingContext = createContext<boolean>(true)

interface ConfigProviderProps {
  children: ReactNode
}

/**
 * ConfigProvider - Wrap app ด้วย provider นี้เพื่อให้ทุก component เข้าถึง config ได้
 * - โหลด YAML config ครั้งเดียวตอน mount
 * - แสดง loading state ระหว่างโหลด
 */
export function ConfigProvider({ children }: ConfigProviderProps) {
  const [config, setConfig] = useState<AppConfig>(
    // ถ้าโหลดแล้ว ใช้ค่าจาก cache ทันที
    isConfigLoaded() ? getConfig() : DEFAULT_CONFIG
  )
  const [isLoading, setIsLoading] = useState(!isConfigLoaded())

  useEffect(() => {
    // ถ้าโหลดแล้ว ไม่ต้องโหลดใหม่
    if (isConfigLoaded()) {
      setConfig(getConfig())
      setIsLoading(false)
      return
    }

    // โหลด config ครั้งเดียว
    loadConfig().then((loadedConfig) => {
      setConfig(loadedConfig)
      setIsLoading(false)
    })
  }, [])

  return (
    <ConfigContext.Provider value={config}>
      <ConfigLoadingContext.Provider value={isLoading}>
        {children}
      </ConfigLoadingContext.Provider>
    </ConfigContext.Provider>
  )
}

/**
 * Hook สำหรับดึง config ทั้งหมด
 */
export function useConfig(): AppConfig {
  return useContext(ConfigContext)
}

/**
 * Hook สำหรับดึง config เฉพาะส่วน spinWheel
 */
export function useSpinWheelConfig() {
  const config = useContext(ConfigContext)
  return config.spinWheel
}

/**
 * Hook สำหรับดึง config เฉพาะส่วน ui
 */
export function useUIConfig() {
  const config = useContext(ConfigContext)
  return config.ui
}

/**
 * Hook สำหรับตรวจสอบว่า config โหลดเสร็จแล้วหรือยัง
 */
export function useConfigLoading(): boolean {
  return useContext(ConfigLoadingContext)
}
