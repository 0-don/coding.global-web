import { Elysia } from "elysia";
import { commentRoute } from "./comment";

export const app = new Elysia({ prefix: "/api" }).use(commentRoute).compile();

export type App = typeof app;
