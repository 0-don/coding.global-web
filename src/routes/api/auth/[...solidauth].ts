import { SolidAuth } from "@solid-mediakit/auth";
import { authOptions } from "~/server/auth/auth-options";

export const { GET, POST } = SolidAuth(authOptions);
