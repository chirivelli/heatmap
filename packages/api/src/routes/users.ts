import { Hono } from 'hono'
import { and, eq } from 'drizzle-orm'
import { db, schema } from '../db/client'
import type { NewEndeavor, NewUser } from '../db/types'

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

// Get endeavors for a specific user with platform details
users.get('/:id/endeavors/with-platforms', async (c) => {
  try {
    const userId = c.req.param('id')
    const userEndeavors = await db
      .select({
        userId: schema.endeavors.userId,
        username: schema.endeavors.username,
        platformId: schema.endeavors.platformId,
        platformTitle: schema.platforms.title,
        platformUrl: schema.platforms.url,
      })
      .from(schema.endeavors)
      .leftJoin(
        schema.platforms,
        eq(schema.endeavors.platformId, schema.platforms.id),
      )
      .where(eq(schema.endeavors.userId, userId))

    return c.json(userEndeavors)
  } catch (error) {
    return c.json(
      { error: 'Failed to fetch user endeavors with platforms' },
      500,
    )
  }
})

// Create a new endeavor for a user
users.post('/:id/endeavors', async (c) => {
  try {
    const userId = c.req.param('id')
    const body = await c.req.json<NewEndeavor>()
    const newEndeavor = await db
      .insert(schema.endeavors)
      .values({ ...body, userId })
      .returning()

    return c.json(newEndeavor[0], 201)
  } catch (error) {
    return c.json({ error: 'Failed to create endeavor' }, 500)
  }
})

// Delete a user's endeavor by platformId
users.delete('/:id/endeavors/:platformId', async (c) => {
  try {
    const userId = c.req.param('id')
    const platformId = parseInt(c.req.param('platformId'))

    const deletedEndeavor = await db
      .delete(schema.endeavors)
      .where(
        and(
          eq(schema.endeavors.userId, userId),
          eq(schema.endeavors.platformId, platformId),
        ),
      )
      .returning()

    if (deletedEndeavor.length === 0) {
      return c.json({ error: 'Endeavor not found' }, 404)
    }

    return c.json(deletedEndeavor[0], 200)
  } catch (error) {
    return c.json({ error: 'Failed to delete endeavor' }, 500)
  }
})


export default users
