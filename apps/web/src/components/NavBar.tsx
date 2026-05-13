import { UserButton } from '@clerk/clerk-react'

export function NavBar() {
  return (
    <div className='flex items-center justify-between border-b border-gray-900 bg-black px-4 py-3 sm:px-6 sm:py-4'>
      <div>
        <a className='flex items-center gap-2 text-lg text-white transition-colors hover:text-gray-300 sm:text-xl'>
          <img src='/brand/heatmap-logo.png' alt='' className='size-7 rounded-md' />
          <span className='font-bold'>HeatMap</span>
        </a>
      </div>

      <div>
        <UserButton />
      </div>
    </div>
  )
}
