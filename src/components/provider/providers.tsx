import { ReactNode } from "react";
import { LanguageProvider } from "./language-provider";
import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";

export async function Providers(props: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <QueryProvider>
        <ThemeProvider>{props.children}</ThemeProvider>
      </QueryProvider>
    </LanguageProvider>
  );
}
