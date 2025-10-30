import { UserButton } from '@clerk/clerk-react'

export function NavBar() {
  return (
    <div className='flex items-center justify-between border-b border-gray-900 bg-black px-4 py-3 sm:px-6 sm:py-4'>
      <div>
        <a className='flex items-end text-lg text-white transition-colors hover:text-gray-300 sm:text-xl'>
          <span className='font-bold'>HeatMap</span>
        </a>
      </div>

      <div>
        <UserButton />
      </div>
    </div>
  )
}
