import { Type as t } from "@sinclair/typebox/type";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { parse } from "~/utils";
import * as schema from "./schema";

const serverEnvSchema = t.Object({
  DATABASE_URL: t.String({
    minLength: 1,
    error: "DATABASE_URL server environment variable is not set!",
  }),
});

const serverEnv = parse(serverEnvSchema, {
  DATABASE_URL: import.meta.env.DATABASE_URL,
});

export const db = drizzle(postgres(serverEnv.DATABASE_URL), {
  schema,
  logger: import.meta.env.DEV,
});
