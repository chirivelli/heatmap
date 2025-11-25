import { Hono } from 'hono'
import { db, schema } from '../db/client'

const platforms = new Hono()

// Get all platforms
platforms.get('/', async (c) => {
  try {
    const allPlatforms = await db.select().from(schema.platforms)
    return c.json(allPlatforms)
  } catch (error) {
    return c.json({ error: 'Failed to fetch platforms' }, 500)
  }
})

export default platforms
