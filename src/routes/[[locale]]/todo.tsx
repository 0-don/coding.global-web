import { RouteDefinition } from "@solidjs/router";
import { FaSolidSeedling } from "solid-icons/fa";
import { Header } from "~/components/container/header";
import { Layout } from "~/components/container/layout";
import { MetaHead } from "~/components/elements/meta-head";
import { serverFnTodos, TodoHook } from "~/components/hook/todo-hook";
import { useLanguage } from "~/components/provider/language-provider";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import Todo from "../../components/pages/todo/todo";

export const route = {
  preload: () => serverFnTodos({ cursor: null }),
} satisfies RouteDefinition;

export default function TodoPage() {
  const { t } = useLanguage();
  const { todoSeed } = TodoHook();

  return (
    <>
      <MetaHead
        title={t("TODO.META.TITLE")!}
        description={t("TODO.META.DESCRIPTION")!}
        keywords={t("TODO.META.KEYWORDS")}
      />
      <Layout container class="mt-10 h-[calc(100vh-5rem)]">
        <Card class="flex h-full flex-col bg-secondary/85 p-10">
          <Header name="TODO.TITLE">
            <Button variant="outline" onClick={() => todoSeed.mutateAsync()}>
              <FaSolidSeedling class="mr-1" />
              {t("TODO.SEED")}
            </Button>
          </Header>
          <Todo />
        </Card>
      </Layout>
    </>
  );
}
