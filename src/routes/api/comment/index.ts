import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { db } from "~/routes/api/db";
import {
  comment,
  commentInsertSimpleSchema,
  commentSelectSchema,
} from "./schema";

export const commentRoute = new Elysia({ prefix: "/comment" })
  .get("", async () => await db.select().from(comment))
  .post(
    "",
    async ({ body }) =>
      (
        await db
          .insert(comment)
          .values({ ...body, user: "test" })
          .returning()
      ).at(0)!,
    { body: commentInsertSimpleSchema },
  )
  .delete(
    "/:id",
    async ({ params }) =>
      await db.delete(comment).where(eq(comment.id, params.id)),
    { params: t.Pick(commentSelectSchema, ["id"]) },
  );
