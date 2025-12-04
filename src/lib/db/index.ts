import { getTableColumns, sql } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";

export { account, session, user, verification } from "./auth-db-schema";
export { comment } from "./comment-db-schema";
export { todo, todoStatus } from "./todo-db-schema";

export function conflictUpdateAllExcept<
  T extends PgTable,
  E extends (keyof T["$inferInsert"])[],
>(table: T, except: E) {
  const columns = getTableColumns(table);
  const updateColumns = Object.entries(columns).filter(
    ([col]) => !except.includes(col as keyof typeof table.$inferInsert),
  );

  return updateColumns.reduce(
    (acc, [colName, column]) => ({
      ...acc,
      [colName]: sql.raw(`excluded."${column.name}"`),
    }),
    {},
  );
}
