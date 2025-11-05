import type { HeatmapProvider, ActivityDataPoint } from '@/providers/heatmap'

interface LeetCodeStatsResponse {
  status: string
  message: string
  totalSolved: number
  easySolved: number
  mediumSolved: number
  hardSolved: number
  acceptanceRate: number
  ranking: number
  contributionPoints: number
  reputation: number
  submissionCalendar: Record<string, number>
}

export class LeetCodeHeatmapProvider implements HeatmapProvider {
  name = 'LeetCode'

  async fetchData(
    username: string,
    year?: number,
  ): Promise<ActivityDataPoint[]> {
    try {
      // Fetch data from LeetCode Stats API
      // This API returns ALL historical submissions
      const response = await fetch(
        `https://leetcode-stats.tashif.codes/${username}`,
      )

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`User '${username}' not found on LeetCode`)
        }
        throw new Error(`LeetCode API error: ${response.status}`)
      }

      const data: LeetCodeStatsResponse = await response.json()

      if (data.status !== 'success') {
        throw new Error(`LeetCode API error: ${data.message}`)
      }

      // Convert submission calendar to ActivityDataPoint format
      const activityData: ActivityDataPoint[] = []

      for (const [timestamp, count] of Object.entries(
        data.submissionCalendar,
      )) {
        // Convert Unix timestamp to ISO date string
        const date = new Date(parseInt(timestamp) * 1000)
        const isoDate = date.toISOString().split('T')[0]

        // Filter by year if specified
        if (year) {
          const dataYear = date.getFullYear()
          if (dataYear !== year) {
            continue
          }
        }

        activityData.push({
          date: isoDate,
          count: count,
        })
      }

      // Sort by date to ensure chronological order
      activityData.sort((a, b) => a.date.localeCompare(b.date))

      console.log(
        `Successfully fetched ${activityData.length} days of LeetCode data for ${username}${year ? ` (${year})` : ''}`,
      )

      return activityData
    } catch (error) {
      console.error('Error fetching LeetCode data:', error)
      throw new Error(
        `Failed to fetch LeetCode data for ${username}. Please check if the username exists and try again.`,
      )
    }
  }
}
