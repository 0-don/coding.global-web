import { query } from "@solidjs/router";
import { SiGooglesearchconsole } from "solid-icons/si";
import { toast } from "solid-sonner";
import { useLanguage } from "~/components/provider/language-provider";
import { Button } from "~/components/ui/button";
import { CONSOLE_KEY } from "~/utils/cache/keys";

const clearConsole = query(() => {
  "use server";
  console.clear();
}, CONSOLE_KEY);

export function ConsoleToggle() {
  const { t } = useLanguage();

  return (
    <Button
      title={t("MAIN.TOOLTIP.CLEAR_CONSOLE")}
      size="icon"
      onClick={() => {
        clearConsole();
        console.clear();
        toast.success(t("MAIN.SUCCESS.CONSOLE_CLEARED"));
      }}
      variant="ghost"
    >
      <SiGooglesearchconsole />
    </Button>
  );
}
