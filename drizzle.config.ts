import type { Config } from "drizzle-kit";
import {  } from "drizzle-orm/pg-core";

if (!process.env.DATABASE_URL)
  throw new Error("DATABASE_URL environment variable is not set!");

console.log("DATABASE_URL: ", process.env.DATABASE_URL);

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
