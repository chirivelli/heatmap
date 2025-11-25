import { pgTable, text, timestamp, integer, uuid } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name'),
})

export const platforms = pgTable('platforms', {
  id: integer('id').primaryKey(),
  title: text('title').notNull().unique(),
  url: text('url').notNull().unique(),
})

export const endeavors = pgTable('endeavors', {
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  platformId: integer('platform_id')
    .notNull()
    .references(() => platforms.id),
  username: text('username').notNull(),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  endeavors: many(endeavors),
}))

export const platformsRelations = relations(platforms, ({ many }) => ({
  endeavors: many(endeavors),
}))

export const endeavorsRelations = relations(endeavors, ({ one }) => ({
  user: one(users, {
    fields: [endeavors.userId],
    references: [users.id],
  }),
  platform: one(platforms, {
    fields: [endeavors.platformId],
    references: [platforms.id],
  }),
}))
