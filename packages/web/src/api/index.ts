// Export all API hooks and functions from a single entry point

// Client configuration
export { API_URL, apiRequest } from './client';

// Users
export {
  usersApi,
  useUser,
  useCreateUser,
} from './users';

// Platforms
export {
  platformsApi,
  usePlatforms,
} from './platforms';

// Endeavors
export {
  endeavorsApi,
  useUserEndeavorsWithPlatforms,
  useCreateEndeavor,
  useDeleteEndeavor,
} from './endeavors';

// Re-export types
export type { User, NewUser, Platform, NewPlatform, Endeavor, NewEndeavor } from '@heatmap/api/types';
export type { EndeavorWithPlatform } from './endeavors';
