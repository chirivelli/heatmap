import type { HeatmapProvider, ActivityDataPoint } from '@/providers/heatmap.types'

interface AlfaLeetCodeCalendarResponse {
  activeYears?: number[]
  submissionCalendar?: Record<string, number> | string
  matchedUser?: {
    userCalendar?: {
      activeYears?: number[]
      submissionCalendar?: Record<string, number> | string
    }
  }
}

export class LeetCodeHeatmapProvider implements HeatmapProvider {
  name = 'LeetCode'

  async fetchAvailableYears(username: string): Promise<number[]> {
    try {
      const response = await fetch(`https://alfa-leetcode-api.onrender.com/${username}/calendar`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`User '${username}' not found on LeetCode`)
        }
        if (response.status === 429) {
          const retryAfter = response.headers.get('retry-after')
          throw new Error(
            retryAfter
              ? `LeetCode data is rate limited. Try again in about ${formatRetryAfter(retryAfter)}.`
              : 'LeetCode data is rate limited. Try again later.',
          )
        }
        throw new Error(`LeetCode API error: ${response.status}`)
      }

      const data: AlfaLeetCodeCalendarResponse = await response.json()
      const activeYears = data.activeYears ?? data.matchedUser?.userCalendar?.activeYears

      if (!Array.isArray(activeYears)) {
        return []
      }

      return activeYears.filter((year) => Number.isInteger(year)).sort((a, b) => a - b)
    } catch (error) {
      console.warn('LeetCode year discovery failed:', error)
      throw error
    }
  }

  async fetchData(username: string, year?: number): Promise<ActivityDataPoint[]> {
    try {
      const url = new URL(`https://alfa-leetcode-api.onrender.com/${username}/calendar`)
      if (year) {
        url.searchParams.set('year', String(year))
      }

      const response = await fetch(url)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`User '${username}' not found on LeetCode`)
        }
        if (response.status === 429) {
          const retryAfter = response.headers.get('retry-after')
          throw new Error(
            retryAfter
              ? `LeetCode data is rate limited. Try again in about ${formatRetryAfter(retryAfter)}.`
              : 'LeetCode data is rate limited. Try again later.',
          )
        }
        throw new Error(`LeetCode API error: ${response.status}`)
      }

      const data: AlfaLeetCodeCalendarResponse = await response.json()
      const submissionCalendar = parseSubmissionCalendar(
        data.submissionCalendar ?? data.matchedUser?.userCalendar?.submissionCalendar,
      )

      if (!submissionCalendar) {
        throw new Error('LeetCode API response did not include a submission calendar')
      }

      const activityData: ActivityDataPoint[] = []

      for (const [timestamp, count] of Object.entries(submissionCalendar)) {
        const date = new Date(parseInt(timestamp) * 1000)
        const isoDate = date.toISOString().split('T')[0]

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
      if (error instanceof Error) {
        throw error
      }
      throw new Error(
        `Failed to fetch LeetCode data for ${username}. Please check if the username exists and try again.`,
      )
    }
  }
}

function parseSubmissionCalendar(
  submissionCalendar: Record<string, number> | string | undefined,
): Record<string, number> | undefined {
  if (!submissionCalendar) {
    return undefined
  }

  if (typeof submissionCalendar === 'string') {
    return JSON.parse(submissionCalendar) as Record<string, number>
  }

  return submissionCalendar
}

function formatRetryAfter(retryAfter: string): string {
  const seconds = Number(retryAfter)

  if (!Number.isFinite(seconds) || seconds <= 0) {
    return 'a few minutes'
  }

  const minutes = Math.ceil(seconds / 60)

  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`
  }

  const hours = Math.ceil(minutes / 60)
  return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
}
