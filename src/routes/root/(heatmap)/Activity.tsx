import { useQuery } from '@tanstack/react-query'
import { Grid } from '@/routes/root/(heatmap)/Grid'
import { useProvider } from '@/providers/useProvider'
import type { ActivityDataPoint } from '@/providers/heatmap'
import { remove } from '@/db/endeavors'
import { useSupabase } from '@/db/SupabaseProvider'

type HeatMapProps = {
  username: string
  platform: string
  platform_id: number
  refetch: any
}

export function Activity({
  username,
  platform,
  platform_id,
  refetch,
}: HeatMapProps) {
  const provider = useProvider(platform)
  const supabase = useSupabase()

  const { data, isFetching, isError, error, isSuccess } = useQuery<
    ActivityDataPoint[]
  >({
    queryKey: ['heatmap', platform, username.trim()],
    queryFn: async () => provider.fetchData(username.trim()),
    staleTime: 1000 * 60 * 5,
  })

  return (
    <div className='max-w-8xl mx-auto flex justify-between bg-gray-900'>
      <div className='p-6'>
        {isFetching && (
          <div className='p-8 text-center'>
            <div className='inline-flex items-center px-4 py-2 leading-6 font-semibold text-blue-600'>
              <svg
                className='mr-3 -ml-1 h-5 w-5 animate-spin text-blue-600'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
              Fetching data ...
            </div>
          </div>
        )}

        {!isFetching && Array.isArray(data) && data.length > 0 && (
          <div>
            <div className='mb-4'>
              <h2 className='mb-2 text-xl font-semibold text-gray-100'>
                {username}'s Activity on {platform}
              </h2>
              <p className='text-gray-200'>
                Total contributions:{' '}
                {data.reduce((sum, point) => sum + point.count, 0)}
              </p>
            </div>

            <div className='overflow-x-auto'>
              <Grid
                data={data}
                onCellClick={(date: string, count: number) => {
                  console.log(`Clicked on ${date}: ${count} contributions`)
                  // You can add more detailed tooltips or modals here
                }}
              />
            </div>
          </div>
        )}

        {!isFetching &&
          !isError &&
          isSuccess &&
          Array.isArray(data) &&
          data.length === 0 &&
          username && (
            <div className='rounded-lg bg-white p-8 text-center'>
              <div className='text-gray-500'>
                <p className='text-lg'>No data found for "{username}"</p>
                <p className='mt-2 text-sm'>
                  Try a different username or platform
                </p>
              </div>
            </div>
          )}

        {isError && error && (
          <div className='border border-red-200 bg-red-50 p-4'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <svg
                  className='h-5 w-5 text-red-400'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-red-800'>Error</h3>
                <div className='mt-2 text-sm text-red-700'>{error.message}</div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className='p-6'>
        <button
          className='cursor-pointer'
          onClick={async () => {
            await remove(supabase, platform_id, username)
            refetch()
          }}
        >
          Delete
        </button>
      </div>
    </div>
  )
}
