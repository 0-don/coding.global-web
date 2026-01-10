import { ApiBoardType, ApiBoardTypeValues } from "@/lib/types";
import {
  getApiByGuildIdBoardByBoardType,
  getApiByGuildIdBoardByBoardTypeByThreadId,
  getApiByGuildIdBoardByBoardTypeByThreadIdMessages,
  getApiByGuildIdNews,
  getApiByGuildIdStaff,
  getApiByGuildIdTop,
  getApiByGuildIdWidget,
} from "@/openapi";
import { Elysia, t } from "elysia";

const boardTypeSchema = t.UnionEnum(
  Object.values(ApiBoardTypeValues) as [ApiBoardType, ...ApiBoardType[]],
);

export const botRoute = new Elysia({ prefix: "/bot" })
  .get("/widget", async ({ status }) => {
    try {
      const response = await getApiByGuildIdWidget(
        process.env.NEXT_PUBLIC_GUILD_ID,
      );
      if (response.status !== 200)
        return status("Unprocessable Content", response.data);
      return response.data;
    } catch (error) {
      return status("Internal Server Error", error as Error);
    }
  })
  .get("/team", async ({ status }) => {
    try {
      const response = await getApiByGuildIdStaff(
        process.env.NEXT_PUBLIC_GUILD_ID,
      );
      if (response.status !== 200)
        return status("Unprocessable Content", response.data);
      return response.data;
    } catch (error) {
      return status("Internal Server Error", error as Error);
    }
  })
  .get("/news", async ({ status }) => {
    try {
      const response = await getApiByGuildIdNews(
        process.env.NEXT_PUBLIC_GUILD_ID,
      );
      if (response.status !== 200)
        return status("Unprocessable Content", response.data);
      return response.data;
    } catch (error) {
      return status("Internal Server Error", error as Error);
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
          return status("Unprocessable Content", response.data);
        return response.data;
      } catch (error) {
        return status("Internal Server Error", error as Error);
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
    "/board/:boardType",
    async ({ params, status }) => {
      try {
        const response = await getApiByGuildIdBoardByBoardType(
          process.env.NEXT_PUBLIC_GUILD_ID!,
          params.boardType,
        );
        if (response.status !== 200)
          return status("Unprocessable Content", response.data);
        return response.data;
      } catch (error) {
        return status("Internal Server Error", error as Error);
      }
    },
    { params: t.Object({ boardType: boardTypeSchema }) },
  )
  .get(
    "/board/:boardType/:threadId",
    async ({ params, status }) => {
      try {
        const response = await getApiByGuildIdBoardByBoardTypeByThreadId(
          process.env.NEXT_PUBLIC_GUILD_ID!,
          params.boardType,
          params.threadId,
        );
        if (response.status !== 200)
          return status("Unprocessable Content", response.data);
        return response.data;
      } catch (error) {
        return status("Internal Server Error", error as Error);
      }
    },
    { params: t.Object({ boardType: boardTypeSchema, threadId: t.String() }) },
  )
  .get(
    "/board/:boardType/:threadId/messages",
    async ({ params, query, status }) => {
      try {
        const response =
          await getApiByGuildIdBoardByBoardTypeByThreadIdMessages(
            process.env.NEXT_PUBLIC_GUILD_ID!,
            params.boardType,
            params.threadId,
            { after: query.after },
          );
        if (response.status !== 200)
          return status("Unprocessable Content", response.data);
        return response.data;
      } catch (error) {
        return status("Internal Server Error", error as Error);
      }
    },
    {
      params: t.Object({ boardType: boardTypeSchema, threadId: t.String() }),
      query: t.Object({ after: t.Optional(t.String()) }),
    },
  );
