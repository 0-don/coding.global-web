import dayjs from "dayjs";
import { desc, eq, lt } from "drizzle-orm";
import { Elysia } from "elysia";
import { db } from "~/lib/db";
import { todo } from "~/lib/schema";
import {
  todoDeleteSchema,
  todoInsertSchema,
  todoInsertSeedSchema,
} from "~/lib/schema/todo";
import { pageable } from "~/lib/typebox/pageable";

export const todoRoute = new Elysia({ prefix: "/todo" })
  .get(
    "",
    async ({ query }) => {
      const result = await db
        .select()
        .from(todo)
        .where(
          query.cursor ? lt(todo.createdAt, new Date(query.cursor)) : undefined,
        )
        .orderBy(desc(todo.createdAt))
        .limit(query.limit || pageable.properties.limit.default);

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
  )
  .get("/seed", async () => {
    await db.delete(todo).execute();

    const getRandomDate = () => {
      // Random date between 1 year ago and now
      const start = dayjs().subtract(1, "year").valueOf();
      const end = dayjs().valueOf();
      return new Date(start + Math.random() * (end - start));
    };

    const todos: (typeof todoInsertSeedSchema.static)[] = Array.from(
      { length: 500 },
      (_, i) => ({
        task: `Task ${i}`,
        createdAt: getRandomDate(),
      }),
    );

    await db.insert(todo).values(todos).execute();
  });
