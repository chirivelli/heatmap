import type {
  ActivityDataPoint,
  HeatmapConfig,
} from '@/providers/heatmap.types'

export function Grid({
  data,
  config = {},
  onCellClick,
}: {
  data: ActivityDataPoint[]
  config?: Partial<HeatmapConfig>
  onCellClick?: (date: string, count: number) => void
}) {
  const defaultConfig: HeatmapConfig = {
    startDate: new Date(new Date().getFullYear(), 0, 1), // Start of current year
    endDate: new Date(),
    cellSize: 8,
    cellSpacing: 1.5,
    colors: ['#111111', '#333333', '#666666', '#999999', '#cccccc'],
    ...config,
  }

  const { startDate, endDate, cellSize, cellSpacing, colors } = defaultConfig

  // Create a map of date to count for quick lookup
  const dataMap = new Map<string, number>()
  data.forEach((point) => {
    dataMap.set(point.date, point.count)
  })

  // Generate all dates in the range
  const generateDates = (): string[] => {
    const dates: string[] = []
    const current = new Date(startDate)

    while (current <= endDate) {
      dates.push(current.toISOString().split('T')[0])
      current.setDate(current.getDate() + 1)
    }

    return dates
  }

  const dates = generateDates()

  // Get color based on count
  const getColor = (count: number): string => {
    if (count === 0) return colors[0]
    if (count <= 1) return colors[1]
    if (count <= 3) return colors[2]
    if (count <= 6) return colors[3]
    return colors[4]
  }

  // Group dates by month and week for proper calendar layout
  const groupByMonthAndWeek = (
    dates: string[],
  ): { month: string; weeks: string[][] }[] => {
    const monthGroups: { month: string; weeks: string[][] }[] = []
    let currentMonth = ''
    let currentMonthWeeks: string[][] = []
    let currentWeek: string[] = []

    dates.forEach((date, index) => {
      const dateObj = new Date(date)
      const dayOfWeek = dateObj.getDay()
      const monthYear = dateObj.toLocaleDateString('en-US', { month: 'short' })

      // Check if we've moved to a new month
      if (monthYear !== currentMonth) {
        // Save previous month if it exists
        if (currentMonth && currentMonthWeeks.length > 0) {
          // Add the last week of previous month
          if (currentWeek.length > 0) {
            currentMonthWeeks.push(currentWeek)
          }
          monthGroups.push({ month: currentMonth, weeks: currentMonthWeeks })
        }

        // Start new month
        currentMonth = monthYear
        currentMonthWeeks = []
        currentWeek = []

        // Add empty days at the start of the first week if it doesn't start on Sunday
        if (dayOfWeek !== 0) {
          currentWeek = new Array(dayOfWeek).fill(null)
        }
      }

      // Check if we need to start a new week
      if (dayOfWeek === 0 && currentWeek.length > 0) {
        currentMonthWeeks.push(currentWeek)
        currentWeek = []
      }

      currentWeek.push(date)

      // Handle last date
      if (index === dates.length - 1) {
        currentMonthWeeks.push(currentWeek)
        monthGroups.push({ month: currentMonth, weeks: currentMonthWeeks })
      }
    })

    return monthGroups
  }

  const monthGroups = groupByMonthAndWeek(dates)

  const handleCellClick = (date: string, count: number) => {
    if (onCellClick) {
      onCellClick(date, count)
    }
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className='flex flex-col items-start gap-4'>
      <div className='flex flex-wrap gap-6'>
        {monthGroups.map((monthGroup, monthIndex) => (
          <div key={monthIndex} className='flex flex-col gap-2'>
            <div className='text-xs font-medium text-gray-400'>
              {monthGroup.month}
            </div>
            <div className='flex gap-1'>
              {monthGroup.weeks.map((week, weekIndex) => (
                <div
                  key={weekIndex}
                  className='flex flex-col gap-1'
                  style={{
                    minHeight: 7 * (cellSize + cellSpacing),
                  }}
                >
                  {week.map((date, dayIndex) => {
                    // Handle null entries (empty days at start of month)
                    if (date === null) {
                      return (
                        <div
                          key={`empty-${dayIndex}`}
                          style={{
                            width: cellSize,
                            height: cellSize,
                            margin: cellSpacing / 2,
                          }}
                        />
                      )
                    }

                    const count = dataMap.get(date) || 0
                    const color = getColor(count)

                    return (
                      <div
                        key={date}
                        className='group relative'
                        style={{
                          width: cellSize,
                          height: cellSize,
                          margin: cellSpacing / 2,
                        }}
                      >
                        <div
                          className='hover:ring-opacity-50 cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-white'
                          style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: color,
                          }}
                          onClick={() => handleCellClick(date, count)}
                          aria-label={`${formatDate(date)}: ${count} contributions`}
                        />
                        <div className='pointer-events-none absolute -top-8 left-1/2 z-50 -translate-x-1/2 transform rounded border border-gray-700 bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 sm:-top-1 sm:left-4 sm:transform-none'>
                          {count}{' '}
                          {count === 1 ? 'contribution' : 'contributions'}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className='text-xs text-gray-400'>
        {dates.length} days of activity
      </div>
    </div>
  )
}
