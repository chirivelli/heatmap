import { useState } from 'react'
import { createPortal } from 'react-dom'

import type { ActivityDataPoint, HeatmapConfig } from '@/providers/heatmap.types'

export function Grid({
  data,
  config = {},
  onCellClick,
}: {
  data: ActivityDataPoint[]
  config?: Partial<HeatmapConfig>
  onCellClick?: (date: string, count: number) => void
}) {
  const [hoveredCell, setHoveredCell] = useState<{
    date: string
    count: number
    left: number
    top: number
  } | null>(null)

  const defaultConfig: HeatmapConfig = {
    startDate: new Date(new Date().getFullYear(), 0, 1), // Start of current year
    endDate: new Date(),
    cellSize: 8,
    cellSpacing: 1.5,
    colors: ['#111111', '#0e4429', '#006d32', '#26a641', '#39d353'],
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
  ): { month: string; weeks: (string | null)[][] }[] => {
    const monthGroups: { month: string; weeks: (string | null)[][] }[] = []
    let currentMonth = ''
    let currentMonthWeeks: (string | null)[][] = []
    let currentWeek: (string | null)[] = []

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
          currentWeek = Array.from({ length: dayOfWeek }, () => null)
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
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  const handleCellHover = (date: string, count: number, cellElement: HTMLDivElement) => {
    const cellRect = cellElement.getBoundingClientRect()

    setHoveredCell({
      date,
      count,
      left: cellRect.left + cellRect.width / 2,
      top: cellRect.top - 8,
    })
  }

  return (
    <div className='flex flex-col items-start gap-4'>
      {hoveredCell
        ? createPortal(
            <div
              className='pointer-events-none fixed z-50 flex min-w-24 -translate-x-1/2 -translate-y-full flex-col items-center border border-gray-700 bg-[#080808] px-4 py-2 text-center text-gray-400 shadow-lg'
              style={{ left: hoveredCell.left, top: hoveredCell.top }}
            >
              <div className='text-sm font-semibold text-white'>{hoveredCell.count}</div>
              <div className='text-xs'>
                {hoveredCell.count === 1 ? 'contribution' : 'contributions'}
              </div>
              <div className='mt-1 text-xs'>{formatDate(hoveredCell.date)}</div>
            </div>,
            document.body,
          )
        : null}

      <div className='relative flex flex-wrap gap-6'>
        {monthGroups.map((monthGroup, monthIndex) => (
          <div key={monthIndex} className='flex flex-col gap-2'>
            <div className='text-xs font-medium text-gray-400'>{monthGroup.month}</div>
            <div className='flex gap-1'>
              {monthGroup.weeks.map((week, weekIndex) => (
                <div
                  key={weekIndex}
                  className='relative flex flex-col gap-1'
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
                          onMouseEnter={(event) =>
                            handleCellHover(date, count, event.currentTarget)
                          }
                          onMouseLeave={() => setHoveredCell(null)}
                          onFocus={(event) => handleCellHover(date, count, event.currentTarget)}
                          onBlur={() => setHoveredCell(null)}
                          onClick={() => handleCellClick(date, count)}
                          aria-label={`${formatDate(date)}: ${count} contributions`}
                        />
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
