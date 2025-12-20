import { QueryClient } from '@tanstack/react-query'

/**
 * Global QueryClient instance for TanStack Query
 * 
 * Configuration:
 * - staleTime: 20 seconds - Data is considered fresh for 20s
 * - gcTime: 5 minutes - Unused data stays in cache for 5min
 * - retry: 1 - Failed queries retry once before showing error
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 20, // 20 seconds
      gcTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})
