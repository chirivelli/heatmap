import { pgTable, text, foreignKey, integer, unique } from "drizzle-orm/pg-core"



export const users = pgTable("users", {
	id: text().primaryKey().notNull(),
	name: text(),
});

export const endeavors = pgTable("endeavors", {
	userId: text("user_id").notNull(),
	platformId: integer("platform_id").notNull(),
	username: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "endeavors_user_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.platformId],
			foreignColumns: [platforms.id],
			name: "endeavors_platform_id_platforms_id_fk"
		}),
]);

export const platforms = pgTable("platforms", {
	id: integer().primaryKey().notNull(),
	title: text().notNull(),
	url: text().notNull(),
}, (table) => [
	unique("platforms_title_unique").on(table.title),
	unique("platforms_url_unique").on(table.url),
]);
