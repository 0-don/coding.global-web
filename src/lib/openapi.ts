import { getBaseUrl } from "../utils/base";
export interface User {
  id: string;
  username: string;
  /** @nullable */
  globalName: string | null;
  joinedAt: string;
  displayAvatarURL: string;
  /** @nullable */
  bannerUrl: string | null;
  displayHexColor?: string;
  memberRoles: string[];
}

/**
 * @nullable
 */
export type NewsAttachmentWidth = string | null | number | null | null;

/**
 * @nullable
 */
export type NewsAttachmentHeight = string | null | number | null | null;

export interface NewsAttachment {
  url: string;
  /** @nullable */
  width: NewsAttachmentWidth;
  /** @nullable */
  height: NewsAttachmentHeight;
  /** @nullable */
  contentType: string | null;
}

/**
 * @nullable
 */
export type NewsAttachmentsItemWidth = string | null | number | null | null;

/**
 * @nullable
 */
export type NewsAttachmentsItemHeight = string | null | number | null | null;

export type NewsAttachmentsItem = {
  url: string;
  /** @nullable */
  width: NewsAttachmentsItemWidth;
  /** @nullable */
  height: NewsAttachmentsItemHeight;
  /** @nullable */
  contentType: string | null;
};

export type NewsUser = {
  id: string;
  username: string;
  /** @nullable */
  globalName: string | null;
  joinedAt: string;
  displayAvatarURL: string;
  /** @nullable */
  bannerUrl: string | null;
  displayHexColor?: string;
  memberRoles: string[];
};

export interface News {
  id: string;
  content: string;
  createdAt: string;
  attachments: NewsAttachmentsItem[];
  user: NewsUser;
}

export type UsersItem = {
  id: string;
  username: string;
  /** @nullable */
  globalName: string | null;
  joinedAt: string;
  displayAvatarURL: string;
  /** @nullable */
  bannerUrl: string | null;
  displayHexColor?: string;
  memberRoles: string[];
};

export type Users = UsersItem[];

/**
 * @nullable
 */
export type NewsListItemAttachmentsItemWidth =
  | string
  | null
  | number
  | null
  | null;

/**
 * @nullable
 */
export type NewsListItemAttachmentsItemHeight =
  | string
  | null
  | number
  | null
  | null;

export type NewsListItemAttachmentsItem = {
  url: string;
  /** @nullable */
  width: NewsListItemAttachmentsItemWidth;
  /** @nullable */
  height: NewsListItemAttachmentsItemHeight;
  /** @nullable */
  contentType: string | null;
};

export type NewsListItemUser = {
  id: string;
  username: string;
  /** @nullable */
  globalName: string | null;
  joinedAt: string;
  displayAvatarURL: string;
  /** @nullable */
  bannerUrl: string | null;
  displayHexColor?: string;
  memberRoles: string[];
};

export type NewsListItem = {
  id: string;
  content: string;
  createdAt: string;
  attachments: NewsListItemAttachmentsItem[];
  user: NewsListItemUser;
};

export type NewsList = NewsListItem[];

/**
 * Initiates verification for all users in the specified guild.
 */
export type verifyAllUsersResponse200 = {
  data: void;
  status: 200;
};

export type verifyAllUsersResponseComposite = verifyAllUsersResponse200;

export type verifyAllUsersResponse = verifyAllUsersResponseComposite & {
  headers: Headers;
};

export const getVerifyAllUsersUrl = (guildId: string) => {
  return `${getBaseUrl()}/api/${guildId}/verify-all-users`;
};

export const verifyAllUsers = async (
  guildId: string,
  options?: RequestInit,
): Promise<verifyAllUsersResponse> => {
  const res = await fetch(getVerifyAllUsersUrl(guildId), {
    ...options,
    method: "GET",
  });

  const body = [204, 205, 304].includes(res.status) ? null : await res.text();
  const data: verifyAllUsersResponse["data"] = body ? JSON.parse(body) : {};

  return {
    data,
    status: res.status,
    headers: res.headers,
  } as verifyAllUsersResponse;
};

/**
 * Retrieves a list of staff members for the specified guild.
 */
export type getStaffResponse200 = {
  data: void;
  status: 200;
};

export type getStaffResponseComposite = getStaffResponse200;

export type getStaffResponse = getStaffResponseComposite & {
  headers: Headers;
};

export const getGetStaffUrl = (guildId: string) => {
  return `${getBaseUrl()}/api/${guildId}/staff`;
};

export const getStaff = async (
  guildId: string,
  options?: RequestInit,
): Promise<getStaffResponse> => {
  const res = await fetch(getGetStaffUrl(guildId), {
    ...options,
    method: "GET",
  });

  const body = [204, 205, 304].includes(res.status) ? null : await res.text();
  const data: getStaffResponse["data"] = body ? JSON.parse(body) : {};

  return { data, status: res.status, headers: res.headers } as getStaffResponse;
};

/**
 * Retrieves a list of news messages from the guild’s news channel.
 */
export type getNewsResponse200 = {
  data: void;
  status: 200;
};

export type getNewsResponseComposite = getNewsResponse200;

export type getNewsResponse = getNewsResponseComposite & {
  headers: Headers;
};

export const getGetNewsUrl = (guildId: string) => {
  return `${getBaseUrl()}/api/${guildId}/news`;
};

export const getNews = async (
  guildId: string,
  options?: RequestInit,
): Promise<getNewsResponse> => {
  const res = await fetch(getGetNewsUrl(guildId), {
    ...options,
    method: "GET",
  });

  const body = [204, 205, 304].includes(res.status) ? null : await res.text();
  const data: getNewsResponse["data"] = body ? JSON.parse(body) : {};

  return { data, status: res.status, headers: res.headers } as getNewsResponse;
};
