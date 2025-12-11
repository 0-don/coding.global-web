import type { routing } from "@/i18n/routing";
import messages from "../../../public/i18n/en.json";

type Messages = typeof messages;

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: Messages;
  }
}
