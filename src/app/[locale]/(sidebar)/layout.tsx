import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import { SidebarHeader } from "@/components/layout/sidebar/sidebar-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default function SidebarLayout(props: SidebarLayoutProps) {
  return (
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
  );
}
