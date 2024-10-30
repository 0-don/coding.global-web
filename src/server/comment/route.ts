import { getSession } from "@solid-mediakit/auth";
import { and, eq, getTableColumns } from "drizzle-orm";
import Elysia, { InternalServerError, t } from "elysia";
import { db } from "~/lib/db";
import { users } from "~/lib/schema/auth";
import {
  comment,
  commentInsertSimpleSchema,
  commentSelectSchema,
} from "../../lib/schema/comment";
import { authOptions } from "../auth/auth-options";

export const commentRoute = new Elysia({ prefix: "/comment" })
  .get("", async () => {
    const { email, ...user } = getTableColumns(users);
    const comments = await db
      .select({ ...getTableColumns(comment), user })
      .from(comment)
      .leftJoin(users, eq(comment.userId, users.id));

    return comments;
  })
  .post(
    "",
    async ({ body, request }) => {
      const session = await getSession(request, authOptions);

      if (!session?.user?.name)
        throw new InternalServerError("You must be logged in to comment.");

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
      const session = await getSession(request, authOptions);

      if (!session?.user?.me?.id)
        throw new InternalServerError(
          "You must be logged in to delete a comment.",
        );

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
