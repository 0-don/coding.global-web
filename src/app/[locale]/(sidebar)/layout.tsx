import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import { SidebarHeader } from "@/components/layout/sidebar/sidebar-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import getQueryClient from "@/lib/react-query/client";
import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { handleElysia } from "@/lib/utils/base";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default async function SidebarLayout(props: SidebarLayoutProps) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.searchIndex(),
    queryFn: async () => handleElysia(await rpc.api.search.index.get()),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SidebarHeader />
          <div className="flex flex-1">{props.children}</div>
        </SidebarInset>
      </SidebarProvider>
    </HydrationBoundary>
  );
}
