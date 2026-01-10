import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { handleElysia } from "@/lib/utils/base";
import type {
  GetApiByGuildIdTopParams,
  GetApiByGuildIdUserSearchParams,
} from "@/openapi";
import { useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Fetch guild member stats on demand with caching.
 * Provides reactive states (data, isLoading, error) and a cached fetch function.
 *
 * @example
 * const { data, isLoading, error, fetch } = useTerminalMembersQuery();
 * await fetch(); // fetches with cache, updates reactive state
 */
export function useTerminalMembersQuery() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.terminalMembers(),
    queryFn: async () => handleElysia(await rpc.api.terminal.members.get()),
    enabled: false,
  });

  const fetch = () =>
    queryClient.fetchQuery({
      queryKey: queryKeys.terminalMembers(),
      queryFn: async () => handleElysia(await rpc.api.terminal.members.get()),
    });

  return { ...query, fetch };
}

/**
 * Fetch top contributors on demand with caching.
 * Provides reactive states (data, isLoading, error) and a cached fetch function.
 *
 * @example
 * const { data, isLoading, error, fetch } = useTerminalTopQuery();
 * await fetch({ limit: 5 });
 */
export function useTerminalTopQuery() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.terminalTop(),
    queryFn: async () => handleElysia(await rpc.api.terminal.top.get({})),
    enabled: false,
  });

  const fetch = (params?: GetApiByGuildIdTopParams) =>
    queryClient.fetchQuery({
      queryKey: queryKeys.terminalTop(params),
      queryFn: async () =>
        handleElysia(await rpc.api.terminal.top.get({ query: params })),
    });

  return { ...query, fetch };
}

/**
 * Search users on demand with caching.
 * Provides reactive states (data, isLoading, error) and a cached fetch function.
 *
 * @example
 * const { data, isLoading, error, fetch } = useTerminalUserSearchQuery();
 * await fetch({ q: "john", limit: 10 });
 */
export function useTerminalUserSearchQuery() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.terminalUserSearch(),
    queryFn: async () =>
      handleElysia(await rpc.api.terminal.user.search.get({})),
    enabled: false,
  });

  const fetch = (params: GetApiByGuildIdUserSearchParams) =>
    queryClient.fetchQuery({
      queryKey: queryKeys.terminalUserSearch(params),
      queryFn: async () =>
        handleElysia(await rpc.api.terminal.user.search.get({ query: params })),
    });

  return { ...query, fetch };
}

/**
 * Fetch a specific user on demand with caching.
 * Provides reactive states (data, isLoading, error) and a cached fetch function.
 *
 * @example
 * const { data, isLoading, error, fetch } = useTerminalUserQuery();
 * await fetch("123456789");
 */
export function useTerminalUserQuery() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.terminalUser(""),
    queryFn: async () => handleElysia(await rpc.api.terminal.user({ userId: "" }).get()),
    enabled: false,
  });

  const fetch = (userId: string) =>
    queryClient.fetchQuery({
      queryKey: queryKeys.terminalUser(userId),
      queryFn: async () =>
        handleElysia(await rpc.api.terminal.user({ userId }).get()),
    });

  return { ...query, fetch };
}
