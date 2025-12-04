import { Elysia, InternalServerError } from "elysia";

const API_URL = process.env.API_URL;
const SERVER = process.env.SERVER_ID;

const app = new Elysia({ prefix: "/api" })
  .get("/test", () => "hello")
  .get("/team", async () => {
    try {
      const response = await fetch(
        `https://bot.coding.global/api/693908458986143824/staff`,
      );

      if (!response.ok) {
        throw new InternalServerError(
          `Failed to fetch staff data: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching team data:", error);
      return { error: "Unable to fetch team data" };
    }
  })
  .get("/news", async () => {
    try {
      const response = await fetch(
        `https://bot.coding.global/api/693908458986143824/news`,
      );

      if (!response.ok) {
        throw new InternalServerError(
          `Failed to fetch data: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return { error: "Unable to fetch data" };
    }
  });

export type App = typeof app;

export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;
export const DELETE = app.handle;
export const PATCH = app.handle;
