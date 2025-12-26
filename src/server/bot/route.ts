import {
  getApiByGuildIdBoardByBoardType,
  getApiByGuildIdBoardByBoardTypeByThreadId,
  getApiByGuildIdBoardByBoardTypeByThreadIdMessages,
  getApiByGuildIdNews,
  getApiByGuildIdStaff,
  getApiByGuildIdWidget,
} from "@/openapi";
import { Elysia, t } from "elysia";

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
  .get("/showcase", async ({ status }) => {
    try {
      const response = await getApiByGuildIdBoardByBoardType(
        process.env.NEXT_PUBLIC_GUILD_ID!,
        "showcase",
      );
      console.log(response);
      if (response.status !== 200)
        return status("Unprocessable Content", response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      return status("Internal Server Error", error as Error);
    }
  })
  .get("/showcase/:threadId", async ({ params, status }) => {
    try {
      const response = await getApiByGuildIdBoardByBoardTypeByThreadId(
        process.env.NEXT_PUBLIC_GUILD_ID!,
        "showcase",
        params.threadId,
      );
      if (response.status !== 200)
        return status("Unprocessable Content", response.data);
      return response.data;
    } catch (error) {
      return status("Internal Server Error", error as Error);
    }
  })
  .get(
    "/showcase/:threadId/messages",
    async ({ params, query, status }) => {
      try {
        const response =
          await getApiByGuildIdBoardByBoardTypeByThreadIdMessages(
            process.env.NEXT_PUBLIC_GUILD_ID!,
            "showcase",
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
    { query: t.Object({ after: t.Optional(t.String()) }) },
  )
  .get("/job-board", async ({ status }) => {
    try {
      const response = await getApiByGuildIdBoardByBoardType(
        process.env.NEXT_PUBLIC_GUILD_ID!,
        "job-board",
      );
      if (response.status !== 200)
        return status("Unprocessable Content", response.data);
      return response.data;
    } catch (error) {
      return status("Internal Server Error", error as Error);
    }
  })
  .get("/job-board/:threadId", async ({ params, status }) => {
    try {
      const response = await getApiByGuildIdBoardByBoardTypeByThreadId(
        process.env.NEXT_PUBLIC_GUILD_ID!,
        "job-board",
        params.threadId,
      );
      if (response.status !== 200)
        return status("Unprocessable Content", response.data);
      return response.data;
    } catch (error) {
      return status("Internal Server Error", error as Error);
    }
  })
  .get(
    "/job-board/:threadId/messages",
    async ({ params, query, status }) => {
      try {
        const response =
          await getApiByGuildIdBoardByBoardTypeByThreadIdMessages(
            process.env.NEXT_PUBLIC_GUILD_ID!,
            "job-board",
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
    { query: t.Object({ after: t.Optional(t.String()) }) },
  )
  .get("/dev-board", async ({ status }) => {
    try {
      const response = await getApiByGuildIdBoardByBoardType(
        process.env.NEXT_PUBLIC_GUILD_ID!,
        "dev-board",
      );
      if (response.status !== 200)
        return status("Unprocessable Content", response.data);
      return response.data;
    } catch (error) {
      return status("Internal Server Error", error as Error);
    }
  })
  .get("/dev-board/:threadId", async ({ params, status }) => {
    try {
      const response = await getApiByGuildIdBoardByBoardTypeByThreadId(
        process.env.NEXT_PUBLIC_GUILD_ID!,
        "dev-board",
        params.threadId,
      );
      if (response.status !== 200)
        return status("Unprocessable Content", response.data);
      return response.data;
    } catch (error) {
      return status("Internal Server Error", error as Error);
    }
  })
  .get(
    "/dev-board/:threadId/messages",
    async ({ params, query, status }) => {
      try {
        const response =
          await getApiByGuildIdBoardByBoardTypeByThreadIdMessages(
            process.env.NEXT_PUBLIC_GUILD_ID!,
            "dev-board",
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
    { query: t.Object({ after: t.Optional(t.String()) }) },
  );
