import { Session } from "@/lib/auth-client";
import { ReactNode } from "react";
import { LanguageProvider } from "./language-provider";
import { QueryProvider } from "./query-provider";
import { SessionProvider } from "./session-provider";
import { ThemeProvider } from "./theme-provider";

export async function Providers(props: {
  session: Session | null;
  children: ReactNode;
}) {
  return (
    <SessionProvider session={props.session}>
      <LanguageProvider>
        <QueryProvider>
          <ThemeProvider>{props.children}</ThemeProvider>
        </QueryProvider>
      </LanguageProvider>
    </SessionProvider>
  );
}
