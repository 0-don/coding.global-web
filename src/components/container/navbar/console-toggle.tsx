import { query } from "@solidjs/router";
import { SiGooglesearchconsole } from "solid-icons/si";
import { toast } from "solid-sonner";
import { Button } from "~/components/ui/button";

const clearConsole = query(() => {
  "use server";
  console.clear();
}, "console");

export function ConsoleToggle() {
  return (
    <Button
      title="Clear console"
      size="icon"
      onClick={() => {
        clearConsole();
        console.clear();
        toast.success("Console cleared");
      }}
      variant="ghost"
    >
      <SiGooglesearchconsole />
    </Button>
  );
}
