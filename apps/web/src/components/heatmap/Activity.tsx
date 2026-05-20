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
  const [clickedCell, setClickedCell] = useState<{ date: string; count: number } | null>(null)

  useEffect(() => {
    setClickedCell(null)
  }, [selectedYear, username, platform])

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

  const stats = calculateStats(filteredData, selectedYear)

  // Get date range for selected year
  const startDate = new Date(selectedYear, 0, 1)
  const endDate = new Date(selectedYear, 11, 31) // Always show full year

  return (
    <div className='mx-auto w-full max-w-6xl min-w-0 overflow-hidden border border-gray-900 bg-black'>
      <div className='flex min-w-0 flex-col gap-4 p-4 sm:p-6'>
        <div className='flex min-w-0 flex-col items-start gap-3 md:flex-row md:items-center md:justify-between'>
          <div className='inline-flex max-w-full items-center gap-2 rounded-full border border-gray-700 bg-gray-900 px-3 py-1.5 select-none'>
            <span className='shrink-0 text-sm font-medium text-white'>{platform}</span>
            <span className='text-xs text-gray-500'>/</span>
            <span className='min-w-0 truncate text-sm font-medium text-gray-300'>{username}</span>
          </div>

          <div className='flex max-w-full flex-wrap items-center gap-2'>
            <YearNavigation
              selectedYear={selectedYear}
              minYear={minYear}
              maxYear={maxYear}
              onYearChange={handleYearChange}
            />

            <button
              className='inline-flex items-center gap-1 rounded-full border border-red-900 bg-red-950 px-3 py-1.5 text-sm font-medium text-red-400 transition-colors select-none hover:bg-red-900 hover:text-red-300'
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
            <div className='inline-flex items-center gap-3 px-4 py-2 font-semibold text-white select-none'>
              <DotmSquare5 ariaLabel='Fetching data' size={32} dotSize={4} speed={1.2} bloom />
              Fetching data ...
            </div>
          </div>
        ) : hasNoData ? (
          <div className='border border-gray-900 bg-black p-8 text-center select-none'>
            <div className='text-gray-400'>
              <p className='text-lg'>No data found for "{username}"</p>
              <p className='mt-2 text-sm'>Try a different username or platform</p>
            </div>
          </div>
        ) : !isError && Array.isArray(filteredData) ? (
          <>
            <div className='grid grid-cols-2 gap-3 sm:grid-cols-4 select-none mb-4'>
              <div className='rounded-xl border border-gray-950 bg-gray-950/40 p-4 backdrop-blur-md transition-colors hover:border-gray-800/80'>
                <div className='text-[10px] font-bold text-gray-500 uppercase tracking-wider'>Total contributions</div>
                <div className='text-2xl font-black mt-1 text-white'>{stats.total}</div>
              </div>
              <div className='rounded-xl border border-gray-950 bg-gray-950/40 p-4 backdrop-blur-md transition-colors hover:border-gray-800/80'>
                <div className='text-[10px] font-bold text-gray-500 uppercase tracking-wider'>Current Streak</div>
                <div className='text-2xl font-black mt-1 text-emerald-400'>
                  {stats.currentStreak} {stats.currentStreak === 1 ? 'day' : 'days'}
                </div>
              </div>
              <div className='rounded-xl border border-gray-950 bg-gray-950/40 p-4 backdrop-blur-md transition-colors hover:border-gray-800/80'>
                <div className='text-[10px] font-bold text-gray-500 uppercase tracking-wider'>Longest Streak</div>
                <div className='text-2xl font-black mt-1 text-amber-500'>
                  {stats.maxStreak} {stats.maxStreak === 1 ? 'day' : 'days'}
                </div>
              </div>
              <div className='rounded-xl border border-gray-950 bg-gray-950/40 p-4 backdrop-blur-md transition-colors hover:border-gray-800/80'>
                <div className='text-[10px] font-bold text-gray-500 uppercase tracking-wider'>Consistency</div>
                <div className='text-2xl font-black mt-1 text-blue-400'>{stats.consistency.toFixed(1)}%</div>
              </div>
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
                    setClickedCell({ date, count })
                  }}
                />
              </div>
            </div>

            {clickedCell && (
              <div className='mt-4 flex items-center justify-between border border-gray-900 bg-gray-950/20 px-4 py-3 rounded-lg text-sm select-none'>
                <div className='flex items-center gap-2 flex-wrap'>
                  <span className='text-gray-500'>Selected Date:</span>
                  <span className='font-semibold text-white'>
                    {new Date(clickedCell.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className='text-gray-700 hidden sm:inline'>•</span>
                  <span className='text-gray-500'>Activity:</span>
                  <span
                    className={`font-semibold ${
                      clickedCell.count > 0 ? 'text-emerald-400' : 'text-gray-400'
                    }`}
                  >
                    {clickedCell.count} {clickedCell.count === 1 ? 'contribution' : 'contributions'}
                  </span>
                </div>
                <button
                  onClick={() => setClickedCell(null)}
                  className='text-xs text-gray-500 transition-colors hover:text-gray-300 focus:outline-none'
                >
                  Clear
                </button>
              </div>
            )}
          </>
        ) : null}

        {isError && error && (
          <div className='border border-red-900 bg-red-950 p-4 select-none'>
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

function calculateStats(data: ActivityDataPoint[], year: number) {
  let total = 0
  let maxSingleDay = 0
  let activeDays = 0

  const getLocalDateString = (d: Date) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const r = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${r}`
  }

  const dateMap = new Map<string, number>()
  data.forEach((p) => {
    const dStr = p.date.split('T')[0]
    dateMap.set(dStr, p.count)
    total += p.count
    if (p.count > maxSingleDay) {
      maxSingleDay = p.count
    }
    if (p.count > 0) activeDays++
  })

  let maxStreak = 0
  let tempStreak = 0

  const start = new Date(year, 0, 1)
  const end = year === new Date().getFullYear() ? new Date() : new Date(year, 11, 31)

  // Loop through dates
  const curr = new Date(start)
  while (curr <= end) {
    const dStr = getLocalDateString(curr)
    const count = dateMap.get(dStr) || 0
    if (count > 0) {
      tempStreak++
      if (tempStreak > maxStreak) {
        maxStreak = tempStreak
      }
    } else {
      tempStreak = 0
    }
    curr.setDate(curr.getDate() + 1)
  }

  let currentStreak = 0
  if (year === new Date().getFullYear()) {
    const checkDate = new Date()
    const todayStr = getLocalDateString(checkDate)
    const todayCount = dateMap.get(todayStr) || 0

    if (todayCount === 0) {
      checkDate.setDate(checkDate.getDate() - 1)
    }

    while (checkDate >= start) {
      const dStr = getLocalDateString(checkDate)
      const count = dateMap.get(dStr) || 0
      if (count > 0) {
        currentStreak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }
  }

  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  const consistency = totalDays > 0 ? (activeDays / totalDays) * 100 : 0

  return {
    total,
    maxStreak,
    currentStreak,
    consistency,
    maxSingleDay,
  }
}

