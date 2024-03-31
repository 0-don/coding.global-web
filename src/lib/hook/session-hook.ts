import { getSession } from "@solid-mediakit/auth";
import { createSession } from "@solid-mediakit/auth/client";
import { createResource } from "solid-js";
import { isServer } from "solid-js/web";
import { getWebRequest } from "vinxi/http";
import { authOpts } from "~/routes/api/auth/config";

async function getMySession() {
  "use server";
  return await getSession(getWebRequest(), authOpts);
}

export const SessionHook = () => {
  const [session] = createResource(async () =>
    isServer ? await getMySession() : createSession()(),
  );

  return session;
};
