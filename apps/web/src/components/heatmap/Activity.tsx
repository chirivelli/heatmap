import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import type { ActivityDataPoint } from '@/providers/heatmap.types'

import { useDeleteEndeavor } from '@/api/endeavors'
import { Grid } from '@/components/heatmap/Grid'
import { YearNavigation } from '@/components/heatmap/YearNavigation'
import { DotmSquare5 } from '@/components/ui/dotm-square-5'
import { useProvider } from '@/providers/useProvider'

type HeatMapProps = {
  userId: string
  username: string
  platform: string
  platform_id: number
  refetch: any
}

export function Activity({ userId, username, platform, platform_id, refetch }: HeatMapProps) {
  const provider = useProvider(platform)
  const currentYear = new Date().getFullYear()
  const deleteEndeavor = useDeleteEndeavor()

  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
  const [minYear, setMinYear] = useState<number>(currentYear)
  const [maxYear, setMaxYear] = useState<number>(currentYear)

  const { data, isFetching, isError, error, isSuccess } = useQuery<ActivityDataPoint[]>({
    queryKey: ['heatmap', platform, username.trim(), selectedYear],
    queryFn: async () => provider.fetchData(username.trim(), selectedYear),
    staleTime: 1000 * 60 * 5,
  })

  // Detect available years from initial fetch (fetch all years to discover range)
  const { data: allYearsData } = useQuery<ActivityDataPoint[]>({
    queryKey: ['heatmap-years', platform, username.trim()],
    queryFn: async () => provider.fetchData(username.trim()),
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  })

  useEffect(() => {
    if (allYearsData && allYearsData.length > 0) {
      const years = new Set<number>()
      allYearsData.forEach((point) => {
        const year = new Date(point.date).getFullYear()
        years.add(year)
      })

      const yearArray = Array.from(years).sort((a, b) => a - b)
      if (yearArray.length > 0) {
        const min = yearArray[0]
        const max = yearArray[yearArray.length - 1]
        setMinYear(min)
        setMaxYear(Math.max(max, currentYear)) // Ensure current year is always selectable
      }
    }
  }, [allYearsData, currentYear])

  // Handle year change
  const handleYearChange = (year: number) => {
    setSelectedYear(year)
  }

  // Use data as-is since provider already filters by year
  const filteredData = data || []
  const hasNoData =
    !isError &&
    isSuccess &&
    allYearsData &&
    Array.isArray(allYearsData) &&
    allYearsData.length === 0 &&
    username

  // Get date range for selected year
  const startDate = new Date(selectedYear, 0, 1)
  const endDate = new Date(selectedYear, 11, 31) // Always show full year

  return (
    <div className='mx-auto w-full max-w-6xl border border-gray-900 bg-black'>
      <div className='flex flex-col gap-4 p-4 sm:p-6'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <div className='inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-900 px-3 py-1.5'>
            <span className='text-sm font-medium text-white'>{platform}</span>
            <span className='text-xs text-gray-500'>/</span>
            <span className='text-sm font-medium text-gray-300'>{username}</span>
          </div>

          <div className='flex items-center gap-2'>
            <YearNavigation
              selectedYear={selectedYear}
              minYear={minYear}
              maxYear={maxYear}
              onYearChange={handleYearChange}
            />

            <button
              className='inline-flex items-center gap-1 rounded-full border border-red-900 bg-red-950 px-3 py-1.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-900 hover:text-red-300'
              onClick={async () => {
                try {
                  await deleteEndeavor.mutateAsync({
                    userId,
                    platformId: platform_id,
                  })
                  refetch()
                } catch (error) {
                  console.error('Failed to delete endeavor:', error)
                }
              }}
              aria-label='Delete this endeavor'
            >
              Delete
            </button>
          </div>
        </div>

        {isFetching ? (
          <div className='flex min-h-37.5 items-center justify-center py-8'>
            <div className='inline-flex items-center gap-3 px-4 py-2 font-semibold text-white'>
              <DotmSquare5 ariaLabel='Fetching data' size={32} dotSize={4} speed={1.2} bloom />
              Fetching data ...
            </div>
          </div>
        ) : hasNoData ? (
          <div className='border border-gray-900 bg-black p-8 text-center'>
            <div className='text-gray-400'>
              <p className='text-lg'>No data found for "{username}"</p>
              <p className='mt-2 text-sm'>Try a different username or platform</p>
            </div>
          </div>
        ) : !isError && Array.isArray(filteredData) ? (
          <>
            <div className='text-sm text-gray-300'>
              Total contributions in {selectedYear}:{' '}
              <span className='font-semibold text-white'>
                {filteredData.reduce((sum, point) => sum + point.count, 0)}
              </span>
            </div>

            <div className='overflow-x-auto overflow-y-visible'>
              <div className='min-w-max'>
                <Grid
                  data={filteredData}
                  config={{
                    startDate,
                    endDate,
                  }}
                  onCellClick={(date: string, count: number) => {
                    console.log(`Clicked on ${date}: ${count} contributions`)
                    // You can add more detailed tooltips or modals here
                  }}
                />
              </div>
            </div>
          </>
        ) : null}

        {isError && error && (
          <div className='border border-red-900 bg-red-950 p-4'>
            <div className='flex'>
              <div className='shrink-0'>
                <svg className='h-5 w-5 text-red-500' viewBox='0 0 20 20' fill='currentColor'>
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-red-400'>Error</h3>
                <div className='mt-2 text-sm text-red-300'>{error.message}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
