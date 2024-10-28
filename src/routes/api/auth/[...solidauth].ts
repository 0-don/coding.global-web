import { SolidAuth } from "@solid-mediakit/auth";
import { authOpts } from "~/server/auth/auth-config";

export const { GET, POST } = SolidAuth(authOpts);
