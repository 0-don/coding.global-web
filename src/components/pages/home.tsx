import { DiscordWidget } from "@/components/elements/discord-widget";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDiscordInviteLink } from "@/lib/utils/base";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function Home() {
  const t = useTranslations();

  return (
    <div className="container mx-auto mt-10 flex h-full items-center gap-10 px-4 md:px-6">
      <div className="flex-1">
        <Card className="border-primary text-primary mb-6 bg-black/70 font-mono text-sm">
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="bg-primary h-3 w-3 rounded-full"></span>
              <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
              <span className="h-3 w-3 rounded-full bg-green-500"></span>
            </div>

            <div className="flex flex-wrap items-center justify-center space-x-1">
              <span className="text-green-400">{">"}</span>
              <span className="ml-1 text-gray-300">{t("HOME.WELCOME_TO")}</span>
              <span className="text-primary font-bold">
                {process.env.NEXT_PUBLIC_APP_NAME} {t("HOME.WEBSITE")}
              </span>
            </div>

            <div className="animate-pulse text-center text-xs text-gray-400">
              {t("HOME.WAITING_MESSAGE")}
            </div>
          </CardContent>
        </Card>

        <div className="z-10 flex items-center justify-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-primary hover:bg-primary hover:text-primary-foreground rounded-full border-2 px-8 py-3 font-bold shadow-lg transition-all duration-300 hover:scale-105"
          >
            <Link href={getDiscordInviteLink()}>
              {t("HOME.JOIN_BUTTON")}
            </Link>
          </Button>
        </div>
      </div>

      {/* Discord Widget */}

      <DiscordWidget className="flex-1" />
    </div>
  );
}
