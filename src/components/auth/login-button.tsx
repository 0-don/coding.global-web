"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useTranslations } from "next-intl";
import { FaDiscord } from "react-icons/fa";

export function LoginButton() {
  const t = useTranslations();
  const { data: session, isPending } = authClient.useSession();

  if (session || isPending) return null;

  async function handleLogin() {
    await authClient.signIn.social({
      provider: "discord",
      callbackURL: "/",
    });
  }

  return (
    <Button onClick={handleLogin} className="bg-[#5865F2] hover:bg-[#4752C4] text-white gap-2">
      <FaDiscord className="size-5" />
      {t("MAIN.AUTH.LOGIN_WITH_DISCORD")}
    </Button>
  );
}
