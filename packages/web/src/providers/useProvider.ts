import { ProviderRegistry } from '@web/providers/ProviderRegistry'

export function useProvider(platform: string) {
  const registry = new ProviderRegistry()
  const provider = registry.getProvider(platform)

  if (!provider) {
    throw new Error(`Provider ${platform} not found`)
  }

  return provider
}
