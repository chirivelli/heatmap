import { Navigate } from 'react-router'
import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react'

export function Root() {
  return (
    <div>
      <div className='flex min-h-screen items-center justify-center'>
        <SignedOut>
          <SignIn />
        </SignedOut>
      </div>

      <SignedIn>
        <Navigate to={'app'} />
      </SignedIn>
    </div>
  )
}
