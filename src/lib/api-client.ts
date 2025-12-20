import axios from 'axios'
import type { AxiosError, AxiosInstance } from 'axios'

/**
 * Base API URL - configure this based on your environment
 * In production, use environment variables
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

/**
 * Axios instance configured for API requests
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
})

/**
 * Request interceptor - Add auth tokens here if needed
 */
apiClient.interceptors.request.use(
  (config) => {
    // Example: Add auth token if available
    // const token = localStorage.getItem('auth_token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Response interceptor - Handle errors globally
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle common error scenarios
    if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 401:
          // Handle unauthorized - e.g., redirect to login
          console.error('Unauthorized access')
          break
        case 403:
          console.error('Forbidden access')
          break
        case 404:
          console.error('Resource not found')
          break
        case 500:
          console.error('Server error')
          break
        default:
          console.error('API error:', error.response.status)
      }
    } else if (error.request) {
      // Request made but no response
      console.error('No response from server')
    } else {
      // Error in request setup
      console.error('Request error:', error.message)
    }
    
    return Promise.reject(error)
  }
)
