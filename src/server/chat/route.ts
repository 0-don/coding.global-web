import { PAGEABLE_LIMIT } from "@/lib/config/constants";
import { db } from "@/lib/db";
import { users } from "@/lib/db-schema/auth-db-schema";
import {
  comment,
  commentInsertSchema,
  commentSelectSchema,
} from "@/lib/db-schema/comment-db-schema";
import { pageable } from "@/lib/typebox/pageable";
import { and, desc, eq, getTableColumns, gt } from "drizzle-orm";
import Elysia, { t } from "elysia";
import { authUserGuard, authUserResolve } from "../auth/guard";

export const chatRoute = new Elysia({ prefix: "/chat" })
  .get(
    "",
    async ({ query }) => {
      const { email, ...user } = getTableColumns(users);

      const comments = await db
        .select({ ...getTableColumns(comment), user: user })
        .from(comment)
        .leftJoin(users, eq(comment.userId, user.id))
        .where(
          query.cursor
            ? gt(comment.createdAt, new Date(query.cursor))
            : undefined,
        )
        .orderBy(desc(comment.createdAt))
        .limit(query.limit || PAGEABLE_LIMIT);

      return comments.reverse();
    },
    { query: t.Optional(pageable) },
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
        async ({ params, user }) =>
          (
            await db
              .delete(comment)
              .where(
                and(eq(comment.id, params.id), eq(comment.userId, user.id!)),
              )
              .returning()
          ).at(0)!,
        { params: t.Pick(commentSelectSchema, ["id"]) },
      ),
  );
