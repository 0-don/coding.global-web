import { Elysia } from "elysia";

export const commentRoute = new Elysia({ prefix: "/comment" }).get(
  "",
  async () => {
    // const { email, ...user } = getTableColumns(users);

    // const comments = await db
    //   .select({ ...getTableColumns(comment), user })
    //   .from(comment)
    //   .leftJoin(users, eq(comment.userId, users.id));

    return "comments";
  },
);
