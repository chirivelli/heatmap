// Shared types that can be used across frontend and backend
// These will be automatically inferred from the Drizzle schema

import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import * as schema from './schema';

// Export types for each table
export type User = InferSelectModel<typeof schema.users>;
export type NewUser = InferInsertModel<typeof schema.users>;

export type Platform = InferSelectModel<typeof schema.platforms>;
export type NewPlatform = InferInsertModel<typeof schema.platforms>;

export type Endeavor = InferSelectModel<typeof schema.endeavors>;
export type NewEndeavor = InferInsertModel<typeof schema.endeavors>;
