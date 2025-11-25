# API Hooks

This folder contains TanStack Query hooks for interacting with the Heatmap API.

## Structure

- `client.ts` - Shared API configuration and utilities
- `users.ts` - User-related API hooks
- `platforms.ts` - Platform-related API hooks
- `endeavors.ts` - Endeavor-related API hooks
- `index.ts` - Main entry point (exports all hooks)

## Usage

Import hooks from the main entry point:

```tsx
import { useUsers, usePlatforms, useUserEndeavorsWithPlatforms } from '@web/api';
```

## Available Hooks

### Users

- `useUsers()` - Get all users
- `useUser(id)` - Get user by ID
- `useCreateUser()` - Create a new user

### Platforms

- `usePlatforms()` - Get all platforms
- `usePlatform(id)` - Get platform by ID
- `useCreatePlatform()` - Create a new platform

### Endeavors

- `useEndeavors()` - Get all endeavors
- `useUserEndeavors(userId)` - Get endeavors for a specific user
- `useUserEndeavorsWithPlatforms(userId)` - Get endeavors with platform details (joined data)
- `useCreateEndeavor()` - Create a new endeavor

## Example

```tsx
import { useUserEndeavorsWithPlatforms, usePlatforms } from '@web/api';

function UserDashboard({ userId }: { userId: string }) {
  const { data: endeavors, isLoading } = useUserEndeavorsWithPlatforms(userId);
  const { data: platforms } = usePlatforms();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {endeavors?.map((endeavor) => (
        <div key={`${endeavor.userId}-${endeavor.platformId}`}>
          <h3>{endeavor.platformTitle}</h3>
          <p>Username: {endeavor.username}</p>
          <a href={endeavor.platformUrl}>Visit Platform</a>
        </div>
      ))}
    </div>
  );
}
```
