import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react'
import { Outlet, createRootRoute } from '@tanstack/react-router'

import { useSyncUser } from '@/hooks/useSyncUser'
import { NavBar } from '@/components/NavBar'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  // Sync Clerk user to database when signed in
  useSyncUser()

  return (
    <>
      <SignedOut>
        <div className='flex min-h-screen items-center justify-center'>
          <SignIn></SignIn>
        </div>
      </SignedOut>

      <SignedIn>
        <div className='flex min-h-screen flex-col bg-black font-mono text-white'>
          <NavBar />

          <div className='mx-auto w-full max-w-7xl grow px-4 sm:px-6 lg:px-8'>
            <Outlet />
          </div>
        </div>
      </SignedIn>
    </>
  )
}

