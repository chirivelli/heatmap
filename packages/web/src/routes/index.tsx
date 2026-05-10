import { useUser } from '@clerk/clerk-react'
import { createFileRoute } from '@tanstack/react-router'

import { useCreateEndeavor, useUserEndeavorsWithPlatforms } from '@/api/endeavors'
import { usePlatforms } from '@/api/platforms'
import { Activity } from '@/components/heatmap/Activity'

export const Route = createFileRoute('/')({
  component: IndexPage,
})

function IndexPage() {
  const { user } = useUser()

  const { data: platforms } = usePlatforms()
  const { data: endeavors, refetch } = useUserEndeavorsWithPlatforms(user?.id ?? '')
  const createEndeavor = useCreateEndeavor()

  async function formAction(formData: FormData) {
    const platform_id = parseInt(formData.get('platform_id') as string)
    const username = formData.get('username') as string

    if (!user?.id) {
      console.error('User ID is required')
      return
    }

    try {
      const res = await createEndeavor.mutateAsync({
        userId: user.id,
        platformId: platform_id,
        username: username,
      })
      refetch()
      console.log(res)
    } catch (error) {
      console.error('Failed to create endeavor:', error)
    }
  }

  return (
    <div className='grid gap-6 py-6'>
      <div className='mx-auto w-full max-w-3xl px-4 sm:px-6'>
        <form
          action={formAction}
          className='flex flex-col gap-2 border border-gray-800 bg-gray-950/60 p-2 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:flex-row sm:items-center'
        >
          <select
            defaultValue='Platform'
            className='h-11 w-full border border-gray-800 bg-black px-3 text-sm font-medium text-white transition-colors focus:border-gray-500 focus:outline-none sm:w-44'
            name='platform_id'
          >
            <option disabled={true}>Platform</option>
            {platforms?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>

          <input
            name='username'
            type='text'
            placeholder='username'
            className='h-11 w-full flex-1 border border-gray-800 bg-black px-3 text-sm text-white placeholder-gray-500 transition-colors focus:border-gray-500 focus:outline-none sm:min-w-64'
          />

          <button
            type='submit'
            className='h-11 w-full border border-emerald-800 bg-emerald-950 px-5 text-sm font-semibold text-emerald-100 transition-colors hover:border-emerald-600 hover:bg-emerald-900 focus:border-emerald-500 focus:outline-none sm:w-auto'
          >
            + Add
          </button>
        </form>
      </div>

      {/* {JSON.stringify(endeavors, null, 2)} */}
      {endeavors?.map((e) => (
        <div className='overflow-x-auto' key={[e.userId, e.platformTitle].join('-')}>
          <Activity
            userId={e.userId ?? ''}
            username={e.username ?? ''}
            platform={e.platformTitle ?? ''}
            platform_id={e.platformId ?? 0}
            refetch={refetch}
          />
        </div>
      ))}
    </div>
  )
}
