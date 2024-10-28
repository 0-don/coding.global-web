// @refresh reload
import { edenTreaty } from "@elysiajs/eden";
import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import { Toaster } from "./components/ui/toast";
import { Providers } from "./providers";
import type { App } from "./routes/api";
import { clientEnv } from "./utils/env/client";

export const rpc = edenTreaty<App>(clientEnv.HOST_URL);

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>coding.global</Title>
          <Toaster />
          <Suspense>
            <Providers>{props.children}</Providers>
          </Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
