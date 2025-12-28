import { botRoute } from "@/server/bot/route";
import { chatRoute } from "@/server/chat/route";
import { todoRoute } from "@/server/todo/route";
import { Elysia } from "elysia";

export const app = new Elysia({ prefix: "/api" })
  .use(todoRoute)
  .use(chatRoute)
  .use(botRoute);

export type App = typeof app;

export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;
export const DELETE = app.handle;
export const PATCH = app.handle;
