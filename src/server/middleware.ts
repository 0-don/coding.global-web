import { authMiddleware } from "@solid-mediakit/auth";
import { createMiddleware } from "@solidjs/start/middleware";
import { authOptions } from "./auth/auth-options";

export default createMiddleware({
  onRequest: [authMiddleware(true, authOptions)],
});
