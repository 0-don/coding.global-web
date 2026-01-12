import { ApiThreadType, ApiThreadTypeValues } from "@/lib/types";
import {
  getApiByGuildIdThreadByThreadType,
  getApiByGuildIdThreadByThreadTypeByThreadId,
  getApiByGuildIdThreadByThreadTypeByThreadIdMessages,
  getApiByGuildIdNews,
  getApiByGuildIdStaff,
  getApiByGuildIdTop,
  getApiByGuildIdWidget,
} from "@/openapi";
import { Elysia, t } from "elysia";

type FetchError = { status: number; data: unknown };

const threadTypeSchema = t.UnionEnum(
  Object.values(ApiThreadTypeValues) as [ApiThreadType, ...ApiThreadType[]],
);

export const botRoute = new Elysia({ prefix: "/bot" })
  .get("/widget", async ({ status }) => {
    try {
      const response = await getApiByGuildIdWidget(
        process.env.NEXT_PUBLIC_GUILD_ID,
      );
      if (response.status !== 200)
        return status(response.status, response.data);
      return response.data;
    } catch (error) {
      const err = error as FetchError;
      return status(err.status, err.data);
    }
  })
  .get("/team", async ({ status }) => {
    try {
      const response = await getApiByGuildIdStaff(
        process.env.NEXT_PUBLIC_GUILD_ID,
      );
      if (response.status !== 200)
        return status(response.status, response.data);
      return response.data;
    } catch (error) {
      const err = error as FetchError;
      return status(err.status, err.data);
    }
  })
  .get("/news", async ({ status }) => {
    try {
      const response = await getApiByGuildIdNews(
        process.env.NEXT_PUBLIC_GUILD_ID,
      );
      if (response.status !== 200)
        return status(response.status, response.data);
      return response.data;
    } catch (error) {
      const err = error as FetchError;
      return status(err.status, err.data);
    }
  })
  .get(
    "/top",
    async ({ query, status }) => {
      try {
        const response = await getApiByGuildIdTop(
          process.env.NEXT_PUBLIC_GUILD_ID,
          { limit: query.limit, days: query.days },
        );
        if (response.status !== 200)
          return status(response.status, response.data);
        return response.data;
      } catch (error) {
        const err = error as FetchError;
        return status(err.status, err.data);
      }
    },
    {
      query: t.Object({
        limit: t.Optional(t.Number()),
        days: t.Optional(t.Number()),
      }),
    },
  )
  .get(
    "/thread/:threadType",
    async ({ params, status }) => {
      try {
        const response = await getApiByGuildIdThreadByThreadType(
          process.env.NEXT_PUBLIC_GUILD_ID!,
          params.threadType,
        );
        if (response.status !== 200)
          return status(response.status, response.data);
        return response.data;
      } catch (error) {
        const err = error as FetchError;
        return status(err.status, err.data);
      }
    },
    { params: t.Object({ threadType: threadTypeSchema }) },
  )
  .get(
    "/thread/:threadType/:threadId",
    async ({ params, status }) => {
      try {
        const response = await getApiByGuildIdThreadByThreadTypeByThreadId(
          process.env.NEXT_PUBLIC_GUILD_ID!,
          params.threadType,
          params.threadId,
        );
        if (response.status !== 200)
          return status(response.status, response.data);
        return response.data;
      } catch (error) {
        const err = error as FetchError;
        return status(err.status, err.data);
      }
    },
    { params: t.Object({ threadType: threadTypeSchema, threadId: t.String() }) },
  )
  .get(
    "/thread/:threadType/:threadId/messages",
    async ({ params, query, status }) => {
      try {
        const response =
          await getApiByGuildIdThreadByThreadTypeByThreadIdMessages(
            process.env.NEXT_PUBLIC_GUILD_ID!,
            params.threadType,
            params.threadId,
            { after: query.after },
          );
        if (response.status !== 200)
          return status(response.status, response.data);
        return response.data;
      } catch (error) {
        const err = error as FetchError;
        return status(err.status, err.data);
      }
    },
    {
      params: t.Object({ threadType: threadTypeSchema, threadId: t.String() }),
      query: t.Object({ after: t.Optional(t.String()) }),
    },
  );
