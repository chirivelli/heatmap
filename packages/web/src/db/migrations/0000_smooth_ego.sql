-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text
);
--> statement-breakpoint
CREATE TABLE "endeavors" (
	"user_id" text NOT NULL,
	"platform_id" integer NOT NULL,
	"username" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "platforms" (
	"id" integer PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"url" text NOT NULL,
	CONSTRAINT "platforms_title_unique" UNIQUE("title"),
	CONSTRAINT "platforms_url_unique" UNIQUE("url")
);
--> statement-breakpoint
ALTER TABLE "endeavors" ADD CONSTRAINT "endeavors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "endeavors" ADD CONSTRAINT "endeavors_platform_id_platforms_id_fk" FOREIGN KEY ("platform_id") REFERENCES "public"."platforms"("id") ON DELETE no action ON UPDATE no action;
*/