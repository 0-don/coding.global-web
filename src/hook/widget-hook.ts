import { useEffect, useState } from "react";

interface DiscordMember {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  status: "online" | "idle" | "dnd" | "offline";
  avatar_url: string;
}

interface DiscordChannel {
  id: string;
  name: string;
  position: number;
}

interface DiscordWidgetData {
  id: string;
  name: string;
  instant_invite: string | null;
  channels: DiscordChannel[];
  members: DiscordMember[];
  presence_count: number;
}

export function useDiscordWidget(guildId: string) {
  const [widget, setWidget] = useState<DiscordWidgetData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchWidget = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://discord.com/api/guilds/${guildId}/widget.json`,
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
  }, [guildId]);

  return { widget, isLoading, error };
}
