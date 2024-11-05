import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-typebox";
import { Elysia, t } from "elysia";

export const todo = pgTable("todo", {
  id: uuid("id").primaryKey().defaultRandom(),
  task: varchar("task", { length: 4096 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const todoSelectSchema = createSelectSchema(todo, {
  task: t.String({ minLength: 1, maxLength: 4096, default: "" }),
});
export type Todo = typeof todoSelectSchema.static;

export const todoInsertSchema = t.Omit(todoSelectSchema, ["id", "createdAt"]);
export const todoDeleteSchema = t.Pick(todoSelectSchema, ["id"]);

export const { models: todoSchemas } = new Elysia().model({
  select: todoSelectSchema,
  insert: todoInsertSchema,
  delete: todoDeleteSchema,
});
