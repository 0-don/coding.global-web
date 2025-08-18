"use client";

import { useEffect, useState } from "react";
import { rpc } from "@/lib/rpc";

type NewsItem = {
  id: string;
  content: string;
  createdAt: string;
  attachments: Array<{
    url: string;
    width: number;
    height: number;
    contentType: string;
  }>;
  user: {
    globalName: string;
    username: string;
    displayAvatarURL: string;
  };
};

export default function NewsView() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        const response = await rpc.api.news.get();

        let data: any[] = [];

        if (Array.isArray(response.data)) {
          data = response.data;
        } else if (response.data && typeof response.data === "object") {
          data = Array.isArray(response.data.news)
            ? response.data.news
            : [response.data];
        } else {
          data = [];
        }

        const formattedNews = data
          .filter((item: any) => item.user)
          .map((item: any) => ({
            id: item.id,
            content: item.content || "",
            createdAt: item.createdAt || new Date().toISOString(),
            attachments: Array.isArray(item.attachments)
              ? item.attachments
              : [],
            user: {
              globalName:
                item.user.globalName || item.user.username || "Unknown",
              username: item.user.username || "",
              displayAvatarURL:
                item.user.displayAvatarURL || "/default-avatar.png",
            },
          }));

        setNewsItems(formattedNews);
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMonths =
      (now.getFullYear() - past.getFullYear()) * 12 +
      (now.getMonth() - past.getMonth());

    if (diffInMonths === 0) return "just now";
    if (diffInMonths === 1) return "a month ago";
    if (diffInMonths < 12) return `${diffInMonths} months ago`;
    if (diffInMonths === 12) return "a year ago";
    return `${Math.floor(diffInMonths / 12)} years ago`;
  };

  const renderContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(
        /<#(\d+)>/g,
        '<a href="#" class="text-blue-400 hover:underline">$&</a>'
      )
      .replace(
        /<@(\d+)>/g,
        '<a href="#" class="text-blue-400 hover:underline">$&</a>'
      )
      .replace(/\n/g, "<br>");
  };

  return (
    <div className="min-h-screen w-full absolute top-30 left-0 z-10 text-white">
      <div className="px-4 sm:px-6 pb-8">
        <div className="grid grid-cols-3 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {loading ? (
            <p className="text-gray-400 col-span-full text-center py-4">
              
            </p>
          ) : newsItems.length > 0 ? (
            newsItems.map((news) => (
              <div
                key={news.id}
                className="backdrop-blur-2xl border border-red-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 flex flex-col"
              >
                {news.attachments.length > 0 && (
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <img
                      src={news.attachments[0].url}
                      alt="News attachment"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/placeholder-image.jpg";
                      }}
                    />
                  </div>
                )}

                <div className="p-4 flex flex-col flex-grow">
                  {news.attachments.length === 0 && (
                    <div className="flex items-center space-x-2 mb-3">
                      <img
                        src={news.user.displayAvatarURL}
                        alt={news.user.globalName}
                        className="w-9 h-9 rounded-full"
                      />
                      <div>
                        <div className="font-semibold text-white text-sm">
                          {news.user.globalName}
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatTimeAgo(news.createdAt)}
                        </div>
                      </div>
                    </div>
                  )}

                  <div
                    className="text-sm text-gray-300 leading-relaxed flex-grow"
                    dangerouslySetInnerHTML={{
                      __html: renderContent(news.content),
                    }}
                  />

                  {news.attachments.length > 0 && (
                    <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-gray-700">
                      <img
                        src={news.user.displayAvatarURL}
                        alt={news.user.globalName}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="font-semibold text-white text-sm">
                          {news.user.globalName}
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatTimeAgo(news.createdAt)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 col-span-full text-center py-4">
              No news available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
