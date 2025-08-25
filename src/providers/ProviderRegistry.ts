import type { HeatmapProvider } from '@/types/heatmap'
import { GitHubHeatmapProvider } from '@/providers/GitHubHeatmapProvider'

export class ProviderRegistry {
  private providers: Map<string, HeatmapProvider> = new Map()

  constructor() {
    this.registerProvider(new GitHubHeatmapProvider())
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
