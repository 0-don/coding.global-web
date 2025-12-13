import { useEffect, useState } from "react";

interface StatusRole {
  name: string;
  position: number;
}

interface DiscordMember {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  status: "online" | "idle" | "dnd" | "offline";
  activity: string | null;
  statusRoles: StatusRole[];
  highestRolePosition: number;
}

interface DiscordChannel {
  id: string;
  name: string;
  position: number;
}

interface DiscordWidgetData {
  id: string;
  name: string;
  channels: DiscordChannel[];
  members: DiscordMember[];
  presenceCount: number;
  memberCount: number;
  icon: string | null;
  banner: string | null;
}

export function useDiscordWidget(guildId: string, botUrl?: string) {
  const [widget, setWidget] = useState<DiscordWidgetData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchWidget = async () => {
      try {
        setIsLoading(true);
        const apiUrl = botUrl || process.env.NEXT_PUBLIC_BOT_URL || "https://bot.coding.global";
        const response = await fetch(
          `${apiUrl}/api/${guildId}/widget`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch Discord widget");
        }

        const data = await response.json();
        setWidget(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Unknown error occurred"),
        );
        setWidget(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWidget();

    // Refresh widget data every 30 seconds
    const interval = setInterval(fetchWidget, 30000);

    return () => clearInterval(interval);
  }, [guildId, botUrl]);

  return { widget, isLoading, error };
}
