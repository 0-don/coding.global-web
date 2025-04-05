import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-typebox";
import { Elysia, t } from "elysia";

export const todoStatusEnum = ["DONE", "ACTIVE", "PENDING"] as const;

export const todoStatus = pgEnum("todoStatus", todoStatusEnum);

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
export type TodoStatus = (typeof todoStatusEnum)[number];

export const todoInsertSchema = t.Omit(todoSelectSchema, [
  "id",
  "status",
  "createdAt",
]);
export const todoInsertSeedSchema = t.Omit(todoSelectSchema, ["id"]);
export const todoDeleteSchema = t.Pick(todoSelectSchema, ["id"]);

