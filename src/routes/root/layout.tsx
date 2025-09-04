import { Outlet } from 'react-router'
import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react'
import { NavBar } from '@/routes/root/NavBar'

export function RootLayout() {
  return (
    <>
      <SignedOut>
        <div className='flex min-h-screen items-center justify-center'>
          <SignIn />
        </div>
      </SignedOut>

      <SignedIn>
        <div className='bg-base-200 flex min-h-screen flex-col'>
          <NavBar />

          <div className='mx-auto w-7xl grow p-4'>
            <Outlet />
          </div>
        </div>
      </SignedIn>
    </>
  )
}
