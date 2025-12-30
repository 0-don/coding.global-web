import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarHeader } from "@/components/layout/sidebar/sidebar-header";
import { TOCProvider } from "@/components/layout/toc/toc-context";
import { TOCPanel } from "@/components/layout/toc/toc-panel";
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
          <SidebarHeader />
          <div className="flex flex-1">
            <main className="@container/main flex flex-1 flex-col gap-2">
              {props.children}
            </main>
            <TOCPanel className="mt-4 mr-4" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TOCProvider>
  );
}
