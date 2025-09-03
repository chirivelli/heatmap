import type { ActivityDataPoint, HeatmapConfig } from '@/types/heatmap'

export function HeatmapGrid({
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
    colors: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
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
    <div className='flex flex-col items-start space-y-4'>
      <div className='flex space-x-1'>
        {weeks.map((week, weekIndex) => (
          <div
            key={weekIndex}
            className={`flex flex-col ${weekIndex === 0 && 'justify-end'} space-y-1`}
          >
            {week.map((date) => {
              const count = dataMap.get(date) || 0
              const color = getColor(count)

              return (
                <div
                  key={date}
                  className='hover:ring-opacity-50 cursor-pointer rounded-sm transition-all duration-200 hover:ring-2 hover:ring-blue-400'
                  style={{
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: color,
                    margin: cellSpacing / 2,
                  }}
                  onClick={() => handleCellClick(date, count)}
                  title={`${formatDate(date)}: ${count} contributions`}
                />
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
