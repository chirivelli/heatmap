import { UserButton } from '@clerk/clerk-react'

import fire from '@/asssets/fire-emoji.png'

export function NavBar() {
  return (
    <div className='flex justify-between bg-gray-900 p-4'>
      <div>
        <a className='flex items-end text-xl'>
          <img src={fire} alt='pixelated flame emoji' className='size-8' />
          <span>HeatMap</span>
        </a>
      </div>

      <div>
        <UserButton />
      </div>
    </div>
  )
}
