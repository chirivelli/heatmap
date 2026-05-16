import { createEnv } from '@t3-oss/env-core'
import { config } from 'dotenv'
import { resolve } from 'node:path'
import { z } from 'zod'

export function loadApiEnvFiles(cwd = process.cwd()) {
  config({
    path: [
      resolve(cwd, '.env.local'),
      resolve(cwd, '.env'),
      resolve(cwd, '../..', '.env.local'),
      resolve(cwd, '../..', '.env'),
    ],
    quiet: true,
  })
}

export function createApiEnv(runtimeEnv: NodeJS.ProcessEnv) {
  return createEnv({
    server: {
      DATABASE_URL: z.url(),
      PORT: z.coerce.number().int().positive().default(3000),
    },
    runtimeEnv,
    emptyStringAsUndefined: true,
  })
}

loadApiEnvFiles()

export const env = createApiEnv(process.env)
