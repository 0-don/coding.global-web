"use client";

import { Button } from "@/components/ui/button";
import { useSessionHook } from "@/hook/session-hook";
import { authClient } from "@/lib/auth-client";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";
import { toast } from "sonner";

export function LogoutToggle() {
  const t = useTranslations();
  const router = useRouter();
  const { data: session } = useSessionHook();

  if (!session) return null;

  async function handleLogout() {
    try {
      await authClient.signOut();
      toast.success(t("MAIN.SUCCESS.LOGGED_OUT"));
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleLogout}
      className="size-9 border border-red-500 bg-black/70 text-white hover:bg-red-500 hover:text-black"
      title={t("MAIN.TOOLTIP.LOGOUT")}
    >
      <FiLogOut className="size-5" />
    </Button>
  );
}
