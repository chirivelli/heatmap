import { GitHubHeatmapProvider } from '@/providers/GitHubHeatmapProvider'
import { LeetCodeHeatmapProvider } from '@/providers/LeetCodeHeatmapProvider'
import type { HeatmapProvider } from '@/providers/heatmap'
import { CodeforcesHeatmapProvider } from './CodeforcesHeatmapProvider'

export class ProviderRegistry {
  private providers: Map<string, HeatmapProvider> = new Map()

  constructor() {
    this.registerProvider(new GitHubHeatmapProvider())
    this.registerProvider(new LeetCodeHeatmapProvider())
    this.registerProvider(new CodeforcesHeatmapProvider())
  }

  registerProvider(provider: HeatmapProvider): void {
    this.providers.set(provider.name, provider)
  }

  getProvider(name: string): HeatmapProvider | undefined {
    return this.providers.get(name)
  }

  getAllProviders(): HeatmapProvider[] {
    return Array.from(this.providers.values())
  }

  getProviderNames(): string[] {
    return Array.from(this.providers.keys())
  }
}
