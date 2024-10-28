import { log } from "console";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { resolve } from "path";
import postgres from "postgres";
import { serverEnv } from "~/utils/env/server";
import { accounts, users } from "../../server/auth/schema";
import { comment } from "../../server/comment/schema";

const connection = postgres(serverEnv.DATABASE_URL, { onnotice: () => {} });

export const db = drizzle(connection, {
  schema: {
    accounts,
    users,
    comment,
  },
});

(async () => {
  await migrate(db, { migrationsFolder: resolve("db.migrations") });
  log("Database migrated successfully");
})();
