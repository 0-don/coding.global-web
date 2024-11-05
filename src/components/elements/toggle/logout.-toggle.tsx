import { useAuth } from "@solid-mediakit/auth/client";
import { FiLogOut } from "solid-icons/fi";
import { Show } from "solid-js";
import { toast } from "solid-sonner";
import { useLanguage } from "~/components/provider/language-provider";
import { Button } from "~/components/ui/button";

export function LogoutToggle() {
  const { t } = useLanguage();
  const auth = useAuth();

  return (
    <Show when={auth.session()?.user}>
      <Button
        title={t("MAIN.TOOLTIP.LOGOUT")}
        size="icon"
        onClick={() =>
          auth.signOut().then(() => toast.success(t("MAIN.SUCCESS.LOGGED_OUT")))
        }
        variant="ghost"
      >
        <FiLogOut />
      </Button>
    </Show>
  );
}
