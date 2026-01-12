import { ApiThreadType, ApiThreadTypeValues } from "@/lib/types";
import {
  GetApiByGuildIdNews200Item,
  GetApiByGuildIdStaff200Item,
  GetApiByGuildIdThreadByThreadType200Item,
  GetApiByGuildIdThreadByThreadTypeByThreadId200,
  GetApiByGuildIdThreadByThreadTypeByThreadIdMessages200,
  GetApiByGuildIdTop200,
  GetApiByGuildIdWidget200,
  getApiByGuildIdThreadByThreadType,
  getApiByGuildIdThreadByThreadTypeByThreadId,
  getApiByGuildIdThreadByThreadTypeByThreadIdMessages,
  getApiByGuildIdNews,
  getApiByGuildIdStaff,
  getApiByGuildIdTop,
  getApiByGuildIdWidget,
} from "@/openapi";
import { Elysia, t } from "elysia";

const threadTypeSchema = t.UnionEnum(
  Object.values(ApiThreadTypeValues) as [ApiThreadType, ...ApiThreadType[]],
);

export const botRoute = new Elysia({ prefix: "/bot" })
  .get("/widget", async ({ status }): Promise<GetApiByGuildIdWidget200> => {
    const response = await getApiByGuildIdWidget(
      process.env.NEXT_PUBLIC_GUILD_ID,
    );
    if (response.status !== 200) {
      throw status(response.status, response.data);
    }
    return response.data;
  })
  .get("/team", async ({ status }): Promise<GetApiByGuildIdStaff200Item[]> => {
    const response = await getApiByGuildIdStaff(
      process.env.NEXT_PUBLIC_GUILD_ID,
    );
    if (response.status !== 200) {
      throw status(response.status, response.data);
    }
    return response.data;
  })
  .get("/news", async ({ status }): Promise<GetApiByGuildIdNews200Item[]> => {
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
    async ({ query, status }): Promise<GetApiByGuildIdTop200> => {
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
    async ({ params, status }): Promise<GetApiByGuildIdThreadByThreadType200Item[]> => {
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
    async ({ params, status }): Promise<GetApiByGuildIdThreadByThreadTypeByThreadId200> => {
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
    { params: t.Object({ threadType: threadTypeSchema, threadId: t.String() }) },
  )
  .get(
    "/thread/:threadType/:threadId/messages",
    async ({ params, query, status }): Promise<GetApiByGuildIdThreadByThreadTypeByThreadIdMessages200> => {
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
