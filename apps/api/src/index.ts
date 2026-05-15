import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { pathToFileURL } from 'node:url'

import platforms from './routes/platforms.js'
import users from './routes/users.js'

const app = new Hono()

// Enable CORS for frontend
app.use('/*', cors())

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Basic API routes
app.get('/', (c) => {
  return c.json({ message: 'Welcome to the Heatmap API' })
})

// Mount routes
app.route('/api/users', users)
app.route('/api/platforms', platforms)

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT ?? 3000)

  serve({
    fetch: app.fetch,
    port,
  })
}

export default app
