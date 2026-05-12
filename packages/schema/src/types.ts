import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'

import * as schema from '.'

export type User = InferSelectModel<typeof schema.users>
export type NewUser = InferInsertModel<typeof schema.users>

export type Platform = InferSelectModel<typeof schema.platforms>
export type NewPlatform = InferInsertModel<typeof schema.platforms>

export type Endeavor = InferSelectModel<typeof schema.endeavors>
export type NewEndeavor = InferInsertModel<typeof schema.endeavors>
