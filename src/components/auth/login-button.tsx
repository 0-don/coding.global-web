"use client";

import { Button } from "@/components/ui/button";
import { useSessionHook } from "@/hook/session-hook";
import { authClient } from "@/lib/auth-client";
import { useTranslations } from "next-intl";
import { FaDiscord } from "react-icons/fa";

export function LoginButton() {
  const t = useTranslations();
  const { data: session } = useSessionHook();

  if (session) return null;

  async function handleLogin() {
    await authClient.signIn.social({
      provider: "discord",
      callbackURL: "/",
    });
  }

  return (
    <Button
      onClick={handleLogin}
      className="gap-2 bg-[#5865F2] text-white hover:bg-[#4752C4]"
    >
      <FaDiscord className="size-5" />
      {t("MAIN.AUTH.LOGIN_WITH_DISCORD")}
    </Button>
  );
}
