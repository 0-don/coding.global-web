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
    async ({ body }) => {
      const [result] = await db
        .insert(comment)
        .values({ ...body, user: "test" })
        .returning();
      console.log(result);
      return result;
    },
    { body: commentInsertSimpleSchema },
  )
  .delete(
    "/:id",
    async ({ params }) =>
      await db.delete(comment).where(eq(comment.id, params.id)),
    { params: t.Pick(commentSelectSchema, ["id"]) },
  );
