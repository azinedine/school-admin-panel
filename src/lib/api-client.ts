import axios from 'axios'
import type { AxiosError, AxiosInstance } from 'axios'
import { useAuthStore } from '@/store/auth-store'

/**
 * Base API URL - configure this based on your environment
 * In production, use environment variables
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

/**
 * Axios instance configured for API requests
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
})

/**
 * Request interceptor - Add auth tokens here
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Define an auth object for authentication-related API calls
export const auth = {
  logout: async () => {
    return apiClient.post('/logout')
  },
  deleteUser: async () => {
    return apiClient.delete('/user')
  },
}

/**
 * Response interceptor - Handle errors globally
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle common error scenarios
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Token expired or invalid
          console.error('Unauthorized access - logging out')
          useAuthStore.getState().logout()
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
    }
    
    return Promise.reject(error)
  }
)
