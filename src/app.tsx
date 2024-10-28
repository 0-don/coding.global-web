// @refresh reload
import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import { Providers } from "./providers";

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>coding.global</Title>
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
