import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { db } from "~/lib/db";
import { todo } from "~/lib/schema";
import { todoDeleteSchema, todoInsertSchema } from "~/lib/schema/todo";

export const todoRoute = new Elysia({ prefix: "/todo" })
  .get("", async () => await db.select().from(todo))
  .post(
    "",
    async ({ body }) => (await db.insert(todo).values(body).returning()).at(0),
    { body: todoInsertSchema },
  )
  .delete(
    "/:id",
    async ({ params }) =>
      (await db.delete(todo).where(eq(todo.id, params.id)).returning()).at(0)
        ?.id,
    { params: todoDeleteSchema },
  );
