import { SolidAuth } from "@solid-mediakit/auth";
import { authOpts } from "~/utils/env/server";

export const { GET, POST } = SolidAuth(authOpts);
