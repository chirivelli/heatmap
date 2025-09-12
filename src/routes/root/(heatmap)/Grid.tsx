import type { ActivityDataPoint, HeatmapConfig } from '@/providers/heatmap'

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
    cellSize: 12,
    cellSpacing: 2,
    colors: ['#23272f', '#264d3b', '#2e7d4f', '#44c06f', '#a6f6c1'],
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

  // Group dates by week for proper calendar layout
  const groupByWeek = (dates: string[]): string[][] => {
    const weeks: string[][] = []
    let currentWeek: string[] = []

    dates.forEach((date, index) => {
      const dayOfWeek = new Date(date).getDay()

      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek)
        currentWeek = []
      }

      currentWeek.push(date)

      if (index === dates.length - 1) {
        weeks.push(currentWeek)
      }
    })

    return weeks
  }

  const weeks = groupByWeek(dates)

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
      <div className='flex gap-1'>
        {weeks.map((week, weekIndex) => (
          <div
            key={weekIndex}
            className={`flex flex-col ${weekIndex === 0 && 'justify-end'} gap-1`}
          >
            {week.map((date) => {
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
                    className='hover:ring-opacity-50 cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-blue-400'
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: color,
                    }}
                    onClick={() => handleCellClick(date, count)}
                    aria-label={`${formatDate(date)}: ${count} contributions`}
                  />
                  <div className='pointer-events-none absolute -top-1 left-4 z-50 rounded bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100'>
                    {count} {count === 1 ? 'contribution' : 'contributions'}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div className='text-xs text-gray-500'>
        {dates.length} days of activity
      </div>
    </div>
  )
}
