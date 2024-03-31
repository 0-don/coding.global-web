import { SessionProvider } from "@solid-mediakit/auth/client";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";
import { Component, JSX } from "solid-js";
import LanguageProvider from "./components/provider/language-provider";
import { ThemeProvider } from "./components/provider/theme-provider";

interface ProvidersProps {
  children: JSX.Element;
}

export const Providers: Component<ProvidersProps> = (props) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false } },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <SolidQueryDevtools initialIsOpen={false} />
      <ThemeProvider>
        <LanguageProvider>
          <SessionProvider refetchOnWindowFocus>{props.children}</SessionProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
