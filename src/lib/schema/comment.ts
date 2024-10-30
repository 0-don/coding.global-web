import { Type as t } from "@sinclair/typebox/type";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { users } from "./auth";

export const comment = pgTable("comment", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

const commentInsertSchema = createInsertSchema(comment, {
  content: t.String({ minLength: 1, default: "" }),
});

export const commentInsertSimpleSchema = t.Omit(commentInsertSchema, [
  "id",
  "createdAt",
  "userId",
]);
export type CommentInsertSimple = typeof commentInsertSimpleSchema.static;

export const commentSelectSchema = createSelectSchema(comment);

export type CommentSelect = typeof commentSelectSchema.static;
