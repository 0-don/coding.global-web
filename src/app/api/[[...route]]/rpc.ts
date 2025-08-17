import { api } from "@/app/api/[[...route]]/route";
import { edenTreaty } from "@elysiajs/eden";

export const rpc = edenTreaty<typeof api>(
  typeof window === "undefined"
    ? `http://localhost:${process.env.PORT || 3000}`
    : window.location.origin,
);