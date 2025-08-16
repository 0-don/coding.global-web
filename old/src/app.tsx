// @refresh reload
import "@fontsource-variable/exo-2";
import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import "./app.css";
import { Providers } from "./providers";

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Providers>{props.children}</Providers>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
