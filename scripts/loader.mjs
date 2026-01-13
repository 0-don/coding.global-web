// Mocks next/image, next/link, and CSS for SSR outside Next.js
import { register } from "node:module";

register(
  "data:text/javascript," +
    encodeURIComponent(`
const m = { "next/image": 1, "next/link": 1 };
export const resolve = (s, c, n) => m[s] ? { shortCircuit: true, url: "data:text/javascript,export default ()=>null" } : n(s, c);
export const load = (u, c, n) => u.endsWith(".css") ? { shortCircuit: true, format: "module", source: "export default {}" } : n(u, c);
`),
  import.meta.url,
);
