import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react'
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
        <div className='relative min-h-screen overflow-hidden bg-black font-mono text-white'>
          <div className='absolute inset-y-0 right-0 hidden w-[72%] lg:block'>
            <img
              src='/landing/heatmap-hero.png'
              alt=''
              aria-hidden='true'
              className='h-full w-full object-cover object-[64%_center] opacity-95'
            />
            <div className='absolute inset-0 bg-[linear-gradient(90deg,#000_0%,rgba(0,0,0,0.62)_10%,rgba(0,0,0,0.16)_30%,rgba(0,0,0,0.18)_100%)]' />
            <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.3)_0%,transparent_32%,rgba(0,0,0,0.2)_100%)]' />
          </div>
          <img
            src='/landing/heatmap-hero.png'
            alt=''
            aria-hidden='true'
            className='absolute inset-0 h-full w-full object-cover object-[70%_center] opacity-35 lg:hidden'
          />
          <div className='absolute inset-0 bg-[linear-gradient(90deg,#000_0%,rgba(0,0,0,0.98)_30%,rgba(0,0,0,0.68)_47%,rgba(0,0,0,0.04)_76%,rgba(0,0,0,0.16)_100%)]' />
          <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.34)_0%,transparent_30%,rgba(0,0,0,0.26)_100%)]' />

          <header className='relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8'>
            <a className='flex items-center gap-2 text-xl font-bold tracking-tight text-white'>
              <img src='/brand/heatmap-logo.png' alt='' className='size-8 rounded-md' />
              <span>HeatMap</span>
            </a>

            <SignInButton mode='modal'>
              <button className='border border-gray-700 bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-gray-200 focus:border-emerald-400 focus:outline-none'>
                Sign in
              </button>
            </SignInButton>
          </header>

          <main className='relative z-10 mx-auto flex min-h-[calc(100vh-84px)] w-full max-w-7xl items-center px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pb-16'>
            <section className='max-w-2xl'>
              <div className='mb-5 inline-flex border border-emerald-900/80 bg-emerald-950/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200'>
                Unified activity tracking
              </div>

              <h1 className='max-w-3xl text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl'>
                One heatmap for every coding grind.
              </h1>

              <p className='mt-6 max-w-xl text-base leading-7 text-gray-300 sm:text-lg'>
                Track GitHub, LeetCode, and Codeforces progress in one focused dashboard. Add a profile,
                switch years, and keep your streaks visible without bouncing between tabs.
              </p>

              <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
                <SignInButton mode='modal'>
                  <button className='border border-emerald-600 bg-emerald-500 px-5 py-3 text-sm font-bold text-black transition-colors hover:bg-emerald-400 focus:border-emerald-200 focus:outline-none'>
                    Start tracking
                  </button>
                </SignInButton>

                <SignInButton mode='modal'>
                  <button className='border border-gray-800 bg-gray-950 px-5 py-3 text-sm font-semibold text-gray-100 transition-colors hover:border-gray-600 hover:bg-gray-900 focus:border-gray-500 focus:outline-none'>
                    Connect profiles
                  </button>
                </SignInButton>
              </div>

              <dl className='mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-gray-900 pt-6'>
                <div>
                  <dt className='text-2xl font-black text-white'>3</dt>
                  <dd className='mt-1 text-xs text-gray-400'>platforms</dd>
                </div>
                <div>
                  <dt className='text-2xl font-black text-white'>365</dt>
                  <dd className='mt-1 text-xs text-gray-400'>daily cells</dd>
                </div>
                <div>
                  <dt className='text-2xl font-black text-white'>1</dt>
                  <dd className='mt-1 text-xs text-gray-400'>dashboard</dd>
                </div>
              </dl>
            </section>
          </main>
        </div>
      </SignedOut>

      <SignedIn>
        <div className='flex min-h-screen min-w-0 flex-col overflow-x-hidden bg-black font-mono text-white'>
          <NavBar />

          <div className='mx-auto min-w-0 w-full max-w-7xl grow px-4 sm:px-6 lg:px-8'>
            <Outlet />
          </div>
        </div>
      </SignedIn>
    </>
  )
}
