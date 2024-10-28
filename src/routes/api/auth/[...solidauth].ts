import { SolidAuth } from "@solid-mediakit/auth";
import { authOpts } from "./auth-config";

export const { GET, POST } = SolidAuth(authOpts);
