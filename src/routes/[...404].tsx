import { A } from "@solidjs/router";
import { TbProgressAlert } from "solid-icons/tb";
import { Layout } from "../components/container/layout";

export default function NotFound() {
  return (
    <Layout>
      <div class="layout flex min-h-screen flex-col items-center justify-center text-center">
        <TbProgressAlert
          size={60}
          class="drop-shadow-glow animate-flicker text-red-500"
        />
        <h1 class="mt-8 text-4xl md:text-6xl">Page Not Found</h1>
        <A class="mt-4 md:text-lg" href="/">
          Back to Home
        </A>
      </div>
    </Layout>
  );
}
