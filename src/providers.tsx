import {
  COLOR_MODE_STORAGE_KEY,
  ColorModeProvider,
  ColorModeScript,
  cookieStorageManagerSSR,
} from "@kobalte/core";
import { SessionProvider } from "@solid-mediakit/auth/client";
import {
  QueryClient,
  QueryClientProvider,
  isServer,
} from "@tanstack/solid-query";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";
import { Component, JSX, Suspense } from "solid-js";
import { getCookie } from "vinxi/http";
import LanguageProvider from "./components/provider/language-provider";

interface ProvidersProps {
  children: JSX.Element;
}

function getServerCookies() {
  "use server";
  const colorMode = getCookie(COLOR_MODE_STORAGE_KEY);
  return colorMode ? `${COLOR_MODE_STORAGE_KEY}=${colorMode}` : "";
}

// const LanguageProvider = clientOnly(
//   () => import("./components/provider/language-provider"),
// );

export const Providers: Component<ProvidersProps> = (props) => {
  const storageManager = cookieStorageManagerSSR(
    isServer ? getServerCookies() : document.cookie,
  );

  const queryClient = new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false } },
  });

  return (
    <Suspense>
      <ColorModeScript storageType={storageManager.type} />
      <QueryClientProvider client={queryClient}>
        <SolidQueryDevtools initialIsOpen={false} />
        <ColorModeProvider storageManager={storageManager}>
          <LanguageProvider>
            <SessionProvider>{props.children}</SessionProvider>
          </LanguageProvider>
        </ColorModeProvider>
      </QueryClientProvider>
    </Suspense>
  );
};
