import { RouteDefinition } from "@solidjs/router";
import { createVirtualizer } from "@tanstack/solid-virtual";
import { RiBusinessCalendarTodoFill } from "solid-icons/ri";
import { TbTrashX } from "solid-icons/tb";
import { createEffect, For, Show } from "solid-js";
import { Header } from "~/components/container/header";
import { Layout } from "~/components/container/layout";
import { serverFnTodos, TodoHook } from "~/components/hook/todo-hook";
import { useLanguage } from "~/components/provider/language-provider";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { TextField, TextFieldRoot } from "~/components/ui/textfield";
import { todoSchemas } from "~/lib/schema/todo";

export const route = {
  preload: () => serverFnTodos({ cursor: null }),
} satisfies RouteDefinition;

export default function TodoPage() {
  const { locale } = useLanguage();
  const { todo, setTodo, todoAdd, todosInfiniteQuery, todoDelete } = TodoHook();
  let parentRef: HTMLDivElement;

  const flattenedTodos = () =>
    todosInfiniteQuery.data?.pages.flatMap((page) => page) ?? [];

  const virtualizer = createVirtualizer({
    get count() {
      return flattenedTodos().length;
    },
    getScrollElement: () => parentRef,
    estimateSize: () => 64,
    overscan: 5,
  });

  const handleScroll = () => {
    if (!parentRef) return;

    const scrollHeight = parentRef.scrollHeight;
    const scrollTop = parentRef.scrollTop;
    const clientHeight = parentRef.clientHeight;

    if (
      scrollHeight - scrollTop - clientHeight < 100 &&
      !todosInfiniteQuery.isFetchingNextPage
    ) {
      todosInfiniteQuery.fetchNextPage();
    }
  };

  const onSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if (!todoAdd.isPending && todoSchemas.insert.safeParse(todo).success)
      todoAdd.mutate();
  };

  createEffect(() => {
    console.log(virtualizer.getVirtualItems(), flattenedTodos().length);
  });

  return (
    <Layout container class="mt-10 h-[calc(100vh-5rem)]">
      <Card class="flex h-full flex-col bg-secondary/85 p-10">
        <Header name="TODO.TITLE" />

        <div
          ref={parentRef!}
          class="my-5 flex-1 overflow-y-auto"
          onScroll={handleScroll}
        >
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            <Show
              when={!todosInfiniteQuery.isLoading}
              fallback={<div>Loading...</div>}
            >
              <For each={virtualizer.getVirtualItems()}>
                {(virtualRow) => {
                  const todo = flattenedTodos()[virtualRow.index];
                  return (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      <Show when={todo}>
                        <div class="flex w-full items-start justify-between gap-4 rounded-md p-2 transition-all hover:bg-foreground hover:text-secondary">
                          <div class="flex gap-4">
                            <RiBusinessCalendarTodoFill class="mt-px size-5" />
                            <div class="space-y-1">
                              <p class="break-all text-sm font-medium">
                                {todo.task}
                              </p>
                              <p class="text-sm">
                                {new Date(todo.createdAt!).toLocaleString(
                                  locale(),
                                )}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="destructive"
                            class="flex-shrink-0"
                            size="icon"
                            disabled={todoDelete.isPending}
                            onClick={() => todoDelete.mutateAsync(todo.id)}
                          >
                            <TbTrashX />
                          </Button>
                        </div>
                      </Show>
                    </div>
                  );
                }}
              </For>
            </Show>
          </div>
        </div>

        <form onSubmit={onSubmit} class={"flex justify-center gap-4"}>
          <TextFieldRoot class="w-full" validationState="invalid">
            <TextField
              class="bg-gray-200 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700"
              type={"text"}
              value={todo.task}
              onInput={(e) => setTodo({ task: e.currentTarget.value })}
            />
          </TextFieldRoot>
          <Button
            disabled={
              todoAdd.isPending || !todoSchemas.insert.safeParse(todo).success
            }
            onClick={() => todoAdd.mutate()}
          >
            Submit
          </Button>
        </form>
      </Card>
    </Layout>
  );
}
