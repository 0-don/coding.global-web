import { getSession } from "@solid-mediakit/auth";
import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { db } from "~/routes/api/db";
import { authOpts } from "../auth/config";
import {
  comment,
  commentInsertSimpleSchema,
  commentSelectSchema,
} from "./schema";

export const commentRoute = new Elysia({ prefix: "/comment" })
  .get("", async () => await db.select().from(comment))
  .post(
    "",
    async ({ body, request }) => {
      const session = await getSession(request, authOpts);

      if (!session?.user?.name)
        throw new Error("You must be logged in to comment.");

      console.log(session);

      return (
        await db
          .insert(comment)
          .values({ ...body, userId: session.user.name })
          .returning()
      ).at(0)!;
    },
    { body: commentInsertSimpleSchema },
  )
  .delete(
    "/:id",
    async ({ params }) =>
      (
        await db.delete(comment).where(eq(comment.id, params.id)).returning()
      ).at(0),
    { params: t.Pick(commentSelectSchema, ["id"]) },
  );
