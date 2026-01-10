import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { handleElysia } from "@/lib/utils/base";
import type {
  GetApiByGuildIdTopParams,
  GetApiByGuildIdUserSearchParams,
} from "@/openapi";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Fetch guild member stats on demand with caching.
 *
 * @example
 * const fetchMembers = useFetchTerminalMembers();
 * const data = await fetchMembers();
 */
export function useFetchTerminalMembers() {
  const queryClient = useQueryClient();

  return () =>
    queryClient.fetchQuery({
      queryKey: queryKeys.terminalMembers(),
      queryFn: async () => handleElysia(await rpc.api.terminal.members.get()),
    });
}

/**
 * Fetch top contributors on demand with caching.
 *
 * @example
 * const fetchTop = useFetchTerminalTop();
 * const data = await fetchTop({ limit: 5 });
 */
export function useFetchTerminalTop() {
  const queryClient = useQueryClient();

  return (query?: GetApiByGuildIdTopParams) =>
    queryClient.fetchQuery({
      queryKey: queryKeys.terminalTop(query),
      queryFn: async () =>
        handleElysia(await rpc.api.terminal.top.get({ query })),
    });
}

/**
 * Search users on demand with caching.
 *
 * @example
 * const searchUsers = useFetchTerminalUserSearch();
 * const data = await searchUsers({ q: "john", limit: 10 });
 */
export function useFetchTerminalUserSearch() {
  const queryClient = useQueryClient();

  return (query: GetApiByGuildIdUserSearchParams) =>
    queryClient.fetchQuery({
      queryKey: queryKeys.terminalUserSearch(query),
      queryFn: async () =>
        handleElysia(await rpc.api.terminal.user.search.get({ query })),
    });
}

/**
 * Fetch a specific user on demand with caching.
 *
 * @example
 * const fetchUser = useFetchTerminalUser();
 * const data = await fetchUser("123456789");
 */
export function useFetchTerminalUser() {
  const queryClient = useQueryClient();

  return (userId: string) =>
    queryClient.fetchQuery({
      queryKey: queryKeys.terminalUser(userId),
      queryFn: async () =>
        handleElysia(await rpc.api.terminal.user({ userId }).get()),
    });
}
