import { error, log } from "console";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { resolve } from "path";
import postgres from "postgres";

export const db = drizzle(
  postgres(process.env.DATABASE_URL!, { onnotice: () => {} }),
);

migrate(db, { migrationsFolder: resolve("drizzle") })
  .then(() => log("Database migrated successfully"))
  .catch((e) => error("Database migration failed", e));
