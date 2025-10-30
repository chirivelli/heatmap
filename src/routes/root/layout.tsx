import { Outlet } from 'react-router'

import { NavBar } from '@/routes/root/NavBar'

export function RootLayout() {
  return (
    <div className='flex min-h-screen flex-col bg-black font-mono text-white'>
      <NavBar />

      <div className='mx-auto w-full max-w-7xl grow px-4 sm:px-6 lg:px-8'>
        <Outlet />
      </div>
    </div>
  )
}
