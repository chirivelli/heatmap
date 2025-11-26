import { Hono } from 'hono'
import { cors } from 'hono/cors'
import users from './routes/users'
import platforms from './routes/platforms'
import endeavors from './routes/endeavors'

const app = new Hono()

// Enable CORS for frontend
app.use('/*', cors())

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Basic API routes
app.get('/api', (c) => {
  return c.json({ message: 'Welcome to the Heatmap API' })
})

app.get('/api/hello/:name', (c) => {
  const name = c.req.param('name')
  return c.json({ message: `Hello, ${name}!` })
})

// Mount routes
app.route('/api/users', users)
app.route('/api/platforms', platforms)
app.route('/api/endeavors', endeavors)

const port = process.env.PORT || 3000

console.log(`🚀 Server running at http://localhost:${port}`)

export default app