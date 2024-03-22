import { Type as t } from "@sinclair/typebox/type";
import { parse } from "~/utils";

const clientEnvSchema = t.Object({
  HOST_URL: t.String({
    minLength: 1,
    error: "VITE_HOST_URL client environment variable is not set!",
  }),
  LANGUAGE_KEY: t.String({
    minLength: 1,
    error: "LANGUAGE_KEY client environment variable is not set!",
  }),
  STAFF_MEMERS_URL: t.String({
    minLength: 1,
    error: "STAFF_MEMERS_URL client environment variable is not set!",
  }),
});

export const clientEnv = parse(clientEnvSchema, {
  HOST_URL: import.meta.env.VITE_HOST_URL,
  LANGUAGE_KEY: "lang",
  STAFF_MEMERS_URL: "https://bot.coding.global/api/693908458986143824/staff",
});
