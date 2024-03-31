import { edenTreaty } from "@elysiajs/eden";
import { SessionProvider } from "@solid-mediakit/auth/client";
import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { clientOnly } from "@solidjs/start";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import { Providers } from "./providers";
import type { App } from "./routes/api";
import { clientEnv } from "./utils/env/client";

export const rpc = edenTreaty<App>(clientEnv.HOST_URL);

const Toaster = clientOnly(() => import("./components/ui/toast"));

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>coding.global</Title>
          <Toaster />
          <SessionProvider>
            <Suspense>
              <Providers>{props.children}</Providers>
            </Suspense>
          </SessionProvider>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
