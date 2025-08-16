import type { ColumnDef } from "@tanstack/solid-table";
import { Task } from "./tasks";

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "code",
    header: "Task",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];
