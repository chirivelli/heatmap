import { useQuery } from '@tanstack/react-query';
import type { Platform } from '@heatmap/api/types';
import { API_URL } from './client';

// API client functions
export const platformsApi = {
  getAll: async (): Promise<Platform[]> => {
    const response = await fetch(`${API_URL}/api/platforms`);
    if (!response.ok) throw new Error('Failed to fetch platforms');
    return response.json();
  },
};

// React Query hooks
export const usePlatforms = () => {
  return useQuery({
    queryKey: ['platforms'],
    queryFn: platformsApi.getAll,
  });
};
