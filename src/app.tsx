import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";

// const CounterContext = createContext();
export default function App() {
  // const event = useContext(ServerContext)

  // const storageManager = cookieStorageManagerSSR(
  //   isServer ? event?.request.headers.get("cookie") ?? "" : document.cookie,
  // );
  return (
    <Router
      root={(props) => (
        <>
          <Suspense fallback={<div class="news-list-nav">Loading...</div>}>
            {props.children}
          </Suspense>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
