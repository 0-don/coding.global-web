import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { serverEnv } from "~/utils/env/server";

export const db = drizzle(postgres(serverEnv.DATABASE_URL), {
  schema,
  logger: import.meta.env.DEV,
});
