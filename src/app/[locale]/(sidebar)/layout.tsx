import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import { SidebarHeader } from "@/components/layout/sidebar/sidebar-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import getQueryClient from "@/lib/react-query/client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default async function SidebarLayout(props: SidebarLayoutProps) {
  const queryClient = getQueryClient();

  // await queryClient.prefetchQuery({
  //   queryKey: queryKeys.searchIndex(),
  //   queryFn: async () => {
  //     const data = handleElysia(await rpc.api.search.get());
  //     return restore("json", JSON.stringify(data));
  //   },
  // });

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
