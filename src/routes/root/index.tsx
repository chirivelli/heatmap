import { useEndeavorQuery } from '@/db/useEndeavorQuery'
import { useSupabaseClient } from '@/db/useSupabaseClient'
import { usePlatformQuery } from '@/db/usePlatformQuery'
import { Heatmap } from '@/routes/root/(heatmap)/Heatmap'

export function IndexPage() {
  const client = useSupabaseClient()

  const { data: endeavors, refetch } = useEndeavorQuery()
  const { data: platforms } = usePlatformQuery()

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
            className='min-w-50 bg-gray-800 p-2'
          />

          <button type='submit' className='bg-gray-800 p-2'>
            + Add
          </button>
        </form>
      </div>

      {/* {JSON.stringify(data, null, 1)} */}
      {endeavors?.map((e) => (
        <div key={[e.user_id, e.platform].join('-')}>
          <Heatmap username={e.username ?? ''} platform={e.platform ?? ''} />
        </div>
      ))}
    </div>
  )
}
