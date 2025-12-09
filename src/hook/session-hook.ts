import { authClient } from "@/lib/auth-client";
import { queryKeys } from "@/lib/react-query/keys";
import { useQuery } from "@tanstack/react-query";

export function useSessionHook() {
  return useQuery({
    queryKey: queryKeys.session(),
    queryFn: async () => (await authClient.getSession()).data,
  });
}
