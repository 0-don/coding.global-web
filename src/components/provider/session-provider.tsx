import { auth } from "@/lib/auth";
import getQueryClient from "@/lib/react-query/client";
import { queryKeys } from "@/lib/react-query/keys";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { ReactNode } from "react";

export async function SessionProvider(props: { children: ReactNode }) {
  const queryClient = getQueryClient();

  const header = await headers();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.session(),
    queryFn: async () => auth.api.getSession({ headers: header }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}
