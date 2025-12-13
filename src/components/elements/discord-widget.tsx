"use client";

import { useDiscordWidget } from "@/hook/widget-hook";
import { cn } from "@/lib/utils";

interface DiscordWidgetProps {
  guildId: string;
  className?: string;
  theme?: "dark" | "light";
}

export function DiscordWidget({
  guildId,
  className,
  theme = "dark",
}: DiscordWidgetProps) {
  const { widget, isLoading, error } = useDiscordWidget(guildId);

  if (isLoading) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg p-8",
          theme === "dark" ? "bg-[#2b2d31] text-white" : "bg-white text-black",
          className,
        )}
      >
        <div className="text-sm opacity-60">Loading Discord widget...</div>
      </div>
    );
  }

  if (error || !widget) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg p-8",
          theme === "dark" ? "bg-[#2b2d31] text-white" : "bg-white text-black",
          className,
        )}
      >
        <div className="text-sm opacity-60">
          Unable to load Discord widget. Make sure the widget is enabled in
          your server settings.
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg shadow-lg",
        theme === "dark" ? "bg-[#2b2d31]" : "bg-white",
        className,
      )}
    >
      {/* Server Header */}
      <div
        className={cn(
          "border-b p-4",
          theme === "dark"
            ? "border-[#3f4147] text-white"
            : "border-gray-200 text-black",
        )}
      >
        <h3 className="font-semibold">{widget.name}</h3>
        <div className="mt-1 flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            <span
              className={cn(
                "text-xs",
                theme === "dark" ? "text-gray-400" : "text-gray-600",
              )}
            >
              {widget.presence_count} Online
            </span>
          </div>
          <span
            className={cn(
              "text-xs",
              theme === "dark" ? "text-gray-400" : "text-gray-600",
            )}
          >
            {widget.members.length} Members
          </span>
        </div>
      </div>

      {/* Voice Channels */}
      {widget.channels.length > 0 && (
        <div className="border-b border-[#3f4147] p-3">
          <h4
            className={cn(
              "mb-2 text-xs font-semibold uppercase",
              theme === "dark" ? "text-gray-400" : "text-gray-600",
            )}
          >
            Voice Channels
          </h4>
          <div className="space-y-1">
            {widget.channels.map((channel) => (
              <div
                key={channel.id}
                className={cn(
                  "flex items-center gap-2 rounded px-2 py-1 text-sm",
                  theme === "dark"
                    ? "text-gray-300 hover:bg-[#3f4147]"
                    : "text-gray-700 hover:bg-gray-100",
                )}
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 3a9 9 0 00-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2a7 7 0 0114 0v2h-4v8h3c1.66 0 3-1.34 3-3v-7a9 9 0 00-9-9z" />
                </svg>
                <span>{channel.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Members List */}
      {widget.members.length > 0 && (
        <div className="max-h-64 overflow-y-auto p-3">
          <h4
            className={cn(
              "mb-2 text-xs font-semibold uppercase",
              theme === "dark" ? "text-gray-400" : "text-gray-600",
            )}
          >
            Members — {widget.members.length}
          </h4>
          <div className="space-y-1">
            {widget.members.map((member) => (
              <div
                key={member.id}
                className={cn(
                  "flex items-center gap-2 rounded px-2 py-1",
                  theme === "dark"
                    ? "text-white hover:bg-[#3f4147]"
                    : "text-black hover:bg-gray-100",
                )}
              >
                <div className="relative">
                  <img
                    src={
                      member.avatar_url ||
                      `https://cdn.discordapp.com/embed/avatars/${parseInt(member.discriminator) % 5}.png`
                    }
                    alt={member.username}
                    className="h-8 w-8 rounded-full"
                  />
                  <span
                    className={cn(
                      "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2",
                      theme === "dark" ? "border-[#2b2d31]" : "border-white",
                      member.status === "online"
                        ? "bg-green-500"
                        : member.status === "idle"
                          ? "bg-yellow-500"
                          : member.status === "dnd"
                            ? "bg-red-500"
                            : "bg-gray-500",
                    )}
                  ></span>
                </div>
                <span className="text-sm">{member.username}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Join Server Button */}
      {widget.instant_invite && (
        <div className="border-t border-[#3f4147] p-4">
          <a
            href={widget.instant_invite}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "block w-full rounded px-4 py-2 text-center text-sm font-semibold transition-colors",
              theme === "dark"
                ? "bg-[#5865f2] text-white hover:bg-[#4752c4]"
                : "bg-[#5865f2] text-white hover:bg-[#4752c4]",
            )}
          >
            Join Server
          </a>
        </div>
      )}
    </div>
  );
}
