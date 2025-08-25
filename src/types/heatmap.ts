export type ActivityDataPoint = {
  date: string // ISO date string (YYYY-MM-DD)
  count: number // Activity count for that date
}

export type UserProfile = {
  username: string
  platform: 'github' | 'leetcode'
  displayName?: string
  avatarUrl?: string
  totalContributions?: number
  lastActive?: Date
}

export type ActivityData = {
  userId: string // Reference to UserProfile._id
  username: string
  platform: string
  year: number
  data: ActivityDataPoint[]
  totalDays: number
  totalContributions: number
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
  displayName: string
  fetchData: (username: string) => Promise<ActivityDataPoint[]>
}

export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export type PaginationParams = {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export type SearchParams = {
  username?: string
  platform?: string
  dateFrom?: string
  dateTo?: string
  minContributions?: number
}
