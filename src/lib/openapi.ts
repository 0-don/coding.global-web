import { getBaseUrl } from "../utils/base";
export type GetNews200ItemUserGlobalName = string | null;

export type GetNews200ItemUserBannerUrl = string | null | unknown;

export type GetNews200ItemUser = {
  bannerUrl: GetNews200ItemUserBannerUrl;
  displayAvatarURL: string;
  displayHexColor?: string;
  globalName: GetNews200ItemUserGlobalName;
  id: string;
  joinedAt: string;
  memberRoles: string[];
  username: string;
};

export type GetNews200Item = {
  attachments: GetNews200ItemAttachmentsItem[];
  content: string;
  createdAt: string;
  id: string;
  user: GetNews200ItemUser;
};

export type GetNews200ItemAttachmentsItemWidth = number | null;

export type GetNews200ItemAttachmentsItemHeight = number | null;

export type GetNews200ItemAttachmentsItemContentType = string | null;

export type GetNews200ItemAttachmentsItem = {
  contentType: GetNews200ItemAttachmentsItemContentType;
  height: GetNews200ItemAttachmentsItemHeight;
  url: string;
  width: GetNews200ItemAttachmentsItemWidth;
};

export type GetStaff200ItemGlobalName = string | null;

export type GetStaff200ItemBannerUrl = string | null | unknown;

export type GetStaff200Item = {
  bannerUrl: GetStaff200ItemBannerUrl;
  displayAvatarURL: string;
  displayHexColor?: string;
  globalName: GetStaff200ItemGlobalName;
  id: string;
  joinedAt: string;
  memberRoles: string[];
  username: string;
};

export type verifyAllUsersResponse = {
  data: string;
  status: number;
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
  const data = await res.json();

  return { status: res.status, data };
};

export type getStaffResponse = {
  data: GetStaff200Item[];
  status: number;
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
  const data = await res.json();

  return { status: res.status, data };
};

export type getNewsResponse = {
  data: GetNews200Item[];
  status: number;
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
  const data = await res.json();

  return { status: res.status, data };
};
