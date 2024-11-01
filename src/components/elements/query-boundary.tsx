import type { CreateQueryResult } from "@tanstack/solid-query";
import type { JSX } from "solid-js";
import { ErrorBoundary, Match, Suspense, Switch } from "solid-js";
import { useLanguage } from "../provider/language-provider";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Loading } from "./loading";

export interface QueryBoundaryProps<T = unknown> {
  query: CreateQueryResult<T, Error>;
  loadingFallback?: JSX.Element;
  notFoundFallback?: JSX.Element;
  errorFallback?: (err: Error, retry: () => void) => JSX.Element;
  children: (data: Exclude<T, null | false | undefined>) => JSX.Element;
}

export function QueryBoundary<T>(props: QueryBoundaryProps<T>) {
  const { t } = useLanguage();

  return (
    <Suspense fallback={props.loadingFallback ?? <Loading />}>
      <ErrorBoundary
        fallback={(err: Error, reset) =>
          props.errorFallback ? (
            props.errorFallback(err, async () => {
              await props.query.refetch();
              reset();
            })
          ) : (
            <>
              <Badge variant="destructive">{err.message}</Badge>
              <Button
                onClick={async () => {
                  await props.query.refetch();
                  reset();
                }}
              >
                {t("MAIN.BUTTON.RETRY")}
              </Button>
            </>
          )
        }
      >
        <Switch>
          <Match when={props.query.isError}>
            {props.errorFallback ? (
              props.errorFallback(props.query.error as Error, () => {
                props.query.refetch();
              })
            ) : (
              <>
                <Badge variant="destructive">
                  {props.query.error?.message}
                </Badge>
                <Button onClick={() => props.query.refetch()}>
                  {t("MAIN.BUTTON.RETRY")}
                </Button>
              </>
            )}
          </Match>

          <Match when={!props.query.isFetching && !props.query.data}>
            {props.notFoundFallback || (
              <Badge>{t("MAIN.BUTTON.NOT_FOUND")}</Badge>
            )}
          </Match>

          <Match when={props.query.data}>
            {props.children(
              props.query.data as Exclude<T, null | false | undefined>,
            )}
          </Match>
        </Switch>
      </ErrorBoundary>
    </Suspense>
  );
}
