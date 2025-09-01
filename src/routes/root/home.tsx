import { useSession } from '@clerk/clerk-react'
import { createClient } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'

export function Home() {
  const { session } = useSession()

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_PROJ_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
      accessToken: async () => session?.getToken() ?? null,
    },
  )

  const { data, refetch } = useQuery<any>({
    queryKey: ['endeavors'],
    queryFn: () => supabase.from('endeavors').select(),
  })

  return (
    <div className='mx-auto flex flex-col gap-4'>
      <div className='card card-dash bg-base-100 w-full'>
        <div className='card-body items-center'>
          <h2 className='card-title'>Track your Heatmaps!</h2>

          <p>Connect a Platform to start tracking</p>

          <div className='card-actions flex-nowrap'>
            <select
              defaultValue='Pick a Platform'
              className='select'
              // onChange={(e) => setProvider(e.target.value)}
            >
              <option disabled={true}>Pick a platform</option>
              <option value={'GitHub'}>GitHub</option>
              <option value={'LeetCode'}>LeetCode</option>
              <option value={'BootDev'}>BootDev</option>
            </select>

            <input
              type='text'
              placeholder='username'
              className='input'
              // onChange={(e) => setUsername(e.target.value)}
            />

            <button className='btn btn-primary' onClick={() => refetch()}>
              Connect
            </button>
          </div>
        </div>
      </div>

      <div className='grid gap-4'>
        {/* {JSON.stringify(data?.data)} */}
        {data?.data.map(
          (e: {
            created_at: string
            username: string
            platform_id: number
          }) => (
            <div key={e.created_at} className='card bg-base-100'>
              {e.platform_id} {e.username}
            </div>
          ),
        )}
      </div>
    </div>
  )
}
