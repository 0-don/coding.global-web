import { desc, eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { db } from "~/lib/db";
import { todo } from "~/lib/schema";
import { todoDeleteSchema, todoInsertSchema } from "~/lib/schema/todo";
import { pageable } from "~/lib/typebox/pageable";

export const todoRoute = new Elysia({ prefix: "/todo" })
  .get(
    "",
    async ({ query }) => {
      console.log("query", query, !!query.cursor);

      const result = await db
        .select()
        .from(todo)
        // .where(
        //   query.cursor ? lt(todo.createdAt, new Date(query.cursor)) : undefined,
        // )
        .orderBy(desc(todo.createdAt))
        .limit(20);

      return result;
    },
    { query: pageable },
  )
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
