"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { FiHome } from "react-icons/fi";
import { LuSearch } from "react-icons/lu";

export default function NotFound() {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="bg-muted mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <LuSearch className="text-muted-foreground h-6 w-6" />
          </div>
          <CardTitle className="text-xl font-semibold">
            {t("MAIN.ERROR.PAGE_NOT_FOUND")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground text-sm">
            {t("MAIN.ERROR.PAGE_NOT_FOUND_DESCRIPTION")}
          </p>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              {t("MAIN.ACTIONS.GO_BACK")}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="flex items-center gap-2"
            >
              <FiHome className="h-4 w-4" />
              {t("MAIN.ACTIONS.GO_HOME")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
