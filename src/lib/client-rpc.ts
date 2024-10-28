import { edenTreaty } from "@elysiajs/eden";
import type { App } from "~/routes/api/[...path]";

export const rpc = edenTreaty<App>(
  typeof window === "undefined"
    ? `http://localhost:${import.meta.env.PORT ?? 3000}`
    : window.location.origin,
);
