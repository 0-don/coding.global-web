/* eslint-disable no-undef */
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL);

try {
  // Fetch all table names in the public schema
  const tables = await sql`
    SELECT tablename 
    FROM pg_tables
    WHERE schemaname = 'public'
  `;

  if (tables.count > 0) {
    // Begin transaction
    await sql.begin(async (sql) => {
      for (const table of tables) {
        // Drop each table. Be cautious, this operation cannot be undone.
        await sql.unsafe(
          `DROP TABLE IF EXISTS public.${table.tablename} CASCADE`,
        );
      }
    });
    console.log("All public tables have been dropped.");
  } else {
    console.log("No tables found in the public schema.");
  }
} catch (error) {
  console.error("Error dropping tables:", error);
}
