import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-typebox";
import { Elysia, t } from "elysia";

export const todo = pgTable("todo", {
  id: uuid("id").primaryKey().defaultRandom(),
  data: text("data").notNull(),
});

export const todoSelectSchema = createSelectSchema(todo, {
  data: t.String({ minLength: 1, default: "" }),
});
export type Todo = typeof todoSelectSchema.static;
export const todoInsertSchema = t.Omit(todoSelectSchema, ["id"]);
export const todoDeleteSchema = t.Pick(todoSelectSchema, ["id"]);

export const { models: todoSchemas } = new Elysia().model({
  select: todoSelectSchema,
  insert: todoInsertSchema,
  delete: todoDeleteSchema,
});
