import { useEndeavorQuery } from '@/db/useEndeavorQuery'
import { useSupabaseClient } from '@/db/useSupabaseClient'
import { Heatmap } from './(heatmap)/Heatmap'

export function IndexPage() {
  const client = useSupabaseClient()

  const { data, refetch } = useEndeavorQuery()

  async function formAction(formData: FormData) {
    const platform_id = parseInt(formData.get('platform_id') as string)
    const username = formData.get('username') as string

    const res = await client.from('endeavors').insert({
      platform_id,
      username,
    })

    refetch()

    console.log(res)
  }

  return (
    <div className='grid gap-4'>
      <div className='mx-auto bg-gray-900 p-4'>
        <form action={formAction} className='flex flex-nowrap gap-4'>
          <select
            defaultValue='Platform'
            className='min-w-50 bg-gray-800 p-2'
            name='platform_id'
          >
            <option disabled={true}>Platform</option>
            <option value={1}>GitHub</option>
            <option value={2}>LeetCode</option>
            <option value={3}>BootDev</option>
          </select>

          <input
            name='username'
            type='text'
            placeholder='username'
            className='min-w-50 bg-gray-800 p-2'
          />

          <button type='submit' className='bg-gray-800 p-2'>
            + Add
          </button>
        </form>
      </div>

      {/* {JSON.stringify(data, null, 1)} */}
      {data?.map((e) => (
        <div key={[e.user_id, e.platform].join('-')}>
          <Heatmap username={e.username ?? ''} platform={e.platform ?? ''} />
        </div>
      ))}
    </div>
  )
}
