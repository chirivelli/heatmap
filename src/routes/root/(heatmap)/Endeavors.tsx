import { Heatmap } from '@/routes/root/(heatmap)/Heatmap'
import { useEndeavorQuery } from '@/db/useEndeavorQuery'

export function Endeavors() {
  const { data } = useEndeavorQuery()
  return (
    <>
      {/* {JSON.stringify(data, null, 1)} */}
      {data?.map((e) => (
        <div key={[e.user_id, e.platform].join('-')}>
          <Heatmap username={e.username ?? ''} platform={e.platform ?? ''} />
        </div>
      ))}
    </>
  )
}
