import { Hono } from 'hono'
import { eq, and } from 'drizzle-orm'
import { db, schema } from '../db/client'
import type { NewEndeavor } from '../db/types'

const endeavors = new Hono()

// Get endeavors for a specific user with platform details
endeavors.get('/user/:userId/with-platforms', async (c) => {
  try {
    const userId = c.req.param('userId')
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

// Create a new endeavor
endeavors.post('/', async (c) => {
  try {
    const body = await c.req.json<NewEndeavor>()
    const newEndeavor = await db
      .insert(schema.endeavors)
      .values(body)
      .returning()

    return c.json(newEndeavor[0], 201)
  } catch (error) {
    return c.json({ error: 'Failed to create endeavor' }, 500)
  }
})

// Delete an endeavor by userId and platformId
endeavors.delete('/:userId/:platformId', async (c) => {
  try {
    const userId = c.req.param('userId')
    const platformId = parseInt(c.req.param('platformId'))

    const deletedEndeavor = await db
      .delete(schema.endeavors)
      .where(
        and(
          eq(schema.endeavors.userId, userId),
          eq(schema.endeavors.platformId, platformId)
        )
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

export default endeavors
