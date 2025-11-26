import { useEffect, useRef } from 'react'
import { useUser as useClerkUser } from '@clerk/clerk-react'
import { useUser, useCreateUser } from '@/api/users'

/**
 * Hook to sync Clerk user with the database
 * Automatically creates the user in the database if they don't exist
 */
export function useSyncUser() {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useClerkUser()
  const createUser = useCreateUser()
  const syncedRef = useRef(false)

  // Try to fetch user from database
  const { data: dbUser, isError, error } = useUser(clerkUser?.id ?? '')

  useEffect(() => {
    // Only proceed if Clerk is loaded and we have a user ID
    if (!isClerkLoaded || !clerkUser?.id) {
      return
    }

    // If we already synced, don't do it again
    if (syncedRef.current) {
      return
    }

    // If user exists in database, we're done
    if (dbUser) {
      syncedRef.current = true
      return
    }

    // If there's an error and it's a 404 (user not found), create the user
    if (isError && error) {
      const errorMessage = error.message.toLowerCase()
      if (errorMessage.includes('not found') || errorMessage.includes('404')) {
        createUser.mutate(
          {
            id: clerkUser.id,
            name: clerkUser.fullName || clerkUser.username || null,
          },
          {
            onSuccess: () => {
              console.log('User synced to database:', clerkUser.id)
              syncedRef.current = true
            },
            onError: (err) => {
              console.error('Failed to sync user to database:', err)
            },
          }
        )
      }
    }
  }, [isClerkLoaded, clerkUser, dbUser, isError, error, createUser])

  return {
    isLoaded: isClerkLoaded,
    clerkUser,
    dbUser,
    isSyncing: createUser.isPending,
  }
}
