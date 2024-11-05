import { and, eq, getTableColumns } from "drizzle-orm";
import Elysia, { t } from "elysia";
import { db } from "~/lib/db";
import { comment } from "~/lib/schema";
import { users } from "~/lib/schema/auth";
import { commentInsertSchema, commentSelectSchema } from "~/lib/schema/comment";
import { pageable } from "~/lib/typebox/pageable";
import { authUserGuard, authUserResolve } from "../auth/service";

export const commentRoute = new Elysia({ prefix: "/comment" })
  .get(
    "",
    async ({ query }) => {
      const { email, ...user } = getTableColumns(users);
      const comments = await db
        .select({ ...getTableColumns(comment), user })
        .from(comment)
        .leftJoin(users, eq(comment.userId, users.id));

      return comments;
    },
    // { query: t.Optional(pageable) },
  )
  .guard({ beforeHandle: [authUserGuard] }, (app) =>
    app
      .derive(authUserResolve)
      .post(
        "",
        async ({ body, user }) => {
          const newComment = (
            await db
              .insert(comment)
              .values({ ...body, userId: user.id! })
              .returning()
          ).at(0)!;

          const { email, ...userCols } = getTableColumns(users);

          return (
            await db
              .select({ ...getTableColumns(comment), user: userCols })
              .from(comment)
              .leftJoin(users, eq(comment.userId, users.id))
              .where(eq(comment.id, newComment.id))
          ).at(0)!;
        },
        { body: commentInsertSchema },
      )
      .delete(
        "/:id",
        async ({ params, user }) => {
          return (
            await db
              .delete(comment)
              .where(
                and(eq(comment.id, params.id), eq(comment.userId, user.id!)),
              )
              .returning()
          ).at(0);
        },
        { params: t.Pick(commentSelectSchema, ["id"]) },
      ),
  );
