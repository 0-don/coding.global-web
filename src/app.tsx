import { edenTreaty } from "@elysiajs/eden";
import {
  ColorModeProvider,
  ColorModeScript,
  cookieStorageManagerSSR,
} from "@kobalte/core";
import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/solid-query";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";
import { Suspense } from "solid-js";
import { isServer } from "solid-js/web";
import { getCookie } from "vinxi/server";
import "./app.css";
import { LanguageToggle } from "./components/navbar/language-toggle";
import { ModeToggle } from "./components/navbar/mode-toggle";
import TypesafeI18n from "./i18n/i18n-solid";
import type { App } from "./routes/api";
import { clientEnv } from "./utils/env/client";

function getServerCookies() {
  "use server";
  const colorMode = getCookie("kb-color-mode");
  return colorMode ? `kb-color-mode=${colorMode}` : "";
}

export const rpc = edenTreaty<App>(clientEnv.HOST_URL);

export default function App() {
  const storageManager = cookieStorageManagerSSR(
    isServer ? getServerCookies() : document.cookie,
  );

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        placeholderData: (previousData: unknown) => previousData,
      },
    },
    mutationCache: new MutationCache({
      // onSuccess: async () => void (await queryClient.invalidateQueries()),
    }),
  });

  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <QueryClientProvider client={queryClient}>
            <SolidQueryDevtools initialIsOpen={false} />
            <Title>coding.global</Title>
            <ColorModeScript storageType={storageManager.type} />
            <TypesafeI18n locale="en">
              <ColorModeProvider storageManager={storageManager}>
                <div class="absolute right-0 top-0 z-[9999]">
                  <ModeToggle />
                </div>
                <div class="absolute left-0 top-0 z-[9999]">
                  <LanguageToggle />
                </div>
                <Suspense>{props.children}</Suspense>
              </ColorModeProvider>
            </TypesafeI18n>
          </QueryClientProvider>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
