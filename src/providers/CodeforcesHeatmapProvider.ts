import type {
  HeatmapProvider,
  ActivityDataPoint,
} from '@/providers/heatmap.types'

interface CodeforcesSubmission {
  id: number
  contestId: number
  creationTimeSeconds: number
  relativeTimeSeconds: number
  problem: {
    contestId: number
    index: string
    name: string
    type: string
    points?: number
    rating?: number
    tags: string[]
  }
  author: {
    contestId: number
    members: Array<{
      handle: string
    }>
    participantType: string
    ghost: boolean
    startTimeSeconds: number
  }
  programmingLanguage: string
  verdict: string
  testset: string
  passedTestCount: number
  timeConsumedMillis: number
  memoryConsumedBytes: number
}

interface CodeforcesResponse {
  status: string
  result: CodeforcesSubmission[]
}

export class CodeforcesHeatmapProvider implements HeatmapProvider {
  name = 'Codeforces'

  async fetchData(
    username: string,
    year?: number,
  ): Promise<ActivityDataPoint[]> {
    try {
      // Fetch data from Codeforces API
      const response = await fetch(
        `https://codeforces.com/api/user.status?handle=${encodeURIComponent(username)}`,
      )

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error(`Invalid request for user '${username}'`)
        }
        throw new Error(`Codeforces API error: ${response.status}`)
      }

      const data: CodeforcesResponse = await response.json()

      if (data.status !== 'OK') {
        throw new Error(`Codeforces API error: ${data.status}`)
      }

      // Group submissions by date and count them
      const activityMap: Record<string, number> = {}

      for (const submission of data.result) {
        // Convert Unix timestamp to ISO date string
        const date = new Date(submission.creationTimeSeconds * 1000)
        const isoDate = date.toISOString().split('T')[0]

        // Filter by year if specified
        if (year) {
          const submissionYear = date.getFullYear()
          if (submissionYear !== year) {
            continue
          }
        }

        // Only count successful submissions (verdict === 'OK')
        if (submission.verdict === 'OK') {
          activityMap[isoDate] = (activityMap[isoDate] || 0) + 1
        }
      }

      // Convert to ActivityDataPoint array
      const activityData: ActivityDataPoint[] = Object.entries(activityMap).map(
        ([date, count]) => ({
          date,
          count,
        }),
      )

      // Sort by date to ensure chronological order
      activityData.sort((a, b) => a.date.localeCompare(b.date))

      console.log(
        `Successfully fetched ${activityData.length} days of Codeforces data for ${username}${year ? ` (${year})` : ''}`,
      )

      return activityData
    } catch (error) {
      console.error('Error fetching Codeforces data:', error)
      throw new Error(
        `Failed to fetch Codeforces data for ${username}. Please check if the username exists and try again.`,
      )
    }
  }
}
