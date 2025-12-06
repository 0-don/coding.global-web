import { auth } from "@/lib/auth";
import { msg } from "@/lib/config/constants";
import { Context, InvalidCookieSignature } from "elysia";
import { headers } from "next/headers";

export const authUserGuard = async (context: Context) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user)
    throw new InvalidCookieSignature(msg("MAIN.ERROR.UNAUTHORIZED"));
};

export const authUserResolve = async (context: Context) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user)
    throw new InvalidCookieSignature(msg("MAIN.ERROR.UNAUTHORIZED"));

  return { user: session.user };
};
