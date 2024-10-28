import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const DATABASE_URL = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}/${process.env.POSTGRES_DB}`;

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/routes/api/schema.ts",
  out: "./db.migrations",
  dbCredentials: { url: DATABASE_URL },
  // Print all statements
  verbose: false,
  // Always ask for confirmation
  strict: false,
});
