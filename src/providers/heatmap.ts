export type ActivityDataPoint = {
  date: string // ISO date string (YYYY-MM-DD)
  count: number // Activity count for that date
}

export type HeatmapConfig = {
  startDate: Date
  endDate: Date
  cellSize: number
  cellSpacing: number
  colors: string[]
}

export type HeatmapProvider = {
  name: string
  fetchData: (username: string, year?: number) => Promise<ActivityDataPoint[]>
}
