import { treaty } from "@elysiajs/eden";
import { App } from "../server/server";

export const rpc = treaty<App>(
  typeof window === "undefined"
    ? `http://localhost:${process.env.PORT ?? 3000}`
    : window.location.origin,
);
