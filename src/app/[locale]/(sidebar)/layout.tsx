import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/sidebar/sidebar-header";
import { TOCPanel } from "@/components/layout/toc/toc-panel";
import { TOCProvider } from "@/components/layout/toc/toc-context";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default function SidebarLayout(props: SidebarLayoutProps) {
  return (
    <TOCProvider>
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
          <SiteHeader />
          <div className="flex flex-1">
            <main className="@container/main flex flex-1 flex-col gap-2">
              {props.children}
            </main>
            <TOCPanel className="mr-4 mt-4" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TOCProvider>
  );
}
