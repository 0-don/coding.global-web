import { ReactNode } from "react";
import { LanguageProvider } from "./language-provider";
import { QueryProvider } from "./query-provider";

export async function Providers(props: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <QueryProvider>{props.children}</QueryProvider>
    </LanguageProvider>
  );
}
