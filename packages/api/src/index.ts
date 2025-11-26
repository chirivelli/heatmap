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
app.get('/', (c) => {
  return c.json({ message: 'Welcome to the Heatmap API' })
})

// Mount routes
app.route('/api/users', users)
app.route('/api/platforms', platforms)
app.route('/api/endeavors', endeavors)


export default app