import { log } from "console";
import { DrizzleConfig } from "drizzle-orm";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { resolve } from "path";
import postgres from "postgres";
import * as schema from "~/lib/schema";
import { serverEnv } from "../utils/env/server";

const connection = postgres(serverEnv.DATABASE_URL, { onnotice: () => {} });

const options: DrizzleConfig<typeof schema> = {
  schema,
  logger: !!import.meta.env.DEV,
};

export const db = drizzlePostgres(connection, options);

migrate(db, { migrationsFolder: resolve("db.migrations") })
  .then(() => log("Database migrated successfully"))
  .catch(() => process.exit(1));
