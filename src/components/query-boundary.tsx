import type { CreateQueryResult } from "@tanstack/solid-query";
import type { JSX } from "solid-js";
import { ErrorBoundary, Match, Suspense, Switch } from "solid-js";

export interface QueryBoundaryProps<T = unknown> {
  query: CreateQueryResult<T, Error>;
  loadingFallback?: JSX.Element;
  notFoundFallback?: JSX.Element;
  errorFallback?: (err: Error, retry: () => void) => JSX.Element;
  children: (data: Exclude<T, null | false | undefined>) => JSX.Element;
}

export function QueryBoundary<T>(props: QueryBoundaryProps<T>) {
  return (
    <Suspense fallback={props.loadingFallback}>
      <ErrorBoundary
        fallback={(err: Error, reset) =>
          props.errorFallback ? (
            props.errorFallback(err, async () => {
              await props.query.refetch();
              reset();
            })
          ) : (
            <div>
              <div class="error">{err.message}</div>
              <button
                onClick={async () => {
                  await props.query.refetch();
                  reset();
                }}
              >
                retry
              </button>
            </div>
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
              <div>
                <div class="error">{props.query.error?.message}</div>
                <button onClick={() => props.query.refetch()}>retry</button>
              </div>
            )}
          </Match>

          <Match when={!props.query.isFetching && !props.query.data}>
            {props.notFoundFallback || <div>not found</div>}
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
