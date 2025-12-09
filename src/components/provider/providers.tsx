import { ReactNode } from "react";
import { LanguageProvider } from "./language-provider";
import { QueryProvider } from "./query-provider";
import { SessionProvider } from "./session-provider";
import { ThemeProvider } from "./theme-provider";

export async function Providers(props: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <QueryProvider>
        <ThemeProvider>
          <SessionProvider>{props.children}</SessionProvider>
        </ThemeProvider>
      </QueryProvider>
    </LanguageProvider>
  );
}
