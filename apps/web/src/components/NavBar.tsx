import { UserButton } from '@clerk/clerk-react'

export function NavBar() {
  return (
    <div className='flex min-w-0 items-center justify-between border-b border-gray-900 bg-black px-4 py-3 sm:px-6 sm:py-4'>
      <div className='min-w-0'>
        <a className='flex min-w-0 items-center gap-2 text-lg text-white transition-colors hover:text-gray-300 sm:text-xl'>
          <img src='/brand/heatmap-logo.png' alt='' className='size-7 shrink-0 rounded-md' />
          <span className='truncate font-bold'>HeatMap</span>
        </a>
      </div>

      <div className='shrink-0'>
        <UserButton />
      </div>
    </div>
  )
}
