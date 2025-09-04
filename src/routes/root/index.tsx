import { Heatmap } from '@/components/Heatmap'
import { useEndeavorQuery } from '@/db/useEndeavorQuery'

export function IndexPage() {
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
        {/* {JSON.stringify(data, null, 1)} */}
        {data?.map((e, i) => (
          <div key={[e.user_id, e.platform].join('-')}>
            <Heatmap username={e.username ?? ''} platform={e.platform ?? ''} />
          </div>
        ))}
      </div>
    </div>
  )
}
