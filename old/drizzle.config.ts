import { config } from "@dotenvx/dotenvx";
import type { Config } from "drizzle-kit";

config();

if (!process.env.DATABASE_URL)
  throw new Error("DATABASE_URL environment variable is not set!");

export default {
  dialect: "postgresql",
  schema: "./src/lib/schema/index.ts",
  out: "./db.migrations",
  dbCredentials: { url: process.env.DATABASE_URL },
} satisfies Config;
