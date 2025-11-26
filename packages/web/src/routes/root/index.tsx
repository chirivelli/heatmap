import { Activity } from '@/routes/root/(heatmap)/Activity'
import { usePlatforms } from '@/api/platforms'
import { useUser } from '@clerk/clerk-react'
import {
  useUserEndeavorsWithPlatforms,
  useCreateEndeavor,
} from '@/api/endeavors'

export function IndexPage() {
  const { user } = useUser()

  const { data: platforms } = usePlatforms()
  const { data: endeavors, refetch } = useUserEndeavorsWithPlatforms(
    user?.id ?? '',
  )
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
    <div className='grid gap-4'>
      <div className='mx-auto w-full max-w-2xl border border-gray-900 bg-black p-4 sm:p-6'>
        <form
          action={formAction}
          className='flex flex-col gap-3 sm:flex-row sm:gap-4'
        >
          <select
            defaultValue='Platform'
            className='w-full border border-gray-800 bg-black px-3 py-2 text-white focus:border-gray-600 focus:outline-none sm:w-auto sm:min-w-[140px]'
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
            className='w-full flex-1 border border-gray-800 bg-black px-3 py-2 text-white placeholder-gray-500 focus:border-gray-600 focus:outline-none sm:min-w-[120px]'
          />

          <button
            type='submit'
            className='w-full border border-gray-800 bg-black px-4 py-2 text-white transition-colors hover:border-gray-600 sm:w-auto sm:px-6'
          >
            + Add
          </button>
        </form>
      </div>

      {/* {JSON.stringify(endeavors, null, 2)} */}
      {endeavors?.map((e) => (
        <div
          className='overflow-x-auto'
          key={[e.userId, e.platformTitle].join('-')}
        >
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
