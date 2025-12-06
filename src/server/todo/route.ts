import { PAGEABLE_LIMIT } from "@/lib/config/constants";
import { db } from "@/lib/db";
import {
  todo,
  todoDeleteSchema,
  todoInsertSchema,
  todoInsertSeedSchema,
  TodoStatus,
  todoStatusEnum,
} from "@/lib/db/todo-db-schema";
import { pageable } from "@/lib/typebox/pageable";
import dayjs from "dayjs";
import { desc, eq, lt } from "drizzle-orm";
import { Elysia } from "elysia";

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
        .limit(query.limit || PAGEABLE_LIMIT);

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
      const start = dayjs().subtract(1, "year").valueOf();
      const end = dayjs().valueOf();
      return dayjs(start + Math.random() * (end - start)).toDate();
    };

    const todos: (typeof todoInsertSeedSchema.static)[] = Array.from(
      { length: 500 },
      (_, i) => ({
        task: `Task ${i}`,
        status: todoStatusEnum[Math.floor(Math.random() * 3)] as TodoStatus,
        createdAt: getRandomDate(),
      }),
    );

    await db.insert(todo).values(todos).execute();
  });
