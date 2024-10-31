import { Elysia } from "elysia";
import { commentRoute } from "~/server/comment/route";
import { todoRoute } from "../server/todo/route";

export const app = new Elysia({ prefix: "/api" })
  .use(todoRoute)
  .use(commentRoute)
  .compile();

export type App = typeof app;
