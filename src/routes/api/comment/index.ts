import { getSession } from "@solid-mediakit/auth";
import { and, eq, getTableColumns } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { db } from "~/routes/api/db";
import { authOpts } from "../auth/config";
import { users } from "../schema";
import {
  comment,
  commentInsertSimpleSchema,
  commentSelectSchema,
} from "./schema";

export const commentRoute = new Elysia({ prefix: "/comment" })
  .get("", async () => {
    const { email, ...user } = getTableColumns(users);
    return await db
      .select({ ...getTableColumns(comment), user })
      .from(comment)
      .leftJoin(users, eq(comment.userId, users.id));
  })
  .post(
    "",
    async ({ body, request }) => {
      const session = await getSession(request, authOpts);

      if (!session?.user?.name)
        throw new Error("You must be logged in to comment.");

      const newComment = (
        await db
          .insert(comment)
          .values({ ...body, userId: session.user.me.id! })
          .returning()
      ).at(0)!;

      const { email, ...user } = getTableColumns(users);

      return (
        await db
          .select({ ...getTableColumns(comment), user })
          .from(comment)
          .leftJoin(users, eq(comment.userId, users.id))
          .where(eq(comment.id, newComment.id))
      ).at(0)!;
    },
    { body: commentInsertSimpleSchema },
  )
  .delete(
    "/:id",
    async ({ params, request }) => {
      const session = await getSession(request, authOpts);

      if (!session?.user?.me?.id)
        throw new Error("You must be logged in to delete a comment.");

      return (
        await db
          .delete(comment)
          .where(
            and(
              eq(comment.id, params.id),
              eq(comment.userId, session?.user?.me?.id),
            ),
          )
          .returning()
      ).at(0);
    },
    { params: t.Pick(commentSelectSchema, ["id"]) },
  );
