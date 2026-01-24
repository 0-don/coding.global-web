import {
  GetApiByGuildIdThreadByThreadTypeByThreadId200,
  GetApiByGuildIdThreadByThreadTypeByThreadIdMessages200MessagesItem,
} from "@/openapi";
import {
  BreadcrumbList,
  Comment,
  DiscussionForumPosting,
  InteractionCounter,
  JobPosting,
  Organization,
  Person,
  WithContext,
} from "schema-dts";
import { getDiscordUserLink } from "../utils/base";

type Author = {
  id: string;
  displayName: string;
  username: string;
  avatarUrl: string;
};

function buildAuthorSchema(author: Author): Person {
  return {
    "@type": "Person",
    name: author.displayName || author.username,
    url: getDiscordUserLink(author.id),
    image: author.avatarUrl,
  };
}

function buildCommentSchema(
  message: GetApiByGuildIdThreadByThreadTypeByThreadIdMessages200MessagesItem,
): Comment | null {
  if (!message.author || !message.content?.trim()) return null;

  const comment: Comment = {
    "@type": "Comment",
    author: buildAuthorSchema(message.author),
    datePublished: message.createdAt,
    text: message.content,
  };

  if (message.editedAt) {
    comment.dateModified = message.editedAt;
  }

  return comment;
}

function buildInteractionStatistics(
  thread: GetApiByGuildIdThreadByThreadTypeByThreadId200,
): InteractionCounter[] {
  const stats: InteractionCounter[] = [];

  stats.push({
    "@type": "InteractionCounter",
    interactionType: { "@type": "CommentAction" },
    userInteractionCount: thread.messageCount,
  });

  if (thread.firstMessage?.reactions?.length) {
    const totalReactions = thread.firstMessage.reactions.reduce(
      (sum, r) => sum + r.count,
      0,
    );
    stats.push({
      "@type": "InteractionCounter",
      interactionType: { "@type": "LikeAction" },
      userInteractionCount: totalReactions,
    });
  }

  return stats;
}

export function buildDiscussionForumPostingSchema(
  thread: GetApiByGuildIdThreadByThreadTypeByThreadId200,
  messages: GetApiByGuildIdThreadByThreadTypeByThreadIdMessages200MessagesItem[],
  pageUrl: string,
): WithContext<DiscussionForumPosting> {
  const comments = messages
    .slice(0, 10)
    .map(buildCommentSchema)
    .filter((c): c is Comment => c !== null);

  const schema: WithContext<DiscussionForumPosting> = {
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    mainEntityOfPage: pageUrl,
    headline: thread.name,
    author: buildAuthorSchema(thread.author),
    datePublished: thread.createdAt || thread.lastActivityAt || thread.updatedAt,
    url: pageUrl,
    commentCount: thread.messageCount,
    interactionStatistic: buildInteractionStatistics(thread),
  };

  if (thread.content) {
    schema.text = thread.content;
  }

  if (thread.lastActivityAt && thread.lastActivityAt !== thread.createdAt) {
    schema.dateModified = thread.lastActivityAt;
  }

  if (thread.imageUrl) {
    schema.image = thread.imageUrl;
  }

  if (comments.length > 0) {
    schema.comment = comments;
  }

  return schema;
}

export function buildOrganizationSchema(): WithContext<Organization> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: process.env.NEXT_PUBLIC_APP_NAME || "Coding Global",
    url: process.env.NEXT_PUBLIC_URL,
    logo: `${process.env.NEXT_PUBLIC_URL}/images/logo.gif`,
    sameAs: ["https://discord.gg/coding"],
  };
}

export type BreadcrumbItem = {
  name: string;
  url?: string;
};

export function buildBreadcrumbListSchema(
  items: BreadcrumbItem[],
): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem" as const,
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  };
}

export type JobPostingData = {
  title: string;
  description: string;
  datePosted: string;
  employerName: string;
  pageUrl: string;
};

export function buildJobPostingSchema(
  data: JobPostingData,
): WithContext<JobPosting> {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: data.title,
    description: data.description,
    datePosted: data.datePosted,
    hiringOrganization: {
      "@type": "Organization",
      name: data.employerName,
    },
    url: data.pageUrl,
  };
}
