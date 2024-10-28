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
  }),
  STAFF_MEMERS_URL: t.String({
    minLength: 1,
    error: "STAFF_MEMERS_URL client environment variable is not set!",
  }),
  LANGUAGES: t.Array(t.Union([t.Literal("de"), t.Literal("en")]), {
    minLength: 3,
    error: "LANGUAGES client environment variable is not set!",
  }),
});

export const clientEnv = parse(clientEnvSchema, import.meta.env);
