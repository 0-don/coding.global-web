import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { log } from "console";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { resolve } from "path";
import postgres from "postgres";
import { serverEnv } from "~/utils/env/server";
import * as schema from "./schema";

const connection = postgres(serverEnv.DATABASE_URL, { onnotice: () => {} });

export const db = drizzle(connection, { schema });

export const dbAdapter = DrizzleAdapter(db);

console.log(dbAdapter);

(async () => {
  await migrate(db, { migrationsFolder: resolve("db.migrations") });

  log("Database migrated successfully");
})();
