import { SessionProvider } from "@solid-mediakit/auth/client";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";
import { Component, JSX, Suspense } from "solid-js";
import LanguageProvider from "./components/provider/language-provider";
import { ThemeProvider } from "./components/provider/theme-provider";
import { Toaster } from "./components/ui/sonner";
import { MetaProvider } from "@solidjs/meta";

interface ProvidersProps {
  children: JSX.Element;
}

export const Providers: Component<ProvidersProps> = (props) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <SolidQueryDevtools initialIsOpen={false} />
      <Suspense>
        <MetaProvider>
          <ThemeProvider>
            <LanguageProvider>
              <SessionProvider>{props.children}</SessionProvider>
            </LanguageProvider>
            <Toaster richColors />
          </ThemeProvider>
        </MetaProvider>
      </Suspense>
    </QueryClientProvider>
  );
};
