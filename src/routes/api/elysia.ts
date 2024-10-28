import Elysia from "elysia";
import { commentRoute } from "~/server/comment/route";

export const app = new Elysia({ prefix: "/api", aot: false }).use(commentRoute);

export type App = typeof app;
