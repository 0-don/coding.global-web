import { log } from "console";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { resolve } from "path";
import postgres from "postgres";

const connection = postgres(process.env.DATABASE_URL!);
export const db = drizzle(connection);

migrate(db, { migrationsFolder: resolve("drizzle") })
  .then(() => log("Database migrated successfully"))
  .catch((e) => console.error("Database migration failed", e));
