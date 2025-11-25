import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Endeavor, NewEndeavor } from '@heatmap/api/types';
import { API_URL } from './client';

// Type for endeavor with platform details
export type EndeavorWithPlatform = {
  userId: string;
  username: string;
  platformId: number;
  platformTitle: string;
  platformUrl: string;
};

// API client functions
export const endeavorsApi = {
  getByUserIdWithPlatforms: async (userId: string): Promise<EndeavorWithPlatform[]> => {
    const response = await fetch(`${API_URL}/api/endeavors/user/${userId}/with-platforms`);
    if (!response.ok) throw new Error('Failed to fetch user endeavors with platforms');
    return response.json();
  },

  create: async (endeavor: NewEndeavor): Promise<Endeavor> => {
    const response = await fetch(`${API_URL}/api/endeavors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(endeavor),
    });
    if (!response.ok) throw new Error('Failed to create endeavor');
    return response.json();
  },

  delete: async (userId: string, platformId: number): Promise<Endeavor> => {
    const response = await fetch(`${API_URL}/api/endeavors/${userId}/${platformId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete endeavor');
    return response.json();
  },
};

// React Query hooks
export const useUserEndeavorsWithPlatforms = (userId: string) => {
  return useQuery({
    queryKey: ['endeavors', 'user', userId, 'with-platforms'],
    queryFn: () => endeavorsApi.getByUserIdWithPlatforms(userId),
    enabled: !!userId,
  });
};

export const useCreateEndeavor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: endeavorsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['endeavors'] });
    },
  });
};

export const useDeleteEndeavor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, platformId }: { userId: string; platformId: number }) =>
      endeavorsApi.delete(userId, platformId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['endeavors'] });
    },
  });
};
