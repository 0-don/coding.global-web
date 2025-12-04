CREATE TYPE "public"."todoStatus" AS ENUM('DONE', 'ACTIVE', 'PENDING');--> statement-breakpoint
CREATE TABLE "comment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" varchar(4096) NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "todo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task" varchar(4096) NOT NULL,
	"status" "todoStatus" DEFAULT 'PENDING' NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
