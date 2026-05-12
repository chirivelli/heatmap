import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export function createServerEnv() {
  return createEnv({
    server: {
      DATABASE_URL: z.string().url(),
      PORT: z.coerce.number().int().positive().default(3000),
    },
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
  })
}

type ServerEnv = ReturnType<typeof createServerEnv>

let cachedEnv: ServerEnv | undefined

export const env = new Proxy({} as ServerEnv, {
  get(_target, prop, receiver) {
    cachedEnv ??= createServerEnv()
    return Reflect.get(cachedEnv, prop, receiver)
  },
})
