import { botRoute } from "@/server/bot/route";
import { chatRoute } from "@/server/chat/route";
import { searchRoute } from "@/server/search/route";
import { Elysia } from "elysia";

export const app = new Elysia({ prefix: "/api" })
  .use(chatRoute)
  .use(botRoute)
  .use(searchRoute);

export type App = typeof app;

export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;
export const DELETE = app.handle;
export const PATCH = app.handle;
