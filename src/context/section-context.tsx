"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type Section = "home" | "news" | "rules" | "team";

type SectionContextType = {
  section: Section;
  setSection: (section: Section) => void;
};

const SectionContext = createContext<SectionContextType | undefined>(undefined);

export function SectionProvider({ children }: { children: ReactNode }) {
  const [section, setSection] = useState<Section>("home");

  return (
    <SectionContext.Provider value={{ section, setSection }}>
      {children}
    </SectionContext.Provider>
  );
}

export function useSection() {
  const context = useContext(SectionContext);
  if (!context)
    throw new Error("useSection must be used within SectionProvider");
  return context;
}
