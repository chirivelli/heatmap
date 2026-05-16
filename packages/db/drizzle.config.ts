import { env } from '@heatmap/env/api'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: '../schema/src/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
})
