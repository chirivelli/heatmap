import type { Endeavor, NewEndeavor } from '@heatmap/schema'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { API_URL } from './client'

// Type for endeavor with platform details
export type EndeavorWithPlatform = {
  userId: string
  username: string
  platformId: number
  platformTitle: string
  platformUrl: string
}

// API client functions
export const endeavorsApi = {
  getByUserIdWithPlatforms: async (userId: string): Promise<EndeavorWithPlatform[]> => {
    const response = await fetch(`${API_URL}/api/users/${userId}/endeavors/with-platforms`)
    if (!response.ok) throw new Error('Failed to fetch user endeavors with platforms')
    return response.json()
  },

  create: async (endeavor: NewEndeavor): Promise<Endeavor> => {
    const response = await fetch(`${API_URL}/api/users/${endeavor.userId}/endeavors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(endeavor),
    })
    if (!response.ok) throw new Error('Failed to create endeavor')
    return response.json()
  },

  delete: async (userId: string, platformId: number): Promise<Endeavor> => {
    const response = await fetch(`${API_URL}/api/users/${userId}/endeavors/${platformId}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete endeavor')
    return response.json()
  },
}

// React Query hooks
export const useUserEndeavorsWithPlatforms = (userId: string) => {
  return useQuery({
    queryKey: ['users', userId, 'endeavors', 'with-platforms'],
    queryFn: () => endeavorsApi.getByUserIdWithPlatforms(userId),
    enabled: !!userId,
  })
}

export const useCreateEndeavor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: endeavorsApi.create,
    onSuccess: (_endeavor, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['users', variables.userId, 'endeavors'],
      })
    },
  })
}

export const useDeleteEndeavor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, platformId }: { userId: string; platformId: number }) =>
      endeavorsApi.delete(userId, platformId),
    onSuccess: (_endeavor, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['users', variables.userId, 'endeavors'],
      })
    },
  })
}
