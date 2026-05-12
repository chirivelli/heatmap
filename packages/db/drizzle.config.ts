import { env } from '@heatmap/env/server'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: '../schema/src/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
})
