import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { User, NewUser } from '@/db/types';
import { API_URL } from './client';

// API client functions
export const usersApi = {
  getById: async (id: string): Promise<User> => {
    const response = await fetch(`${API_URL}/api/users/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('User not found (404)');
      }
      throw new Error('Failed to fetch user');
    }
    return response.json();
  },

  create: async (user: NewUser): Promise<User> => {
    const response = await fetch(`${API_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  },
};

// React Query hooks
export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
