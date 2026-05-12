import { createServerEnv } from '@heatmap/env/server'
import * as schema from '@heatmap/schema'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

type Db = ReturnType<typeof createDb>

let cachedDb: Db | undefined

export function createDb() {
  const env = createServerEnv()
  const client = neon(env.DATABASE_URL)
  return drizzle(client, { schema })
}

export const db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    cachedDb ??= createDb()
    return Reflect.get(cachedDb, prop, receiver)
  },
})

export { schema }
