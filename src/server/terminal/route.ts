import {
  getApiByGuildIdMembers,
  getApiByGuildIdTop,
  getApiByGuildIdUserByUserId,
  getApiByGuildIdUserSearch,
} from "@/openapi";
import { Elysia, t } from "elysia";

export const terminalRoute = new Elysia({ prefix: "/terminal" })
  .get("/members", async ({ status }) => {
    try {
      const response = await getApiByGuildIdMembers(
        process.env.NEXT_PUBLIC_GUILD_ID!,
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
          process.env.NEXT_PUBLIC_GUILD_ID!,
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
        limit: t.Optional(t.Number({ default: 5, minimum: 1, maximum: 10 })),
        days: t.Optional(t.Number({ default: 9999, minimum: 1, maximum: 9999 })),
      }),
    },
  )
  .get(
    "/user/search",
    async ({ query, status }) => {
      try {
        const response = await getApiByGuildIdUserSearch(
          process.env.NEXT_PUBLIC_GUILD_ID!,
          { q: query.q, limit: query.limit },
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
        q: t.String(),
        limit: t.Optional(t.Number({ default: 10, minimum: 1, maximum: 50 })),
      }),
    },
  )
  .get(
    "/user/:userId",
    async ({ params, status }) => {
      try {
        const response = await getApiByGuildIdUserByUserId(
          process.env.NEXT_PUBLIC_GUILD_ID!,
          params.userId,
        );
        if (response.status !== 200)
          return status("Unprocessable Content", response.data);
        return response.data;
      } catch (error) {
        return status("Internal Server Error", error as Error);
      }
    },
    {
      params: t.Object({ userId: t.String() }),
    },
  );
