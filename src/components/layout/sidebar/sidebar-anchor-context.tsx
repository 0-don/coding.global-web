"use client";

import * as React from "react";
import type { AnchorItem } from "./sidebar-anchor-navigation";

type SidebarAnchorContextType = {
  anchorItems: AnchorItem[];
  setAnchorItems: (items: AnchorItem[]) => void;
  anchorTitle: string;
  setAnchorTitle: (title: string) => void;
  activeAnchorId: string | undefined;
  setActiveAnchorId: (id: string | undefined) => void;
};

const SidebarAnchorContext = React.createContext<SidebarAnchorContextType | null>(null);

export function SidebarAnchorProvider({ children }: { children: React.ReactNode }) {
  const [anchorItems, setAnchorItems] = React.useState<AnchorItem[]>([]);
  const [anchorTitle, setAnchorTitle] = React.useState<string>("On This Page");
  const [activeAnchorId, setActiveAnchorId] = React.useState<string | undefined>(undefined);

  return (
    <SidebarAnchorContext.Provider
      value={{
        anchorItems,
        setAnchorItems,
        anchorTitle,
        setAnchorTitle,
        activeAnchorId,
        setActiveAnchorId,
      }}
    >
      {children}
    </SidebarAnchorContext.Provider>
  );
}

export function useSidebarAnchor() {
  const context = React.useContext(SidebarAnchorContext);
  if (!context) {
    throw new Error("useSidebarAnchor must be used within a SidebarAnchorProvider");
  }
  return context;
}

export function useSetSidebarAnchors(items: AnchorItem[], title?: string) {
  const { setAnchorItems, setAnchorTitle, setActiveAnchorId } = useSidebarAnchor();

  React.useEffect(() => {
    setAnchorItems(items);
    if (title) {
      setAnchorTitle(title);
    }

    // Intersection observer to track active section
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveAnchorId(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -80% 0px" }
    );

    for (const item of items) {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    }

    return () => {
      observer.disconnect();
      setAnchorItems([]);
    };
  }, [items, title, setAnchorItems, setAnchorTitle, setActiveAnchorId]);
}
