import { getSession } from "@solid-mediakit/auth";
import { cache, redirect } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { setContext } from "vinxi/http";
import { authOptions } from "./auth-options";

export const getMe = cache(async () => {
  "use server";
  console.error("getMe");
  const event = getRequestEvent()!;
  const session = await getSession(event, authOptions);
  setContext("session", session);
  if (!session) {
    throw redirect("/");
  }
  return session;
}, "me");
