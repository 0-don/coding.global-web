import { Component, JSX, Suspense } from "solid-js";
import LanguageProvider from "./components/provider/language-provider";
import { ThemeProvider } from "./components/provider/theme-provider";
import { Toaster } from "./components/ui/sonner";
import { SessionProvider } from "@solid-mediakit/auth/client";

interface ProvidersProps {
  children: JSX.Element;
}

export const Providers: Component<ProvidersProps> = (props) => {
  return (
    <Suspense>
      <ThemeProvider>
        <LanguageProvider>
          <SessionProvider deferStream refetchAfterServer={false}>
            {props.children}
          </SessionProvider>
        </LanguageProvider>
        <Toaster />
      </ThemeProvider>
    </Suspense>
  );
};
