import { Type as t } from "@sinclair/typebox/type";
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-typebox";
import { Elysia } from "elysia";
import { user } from "./auth-schema";

export const comment = pgTable("comment", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  content: varchar("content", { length: 4096 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const commentSelectSchema = createSelectSchema(comment, {
  content: t.String({ minLength: 1, maxLength: 4096, default: "" }),
});
export type Comments = typeof commentSelectSchema.static;

export const commentInsertSchema = t.Omit(commentSelectSchema, [
  "id",
  "userId",
  "createdAt",
]);
export const commentDeleteSchema = t.Pick(commentSelectSchema, ["id"]);

export const { models: commentSchemas } = new Elysia().model({
  select: commentSelectSchema,
  insert: commentInsertSchema,
  delete: commentDeleteSchema,
});
