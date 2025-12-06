"use client";

import { rpc } from "@/lib/rpc";
import Image from "next/image";
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

type RawNewsItem = {
  id: string;
  content?: string;
  createdAt?: string;
  attachments?: Array<{
    url: string;
    width: number;
    height: number;
    contentType: string;
  }>;
  user?: {
    globalName?: string;
    username?: string;
    displayAvatarURL?: string;
  };
};

type ApiResponse = {
  data:
    | RawNewsItem[]
    | { news?: RawNewsItem[] }
    | RawNewsItem
    | null
    | undefined;
};

export function News() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = (await rpc.api.news.get()) as ApiResponse;
        let data: RawNewsItem[] = [];

        if (Array.isArray(response.data)) {
          data = response.data;
        } else if (response.data && typeof response.data === "object") {
          const newsData = response.data as
            | { news?: RawNewsItem[] }
            | RawNewsItem;
          if ("news" in newsData && Array.isArray(newsData.news)) {
            data = newsData.news;
          } else {
            data = [newsData as RawNewsItem];
          }
        }

        const formattedNews = data
          .filter((item) => item.user)
          .map((item) => ({
            id: item.id,
            content: item.content || "",
            createdAt: item.createdAt || new Date().toISOString(),
            attachments: Array.isArray(item.attachments)
              ? item.attachments
              : [],
            user: {
              globalName:
                item.user?.globalName || item.user?.username || "Unknown",
              username: item.user?.username || "",
              displayAvatarURL:
                item.user?.displayAvatarURL || "/default-avatar.png",
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
    <div className="relative z-10 min-h-screen w-full px-4 py-12 text-white sm:px-6 lg:top-70">
      {loading ? (
        <p className="py-10 text-center text-gray-400">Loading...</p>
      ) : memoizedNews.length === 0 ? (
        <p className="py-10 text-center text-gray-400">No news available.</p>
      ) : (
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-1 md:grid-cols-2 lg:-m-40 lg:grid-cols-3 lg:pb-0">
          {memoizedNews.map((news) => (
            <div
              key={news.id}
              className="flex min-h-[350px] flex-col overflow-hidden rounded-2xl border border-red-900 shadow-lg backdrop-blur-2xl transition duration-300 hover:shadow-2xl"
            >
              {news.attachments.length > 0 && (
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={news.attachments[0].url}
                    alt="News attachment"
                    className="h-full w-full object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}

              <div className="flex grow flex-col p-6">
                {news.attachments.length === 0 && (
                  <div className="mb-4 flex items-center space-x-3">
                    <Image
                      src={news.user.displayAvatarURL}
                      alt={news.user.globalName}
                      className="h-10 w-10 rounded-full"
                      width={40}
                      height={40}
                    />
                    <div>
                      <div className="text-base font-semibold text-white">
                        {news.user.globalName}
                      </div>
                      <div className="text-sm text-gray-400">
                        {formatTimeAgo(news.createdAt)}
                      </div>
                    </div>
                  </div>
                )}

                <div
                  className="grow text-sm leading-relaxed wrap-break-word text-gray-300 md:text-base"
                  dangerouslySetInnerHTML={{
                    __html: renderContent(news.content),
                  }}
                />

                {news.attachments.length > 0 && (
                  <div className="mt-6 flex items-center space-x-3 border-t border-gray-700 pt-4">
                    <Image
                      src={news.user.displayAvatarURL}
                      alt={news.user.globalName}
                      className="h-9 w-9 rounded-full"
                      width={36}
                      height={36}
                    />
                    <div>
                      <div className="text-base font-semibold text-white">
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
