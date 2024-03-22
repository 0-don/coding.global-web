import { edenTreaty } from "@elysiajs/eden";
import {
  COLOR_MODE_STORAGE_KEY,
  ColorModeProvider,
  ColorModeScript,
  cookieStorageManagerSSR,
} from "@kobalte/core";
import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { clientOnly } from "@solidjs/start";
import { FileRoutes } from "@solidjs/start/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";
import { Suspense } from "solid-js";
import { isServer } from "solid-js/web";
import { getCookie } from "vinxi/server";
import "./app.css";
import LanguageProvider from "./components/provider/language-provider";
import type { App } from "./routes/api";
import { clientEnv } from "./utils/env/client";

function getServerCookies() {
  "use server";
  const colorMode = getCookie(COLOR_MODE_STORAGE_KEY);
  return colorMode ? `${COLOR_MODE_STORAGE_KEY}=${colorMode}` : "";
}

export const rpc = edenTreaty<App>(clientEnv.HOST_URL);

// const LanguageProvider = clientOnly(
//   () => import("./components/provider/language-provider"),
// );

const Toaster = clientOnly(() => import("./components/ui/toast"));

export default function App() {
  const storageManager = cookieStorageManagerSSR(
    isServer ? getServerCookies() : document.cookie,
  );

  const queryClient = new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false } },
  });

  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <QueryClientProvider client={queryClient}>
            <SolidQueryDevtools initialIsOpen={false} />
            <Title>coding.global</Title>
            <Toaster />
            <ColorModeScript storageType={storageManager.type} />
            <ColorModeProvider storageManager={storageManager}>
              <LanguageProvider>
                <Suspense>{props.children}</Suspense>
              </LanguageProvider>
            </ColorModeProvider>
          </QueryClientProvider>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
