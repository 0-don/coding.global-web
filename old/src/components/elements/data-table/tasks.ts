export type Task = {
  id: string;
  code: string;
  title: string;
  status: "todo" | "in-progress" | "done" | "cancelled";
  label: "bug" | "feature" | "enhancement" | "documentation";
};

export const tasks: Task[] = [
  {
    id: "ptL0KpX_yRMI98JFr6B3n",
    code: "TASK-33",
    title: "We need to bypass the redundant AI interface!",
    status: "todo",
    label: "bug",
  },
  {
    id: "RsrTg_SmBKPKwbUlr7Ztv",
    code: "TASK-59",
    title:
      "Overriding the capacitor won't do anything, we need to generate the solid state JBOD pixel!",
    status: "in-progress",
    label: "feature",
  },
  {
    id: "ptL0KpX_yRMI98JF1r6B3n",
    code: "TASK-33",
    title: "We need to bypass the redundant AI interface!",
    status: "todo",
    label: "bug",
  },
];
