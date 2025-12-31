import { getCookieValue } from "@/lib/utils/server";
import {
  NAVIGATION_STORE_KEY,
  NavigationState,
} from "@/store/navigation-store";
import { ReactNode, use } from "react";
import { JotaiProvider } from "./jotai-provider";
import { LanguageProvider } from "./language-provider";
import { QueryProvider } from "./query-provider";
import { SessionProvider } from "./session-provider";
import { NavigationStoreProvider } from "./store/navigation-store-provider";
import { ThemeProvider } from "./theme-provider";

export function Providers(props: { children: ReactNode }) {
  const navigationStore = use(
    getCookieValue<NavigationState>(NAVIGATION_STORE_KEY),
  );

  return (
    <JotaiProvider>
      <NavigationStoreProvider data={navigationStore}>
        <LanguageProvider>
          <QueryProvider>
            <ThemeProvider>
              <SessionProvider>{props.children}</SessionProvider>
            </ThemeProvider>
          </QueryProvider>
        </LanguageProvider>
      </NavigationStoreProvider>
    </JotaiProvider>
  );
}
