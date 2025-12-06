import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { SERVER_URL_KEY } from "./lib/config/constants";

export default async function proxy(request: NextRequest) {
  const response = createMiddleware(routing)(request);

  response.headers.set(SERVER_URL_KEY, request.url);

  return response;
}

export const config = {
  // Match all pathnames except forja
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
