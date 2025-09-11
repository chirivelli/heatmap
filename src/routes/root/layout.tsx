import { Outlet } from 'react-router'

import { NavBar } from '@/routes/root/NavBar'

export function RootLayout() {
  return (
    <div className='flex min-h-screen flex-col bg-gray-950 font-mono text-gray-100'>
      <NavBar />

      <div className='mx-auto w-7xl grow p-4'>
        <Outlet />
      </div>
    </div>
  )
}
