import { UserButton } from '@clerk/clerk-react'

export function NavBar() {
  return (
    <div className='flex justify-between bg-gray-900 p-4'>
      <div>
        <a className='text-xl'>🔥 HeatMap</a>
      </div>

      <div>
        <UserButton />
      </div>
    </div>
  )
}
