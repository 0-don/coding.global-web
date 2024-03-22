import { SessionProvider } from "@solid-mediakit/auth/client";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";
import { Component, JSX, Suspense } from "solid-js";
import LanguageProvider from "./components/provider/language-provider";
import { ThemeProvider } from "./components/provider/theme-provider";

interface ProvidersProps {
  children: JSX.Element;
}

// const LanguageProvider = clientOnly(
//   () => import("./components/provider/language-provider"),
// );

export const Providers: Component<ProvidersProps> = (props) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false } },
  });

  return (
    <Suspense>
      <QueryClientProvider client={queryClient}>
        <SolidQueryDevtools initialIsOpen={false} />
        <ThemeProvider>
          <LanguageProvider>
            <SessionProvider>{props.children}</SessionProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Suspense>
  );
};
