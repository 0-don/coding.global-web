import { Elysia } from "elysia";
import { commentRoute } from "~/server/comment/route";
import { todoRoute } from "./todo/route";

export const app = new Elysia({ prefix: "/api", aot: false })
  .use(todoRoute)
  .use(commentRoute);

export type App = typeof app;
