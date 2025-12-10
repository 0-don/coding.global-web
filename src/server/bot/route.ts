import { getApiByGuildIdNews, getApiByGuildIdStaff } from "@/openapi";
import Elysia, { InternalServerError } from "elysia";

export const botRoute = new Elysia({ prefix: "/bot" })
  .get("/staff", async () => {
    try {
      const { data, status } = await getApiByGuildIdStaff(
        process.env.NEXT_PUBLIC_GUILD_ID,
      );
      if (status !== 200) throw data;
      return data;
    } catch (error) {
      return new InternalServerError(error as string);
    }
  })
  .get("/news", async () => {
    try {
      const { data, status } = await getApiByGuildIdNews(
        process.env.NEXT_PUBLIC_GUILD_ID,
      );
      if (status !== 200) throw data;
      return data;
    } catch (error) {
      return new InternalServerError(error as string);
    }
  });
