import { relations } from "drizzle-orm/relations";
import { users, endeavors, platforms } from "./schema";

export const endeavorsRelations = relations(endeavors, ({one}) => ({
	user: one(users, {
		fields: [endeavors.userId],
		references: [users.id]
	}),
	platform: one(platforms, {
		fields: [endeavors.platformId],
		references: [platforms.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	endeavors: many(endeavors),
}));

export const platformsRelations = relations(platforms, ({many}) => ({
	endeavors: many(endeavors),
}));