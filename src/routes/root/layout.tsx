import { Outlet } from 'react-router'
import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react'

export function RootLayout() {
  return (
    <div>
      <SignedOut>
        <div className='flex min-h-screen items-center justify-center'>
          <SignIn />
        </div>
      </SignedOut>

      <SignedIn>
        <Outlet />
      </SignedIn>
    </div>
  )
}

import { UserButton } from '@clerk/clerk-react'

export function NavBar() {
  return (
    <div className='navbar bg-base-100 shadow-sm'>
      <div className='flex-1'>
        <a className='btn btn-ghost text-xl'>🔥 HeatMap</a>
      </div>

      <div className='flex-none'>
        <UserButton />
      </div>
    </div>
  )
}
