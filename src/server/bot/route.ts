import {
  getApiByGuildIdBoardByBoardType,
  getApiByGuildIdBoardByBoardTypeByThreadId,
  getApiByGuildIdNews,
  getApiByGuildIdStaff,
  getApiByGuildIdWidget,
} from "@/openapi";
import Elysia from "elysia";

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
      if (response.status !== 200)
        return status("Unprocessable Content", response.data);
      return response.data;
    } catch (error) {
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
  });
