import { useEndeavorQuery } from '@/hooks/useEndeavorQuery'

export function Home() {
  const { data, refetch } = useEndeavorQuery()

  return (
    <div className='mx-auto grid gap-4'>
      <div className='card card-dash bg-base-100 w-full'>
        <div className='card-body items-center'>
          <h2 className='card-title'>Track your Heatmaps!</h2>

          <p>Connect a Platform to start tracking</p>

          <div className='card-actions flex-nowrap'>
            <select defaultValue='Pick a Platform' className='select'>
              <option disabled={true}>Pick a platform</option>
              <option value={'GitHub'}>GitHub</option>
              <option value={'LeetCode'}>LeetCode</option>
              <option value={'BootDev'}>BootDev</option>
            </select>

            <input type='text' placeholder='username' className='input' />

            <button className='btn btn-primary' onClick={() => refetch()}>
              + Add
            </button>
          </div>
        </div>
      </div>

      <div className='grid gap-4'>
        {/* {JSON.stringify(data)} */}
        {data?.map((e) => (
          <div key={e.created_at} className='card bg-base-100'>
            {e.platform_id} {e.username}  
          </div>
        ))}
      </div>
    </div>
  )
}
