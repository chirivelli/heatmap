import { env } from '@/env'

// Shared API configuration
export const API_URL = env.VITE_API_URL

// Generic fetch wrapper with error handling
export async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || `Request failed with status ${response.status}`)
  }

  return response.json()
}
