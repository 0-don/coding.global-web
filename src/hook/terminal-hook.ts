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
  const queryKey = queryKeys.terminalMembers();

  const query = useQuery({
    queryKey,
    queryFn: async () => handleElysia(await rpc.api.terminal.members.get()),
    enabled: false,
  });

  const fetch = async () => {
    const data = await queryClient.fetchQuery({
      queryKey,
      queryFn: async () => handleElysia(await rpc.api.terminal.members.get()),
    });
    return data;
  };

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
export function useTerminalTopQuery(params?: GetApiByGuildIdTopParams) {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.terminalTop(params);

  const query = useQuery({
    queryKey,
    queryFn: async () =>
      handleElysia(await rpc.api.terminal.top.get({ query: params })),
    enabled: false,
  });

  const fetch = async () => {
    const data = await queryClient.fetchQuery({
      queryKey,
      queryFn: async () =>
        handleElysia(await rpc.api.terminal.top.get({ query: params })),
    });
    return data;
  };

  return { ...query, fetch };
}

/**
 * Search users on demand with caching.
 * Provides reactive states (data, isLoading, error) and a cached fetch function.
 *
 * @example
 * const { data, isLoading, error, fetch } = useTerminalUserSearchQuery({ q: "john" });
 * await fetch();
 */
export function useTerminalUserSearchQuery(
  params?: GetApiByGuildIdUserSearchParams,
) {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.terminalUserSearch(params);

  const query = useQuery({
    queryKey,
    queryFn: async () =>
      handleElysia(await rpc.api.terminal.user.search.get({ query: params })),
    enabled: false,
  });

  const fetch = async () => {
    const data = await queryClient.fetchQuery({
      queryKey,
      queryFn: async () =>
        handleElysia(await rpc.api.terminal.user.search.get({ query: params })),
    });
    return data;
  };

  return { ...query, fetch };
}

/**
 * Fetch users on demand with caching.
 * Provides reactive states (data, isLoading, error) and a cached fetch function.
 *
 * @example
 * const { data, isLoading, error, fetch } = useTerminalUsersQuery(["123456789", "987654321"]);
 * await fetch();
 */
export function useTerminalUsersQuery(userIds: string[]) {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.terminalUsers(userIds);

  const query = useQuery({
    queryKey,
    queryFn: async () =>
      handleElysia(await rpc.api.terminal.users.post({ userIds })),
    enabled: false,
  });

  const fetch = async () => {
    const data = await queryClient.fetchQuery({
      queryKey,
      queryFn: async () =>
        handleElysia(await rpc.api.terminal.users.post({ userIds })),
    });
    return data;
  };

  return { ...query, fetch };
}
