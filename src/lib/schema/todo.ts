import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-typebox";
import { Elysia, t } from "elysia";

export const todoStatus = pgEnum("todoStatus", ["DONE", "ACTIVE", "PENDING"]);

export const todo = pgTable("todo", {
  id: uuid("id").primaryKey().defaultRandom(),
  task: varchar("task", { length: 4096 }).notNull(),
  status: todoStatus("status").default("PENDING").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const todoSelectSchema = createSelectSchema(todo, {
  task: t.String({ minLength: 1, maxLength: 4096, default: "" }),
});

export type Todo = typeof todoSelectSchema.static;
export type TodoStatus = (typeof todoStatus.enumValues)[number];

export const todoInsertSchema = t.Omit(todoSelectSchema, [
  "id",
  "status",
  "createdAt",
]);
export const todoInsertSeedSchema = t.Omit(todoSelectSchema, ["id"]);
export const todoDeleteSchema = t.Pick(todoSelectSchema, ["id"]);

export const { models: todoSchemas } = new Elysia().model({
  select: todoSelectSchema,
  insert: todoInsertSchema,
  delete: todoDeleteSchema,
});
