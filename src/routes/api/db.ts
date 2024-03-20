import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { serverEnv } from "~/utils/env/server";
import * as schema from "./schema";

console.log("serverEnv.DATABASE_URL", serverEnv.DATABASE_URL);

export const db = drizzle(postgres(serverEnv.DATABASE_URL), {
  schema,
  logger: import.meta.env.DEV,
});
