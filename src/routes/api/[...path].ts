import { APIEvent } from "@solidjs/start/server";
import Elysia from "elysia";
import { commentRoute } from "~/server/comment";

const handler = async (event: APIEvent) => await app.handle(event.request);

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;

export const app = new Elysia({ prefix: "/api", aot: false })
  .use(commentRoute)
  .compile();

export type App = typeof app;
