import { RouteDefinition } from "@solidjs/router";
import { clientOnly } from "@solidjs/start";
import { FaSolidSeedling } from "solid-icons/fa";
import { Suspense } from "solid-js";
import { Header } from "~/components/container/header";
import { Layout } from "~/components/container/layout";
import { serverFnTodos, TodoHook } from "~/components/hook/todo-hook";
import { useLanguage } from "~/components/provider/language-provider";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import Todo from "../../components/pages/todo/todo";

export const route = {
  preload: () => serverFnTodos({ cursor: null }),
} satisfies RouteDefinition;

const ClientOnlyTodo = clientOnly(
  () => import("../../components/pages/todo/todo"),
);

export default function TodoPage() {
  const { t } = useLanguage();
  const { todoSeed } = TodoHook();

  return (
    <Layout container class="mt-10 h-[calc(100vh-5rem)]">
      <Card class="flex h-full flex-col bg-secondary/85 p-10">
        <Suspense fallback={<div>{t("MAIN.BUTTON.LOADING")}...</div>}>
          <Header name="TODO.TITLE">
            <Button variant="outline" onClick={() => todoSeed.mutateAsync()}>
              <FaSolidSeedling class="mr-1" />
              {t("TODO.SEED")}
            </Button>
          </Header>
          <Todo />
          {/* <ClientOnlyTodo /> */}
        </Suspense>
      </Card>
    </Layout>
  );
}
