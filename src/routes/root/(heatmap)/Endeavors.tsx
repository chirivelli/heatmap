import { Heatmap } from '@/components/Heatmap'
import { useEndeavorQuery } from '@/db/useEndeavorQuery'

export function Endeavors() {
  const { data } = useEndeavorQuery()
  return (
    <div className='grid gap-4'>
      {/* {JSON.stringify(data, null, 1)} */}
      {data?.map((e) => (
        <div key={[e.user_id, e.platform].join('-')}>
          <Heatmap username={e.username ?? ''} platform={e.platform ?? ''} />
        </div>
      ))}
    </div>
  )
}
