import { getSession } from "@solid-mediakit/auth";
import { Context, InvalidCookieSignature } from "elysia";
import { msg } from "~/lib/i18n";
import { authOptions } from "./auth-options";

export const authUserGuard = async ({ request }: Context<any, any>) => {
  const session = await getSession(request, authOptions);

  if (!session) {
    throw new InvalidCookieSignature(msg("MAIN.ERROR.UNAUTHORIZED"));
  }
};

export const authUserResolve = async ({ request }: Context<any>) => {
  const session = await getSession(request, authOptions);

  if (!session) {
    throw new InvalidCookieSignature(msg("MAIN.ERROR.UNAUTHORIZED"));
  }

  return {
    user: session.user,
  };
};
