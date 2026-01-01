import { restore } from "@orama/plugin-data-persistence";
import { Elysia } from "elysia";

export const searchRoute = new Elysia({ prefix: "/search" }).get(
  "/index",
  async ({ status }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/search-index.json`,
      );
      if (!response.ok) {
        return status("Not Found", "Search index not found");
      }
      const data = await response.json();
      return restore("json", data);
    } catch (error) {
      return status("Internal Server Error", error as Error);
    }
  },
);
