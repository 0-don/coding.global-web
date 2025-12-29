import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarAnchorProvider } from "@/components/layout/sidebar/sidebar-anchor-context";
import { SiteHeader } from "@/components/layout/sidebar/sidebar-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default function SidebarLayout(props: SidebarLayoutProps) {
  return (
    <SidebarAnchorProvider>
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
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              {props.children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </SidebarAnchorProvider>
  );
}
