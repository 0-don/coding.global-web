import { handleElysia } from "@/lib/utils/base";
import { getApiByGuildIdNews, getApiByGuildIdStaff } from "@/openapi";
import Elysia, { InternalServerError } from "elysia";

export const botRoute = new Elysia({ prefix: "/bot" })
  .get("/staff", async () => {
    try {
      return handleElysia(
        await getApiByGuildIdStaff(process.env.NEXT_PUBLIC_GUILD_ID),
      );
    } catch (error) {
      return new InternalServerError(error as string);
    }
  })
  .get("/news", async () => {
    try {
      return handleElysia(
        await getApiByGuildIdNews(process.env.NEXT_PUBLIC_GUILD_ID),
      );
    } catch (error) {
      return new InternalServerError(error as string);
    }
  });
