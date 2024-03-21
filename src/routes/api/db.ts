import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { serverEnv } from "~/utils/env/server";
import * as schema from "./schema";

const pg = postgres(process.env.DATABASE_URL);

const createDatabaseIfNotExists = async (dbName: string) =>
  (await pg`SELECT 1 FROM pg_database WHERE datname = ${dbName}`).count === 0 &&
  (await pg.unsafe(`CREATE DATABASE ${dbName}`));

await createDatabaseIfNotExists(process.env.POSTGRES_DB);

export const db = drizzle(postgres(serverEnv.DATABASE_URL), {
  schema,
  logger: import.meta.env.DEV,
});
