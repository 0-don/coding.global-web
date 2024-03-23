import { SolidAuth } from "@solid-mediakit/auth";
import { authOpts } from "./config";

export const { GET, POST } = SolidAuth(authOpts);
