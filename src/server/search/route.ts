import { Elysia } from "elysia";

export const searchRoute = new Elysia({ prefix: "/search" }).get(
  "",
  async ({ status }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/search-index.json`,
      );

      if (!response.ok) {
        return status("Not Found", "Search index not found");
      }
      return response.json();
    } catch (error) {
      return status("Internal Server Error", error as Error);
    }
  },
);
