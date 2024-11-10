import { createAsync, query, RouteDefinition } from "@solidjs/router";
import { FaSolidSeedling } from "solid-icons/fa";
import { Header } from "~/components/container/header";
import { Layout } from "~/components/container/layout";
import DataTableDemo from "~/components/elements/data-table/data-table-demo";
import { Task, tasks } from "~/components/elements/data-table/tasks";
import { MetaHead } from "~/components/elements/meta-head";
import { serverFnTodos, TodoHook } from "~/components/hook/todo-hook";
import { useLanguage } from "~/components/provider/language-provider";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

const getData = query(async (): Promise<Task[]> => {
  // Fetch data from your API here.
  return tasks;
}, "data");

export const route = {
  preload: () => [serverFnTodos({ cursor: null }), getData()],
} satisfies RouteDefinition;

export default function TodoPage() {
  const { t } = useLanguage();
  const { todoSeed } = TodoHook();
  const data = createAsync(() => getData());

  return (
    <>
      <MetaHead
        title={t("TODO.META.TITLE")!}
        description={t("TODO.META.DESCRIPTION")!}
        keywords={t("TODO.META.KEYWORDS")}
      />
      <Layout container class="mt-5 h-[calc(100vh-3rem)]">
        <Card class="flex h-full flex-col bg-card/80 px-10 py-5">
          <Header name="TODO.TITLE">
            <Button variant="outline" onClick={() => todoSeed.mutateAsync()}>
              <FaSolidSeedling class="mr-1" />
              {t("TODO.SEED")}
            </Button>
          </Header>
          <DataTableDemo />
          {/* <Todo /> */}
        </Card>
      </Layout>
    </>
  );
}
