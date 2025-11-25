import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { db, schema } from '../db/client'
import type { User, NewUser } from '../db/types'

const users = new Hono()

// Get user by ID
users.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const user = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))

    if (user.length === 0) {
      return c.json({ error: 'User not found' }, 404)
    }

    return c.json(user[0])
  } catch (error) {
    return c.json({ error: 'Failed to fetch user' }, 500)
  }
})

// Create a new user
users.post('/', async (c) => {
  try {
    const body = await c.req.json<NewUser>()
    const newUser = await db.insert(schema.users).values(body).returning()

    return c.json(newUser[0], 201)
  } catch (error) {
    return c.json({ error: 'Failed to create user' }, 500)
  }
})

export default users
