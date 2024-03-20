import { Type as t } from "@sinclair/typebox/type";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";

export const comment = pgTable("comment", {
  id: uuid("id").primaryKey().defaultRandom(),
  user: text("user").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

const insertSchema = createInsertSchema(comment, {
  user: t.String({ minLength: 1, default: "" }),
  content: t.String({ minLength: 1, default: "" }),
});

export const commentInsertSchema = t.Omit(insertSchema, ["id"]);
export type commentInsert = typeof commentInsertSchema.static;

export const commentSelectSchema = createSelectSchema(comment);
export type commentSelect = typeof commentSelectSchema.static;
