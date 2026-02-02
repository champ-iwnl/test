import axios from 'axios'
import { getAPIConfig } from '@/config'

// ดึง API config จาก .env
const apiConfig = getAPIConfig()

const api = axios.create({
  baseURL: apiConfig.url,
  timeout: apiConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config

    // Retry logic
    if (!config._retryCount) {
      config._retryCount = 0
    }

    if (config._retryCount < apiConfig.retryCount && !error.response) {
      config._retryCount++
      await new Promise((resolve) => setTimeout(resolve, apiConfig.retryDelay))
      return api(config)
    }

    // Handle specific error cases if needed
    if (error.response) {
      // Server responded with error code
      console.error('API Error:', error.response.data)
    } else {
      // Network error
      console.error('Network Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default api
