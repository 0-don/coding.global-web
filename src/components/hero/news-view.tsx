"use client";

import { rpc } from "@/src/lib/rpc";
import { useEffect, useMemo, useState } from "react";

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
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await rpc.api.news.get();
        let data: any[] = [];

        if (Array.isArray(response.data)) data = response.data;
        else if (response.data && typeof response.data === "object") {
          data = Array.isArray(response.data.news)
            ? response.data.news
            : [response.data];
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
    };

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

  const renderContent = (content: string) =>
    content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(
        /<#(\d+)>/g,
        '<a href="#" class="text-blue-400 hover:underline">$&</a>',
      )
      .replace(
        /<@(\d+)>/g,
        '<a href="#" class="text-blue-400 hover:underline">$&</a>',
      )
      .replace(/\n/g, "<br>");

  const memoizedNews = useMemo(() => newsItems, [newsItems]);

  return (
    <div className="min-h-screen w-full lg:top-70 relative z-10 text-white px-4 sm:px-6 py-12">
      {loading ? (
        <p className="text-gray-400 text-center py-10">Loading...</p>
      ) : memoizedNews.length === 0 ? (
        <p className="text-gray-400 text-center py-10">No news available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:-m-40 lg:pb-0 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {memoizedNews.map((news) => (
            <div
              key={news.id}
              className="flex flex-col backdrop-blur-2xl border border-red-900 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden min-h-[350px]"
            >
              {news.attachments.length > 0 && (
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={news.attachments[0].url}
                    alt="News attachment"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) =>
                      ((e.target as HTMLImageElement).src =
                        "/placeholder-image.jpg")
                    }
                  />
                </div>
              )}

              <div className="p-6 flex flex-col flex-grow">
                {news.attachments.length === 0 && (
                  <div className="flex items-center space-x-3 mb-4">
                    <img
                      src={news.user.displayAvatarURL}
                      alt={news.user.globalName}
                      className="w-10 h-10 rounded-full"
                      loading="lazy"
                    />
                    <div>
                      <div className="font-semibold text-white text-base">
                        {news.user.globalName}
                      </div>
                      <div className="text-sm text-gray-400">
                        {formatTimeAgo(news.createdAt)}
                      </div>
                    </div>
                  </div>
                )}

                <div
                  className="text-sm md:text-base text-gray-300 leading-relaxed flex-grow break-words"
                  dangerouslySetInnerHTML={{
                    __html: renderContent(news.content),
                  }}
                />

                {news.attachments.length > 0 && (
                  <div className="flex items-center space-x-3 mt-6 pt-4 border-t border-gray-700">
                    <img
                      src={news.user.displayAvatarURL}
                      alt={news.user.globalName}
                      className="w-9 h-9 rounded-full"
                      loading="lazy"
                    />
                    <div>
                      <div className="font-semibold text-white text-base">
                        {news.user.globalName}
                      </div>
                      <div className="text-sm text-gray-400">
                        {formatTimeAgo(news.createdAt)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
