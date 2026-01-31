import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
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
