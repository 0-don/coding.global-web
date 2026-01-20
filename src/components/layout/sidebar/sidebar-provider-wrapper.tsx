"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { sidebarOpenAtom } from "@/store/navigation-store";
import { useAtom } from "jotai";

interface SidebarProviderWrapperProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function SidebarProviderWrapper(props: SidebarProviderWrapperProps) {
  const [open, setOpen] = useAtom(sidebarOpenAtom);

  return (
    <SidebarProvider open={open} onOpenChange={setOpen} style={props.style}>
      {props.children}
    </SidebarProvider>
  );
}
