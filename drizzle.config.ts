import type { Config } from "drizzle-kit";
import postgres from "postgres";

if (!process.env.DATABASE_URL)
  throw new Error("DATABASE_URL environment variable is not set!");

const pg = postgres(process.env.DATABASE_URL);

async function createDatabaseIfNotExists(dbName: string) {
  const exists = await pg`SELECT 1 FROM pg_database WHERE datname = ${dbName}`;
  if (exists.count === 0) {
    await pg.unsafe(`CREATE DATABASE ${dbName}`);
  }
}

await createDatabaseIfNotExists(process.env.POSTGRES_DB);

export default {
  driver: "pg",
  schema: "./src/routes/api/schema.ts",
  out: "./src/utils/db.migrations",
  dbCredentials: { connectionString: process.env.DATABASE_URL },
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true,
} satisfies Config;
