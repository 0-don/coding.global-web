import { Type as t } from "@sinclair/typebox/type";
import { parse } from "~/utils/base";

const clientEnvSchema = t.Object({
  HOST_URL: t.String({
    minLength: 1,
    error: "VITE_HOST_URL client environment variable is not set!",
  }),
  LANGUAGE_KEY: t.String({
    minLength: 1,
    error: "LANGUAGE_KEY client environment variable is not set!",
    default: "lang",
  }),
  STAFF_MEMERS_URL: t.String({
    minLength: 1,
    error: "STAFF_MEMERS_URL client environment variable is not set!",
    default: "https://bot.coding.global/api/693908458986143824/staff",
  }),
  LANGUAGES: t.Array(t.Union([t.Literal("de"), t.Literal("en")]), {
    minLength: 3,
    error: "LANGUAGES client environment variable is not set!",
    default: ["de", "en"],
  }),
});

export const clientEnv = parse(clientEnvSchema, import.meta.env);
