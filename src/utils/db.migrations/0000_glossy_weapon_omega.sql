CREATE TABLE IF NOT EXISTS "comment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user" text NOT NULL,
	"content" text NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
