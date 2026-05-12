import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export function createWebEnv(runtimeEnv: Record<string, string | boolean | undefined>) {
  return createEnv({
    clientPrefix: 'VITE_',
    client: {
      VITE_API_URL: z.string().url().default('http://localhost:3000'),
      VITE_CLERK_PUBLISHABLE_KEY: z.string().min(1),
      VITE_GITHUB_TOKEN: z.string().optional(),
    },
    runtimeEnv,
    emptyStringAsUndefined: true,
  })
}
