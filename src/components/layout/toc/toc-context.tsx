"use client";

import * as React from "react";
import type { TOCItemType } from "fumadocs-core/toc";

type TOCContextType = {
  items: TOCItemType[];
  setItems: (items: TOCItemType[]) => void;
  title: string;
  setTitle: (title: string) => void;
};

const TOCContext = React.createContext<TOCContextType | null>(null);

export function TOCProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<TOCItemType[]>([]);
  const [title, setTitle] = React.useState<string>("On This Page");

  return (
    <TOCContext.Provider
      value={{
        items,
        setItems,
        title,
        setTitle,
      }}
    >
      {children}
    </TOCContext.Provider>
  );
}

export function useTOC() {
  const context = React.useContext(TOCContext);
  if (!context) {
    throw new Error("useTOC must be used within a TOCProvider");
  }
  return context;
}

export function useSetTOC(items: TOCItemType[], title?: string) {
  const { setItems, setTitle } = useTOC();

  React.useEffect(() => {
    setItems(items);
    if (title) {
      setTitle(title);
    }

    return () => {
      setItems([]);
    };
  }, [items, title, setItems, setTitle]);
}
