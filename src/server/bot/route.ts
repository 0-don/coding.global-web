import { ApiThreadType } from "@/lib/types";
import {
  GetApiByGuildIdThreadByThreadTypeByThreadIdMessages200,
  GetApiByGuildIdThreadByThreadTypeByThreadIdThreadType,
  getApiByGuildIdNews,
  getApiByGuildIdStaff,
  getApiByGuildIdThreadByThreadType,
  getApiByGuildIdThreadByThreadTypeByThreadId,
  getApiByGuildIdThreadByThreadTypeByThreadIdMessages,
  getApiByGuildIdTop,
  getApiByGuildIdWidget
} from "@/openapi";
import { Elysia, t } from "elysia";

const threadTypeSchema = t.UnionEnum(
  Object.values(GetApiByGuildIdThreadByThreadTypeByThreadIdThreadType) as [
    ApiThreadType,
    ...ApiThreadType[],
  ],
);

export const botRoute = new Elysia({ prefix: "/bot" })
  .get("/widget", async ({ status }) => {
    const response = await getApiByGuildIdWidget(
      process.env.NEXT_PUBLIC_GUILD_ID,
    );
    if (response.status !== 200) {
      throw status(response.status, response.data);
    }
    return response.data;
  })
  .get("/team", async ({ status }) => {
    const response = await getApiByGuildIdStaff(
      process.env.NEXT_PUBLIC_GUILD_ID,
    );
    if (response.status !== 200) {
      throw status(response.status, response.data);
    }
    return response.data;
  })
  .get("/news", async ({ status }) => {
    const response = await getApiByGuildIdNews(
      process.env.NEXT_PUBLIC_GUILD_ID,
    );
    if (response.status !== 200) {
      throw status(response.status, response.data);
    }
    return response.data;
  })
  .get(
    "/top",
    async ({ query, status }) => {
      const response = await getApiByGuildIdTop(
        process.env.NEXT_PUBLIC_GUILD_ID,
        { limit: query.limit, days: query.days },
      );
      if (response.status !== 200) {
        throw status(response.status, response.data);
      }
      return response.data;
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
      const response = await getApiByGuildIdThreadByThreadType(
        process.env.NEXT_PUBLIC_GUILD_ID!,
        params.threadType,
      );
      if (response.status !== 200) {
        throw status(response.status, response.data);
      }
      return response.data;
    },
    { params: t.Object({ threadType: threadTypeSchema }) },
  )
  .get(
    "/thread/:threadType/:threadId",
    async ({
      params,
      status,
    }) => {
      const response = await getApiByGuildIdThreadByThreadTypeByThreadId(
        process.env.NEXT_PUBLIC_GUILD_ID!,
        params.threadType,
        params.threadId,
      );
      if (response.status !== 200) {
        throw status(response.status, response.data);
      }
      return response.data;
    },
    {
      params: t.Object({ threadType: threadTypeSchema, threadId: t.String() }),
    },
  )
  .get(
    "/thread/:threadType/:threadId/messages",
    async ({
      params,
      query,
      status,
    }): Promise<GetApiByGuildIdThreadByThreadTypeByThreadIdMessages200> => {
      const response =
        await getApiByGuildIdThreadByThreadTypeByThreadIdMessages(
          process.env.NEXT_PUBLIC_GUILD_ID!,
          params.threadType,
          params.threadId,
          { after: query.after },
        );
      if (response.status !== 200) {
        throw status(response.status, response.data);
      }
      return response.data;
    },
    {
      params: t.Object({ threadType: threadTypeSchema, threadId: t.String() }),
      query: t.Object({ after: t.Optional(t.String()) }),
    },
  );
