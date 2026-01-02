import { LinkHref, ValidRoutes } from "@/i18n/routing";
import type { TranslationKey } from "@/lib/config/constants";
import {
  HiOutlineAcademicCap,
  HiOutlineArrowsRightLeft,
  HiOutlineBolt,
  HiOutlineBookOpen,
  HiOutlineBriefcase,
  HiOutlineChartBarSquare,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCodeBracket,
  HiOutlineCommandLine,
  HiOutlineInformationCircle,
  HiOutlineShieldCheck,
  HiOutlineShoppingBag,
  HiOutlineSparkles,
  HiOutlineUserGroup,
  HiOutlineUsers,
} from "react-icons/hi2";
import { IconType } from "react-icons/lib";
import { SiJavascript, SiPython } from "react-icons/si";

export const isActiveLink = (pathname: string, href: ValidRoutes) => {
  if (typeof href !== "string") return false;

  // Normalize paths by removing trailing slashes
  const cleanPathname = pathname.replace(/\/$/, "") || "/";
  const cleanHref = href.replace(/\/$/, "") || "/";

  // Exact match for home page
  if (cleanHref === "/") {
    return cleanPathname === "/";
  }

  // Check for exact match or if pathname starts with href followed by '/'
  return (
    cleanPathname === cleanHref || cleanPathname.startsWith(cleanHref + "/")
  );
};

export type NavigationItem = {
  name: TranslationKey;
  description: TranslationKey;
  href: LinkHref;
  icon: IconType;
  hidden?: boolean;
  category?: TranslationKey;
  submenu?: NavigationItem[];
};

export type CategoryGroup = {
  category: TranslationKey | null;
  items: NavigationItem[];
};

export function groupByCategory(items: NavigationItem[]): CategoryGroup[] {
  const groups: CategoryGroup[] = [];
  const categoryMap = new Map<TranslationKey | null, NavigationItem[]>();

  for (const item of items) {
    const cat = item.category || null;
    if (!categoryMap.has(cat)) {
      categoryMap.set(cat, []);
    }
    categoryMap.get(cat)!.push(item);
  }

  for (const [category, categoryItems] of categoryMap) {
    groups.push({ category, items: categoryItems });
  }

  return groups;
}

export const navigation = (authenticated?: boolean): NavigationItem[] => [
  {
    name: "MAIN.NAVIGATION.HOME",
    description: "MAIN.NAVIGATION.HOME_DESCRIPTION",
    href: "/",
    icon: HiOutlineChartBarSquare,
    hidden: !authenticated,
  },
  {
    name: "MAIN.NAVIGATION.CHAT",
    description: "MAIN.NAVIGATION.CHAT_DESCRIPTION",
    href: "/chat",
    icon: HiOutlineChatBubbleLeftRight,
  },
  {
    name: "MAIN.NAVIGATION.COMMUNITY",
    description: "MAIN.NAVIGATION.COMMUNITY_DESCRIPTION",
    href: "/community/news",
    icon: HiOutlineUserGroup,
    submenu: [
      {
        name: "MAIN.NAVIGATION.NEWS",
        description: "MAIN.NAVIGATION.NEWS_DESCRIPTION",
        href: "/community/news",
        icon: HiOutlineArrowsRightLeft,
      },
      {
        name: "MAIN.NAVIGATION.RULES",
        description: "MAIN.NAVIGATION.RULES_DESCRIPTION",
        href: "/community/rules",
        icon: HiOutlineInformationCircle,
      },
      {
        name: "MAIN.NAVIGATION.SHOWCASE",
        description: "MAIN.NAVIGATION.SHOWCASE_DESCRIPTION",
        href: "/community/showcase",
        icon: HiOutlineSparkles,
      },
      {
        name: "MAIN.NAVIGATION.TEAM",
        description: "MAIN.NAVIGATION.TEAM_DESCRIPTION",
        href: "/community/team",
        icon: HiOutlineUsers,
      },
    ],
  },
  {
    name: "MAIN.NAVIGATION.RESOURCES",
    description: "MAIN.NAVIGATION.RESOURCES_DESCRIPTION",
    href: "/resources",
    icon: HiOutlineBookOpen,
    submenu: [
      {
        name: "MAIN.NAVIGATION.RESOURCES_LANGUAGES",
        description: "MAIN.NAVIGATION.RESOURCES_LANGUAGES_DESCRIPTION",
        href: "/resources",
        icon: HiOutlineCommandLine,
        submenu: [
          {
            name: "MAIN.NAVIGATION.RESOURCES_JAVASCRIPT",
            description: "MAIN.NAVIGATION.RESOURCES_JAVASCRIPT_DESCRIPTION",
            href: "/resources/languages/javascript",
            icon: SiJavascript,
          },
          {
            name: "MAIN.NAVIGATION.RESOURCES_PYTHON",
            description: "MAIN.NAVIGATION.RESOURCES_PYTHON_DESCRIPTION",
            href: "/resources/languages/python",
            icon: SiPython,
          },
        ],
      },
      {
        name: "MAIN.NAVIGATION.RESOURCES_GUIDES",
        description: "MAIN.NAVIGATION.RESOURCES_GUIDES_DESCRIPTION",
        href: "/resources",
        icon: HiOutlineAcademicCap,
        submenu: [
          {
            name: "MAIN.NAVIGATION.RESOURCES_VIBE_CODING",
            description: "MAIN.NAVIGATION.RESOURCES_VIBE_CODING_DESCRIPTION",
            href: "/resources/guides/vibe-coding",
            icon: HiOutlineBolt,
          },
          {
            name: "MAIN.NAVIGATION.RESOURCES_CYBER_SECURITY",
            description: "MAIN.NAVIGATION.RESOURCES_CYBER_SECURITY_DESCRIPTION",
            href: "/resources/guides/cyber-security",
            icon: HiOutlineShieldCheck,
          },
        ],
      },
    ],
  },
  {
    name: "MAIN.NAVIGATION.MARKETPLACE",
    description: "MAIN.NAVIGATION.MARKETPLACE_DESCRIPTION",
    href: "/marketplace",
    icon: HiOutlineShoppingBag,
    submenu: [
      {
        name: "MAIN.NAVIGATION.MARKETPLACE_JOB_BOARD",
        description: "MAIN.NAVIGATION.MARKETPLACE_JOB_BOARD_DESCRIPTION",
        href: "/marketplace/job-board",
        icon: HiOutlineBriefcase,
      },
      {
        name: "MAIN.NAVIGATION.MARKETPLACE_DEV_BOARD",
        description: "MAIN.NAVIGATION.MARKETPLACE_DEV_BOARD_DESCRIPTION",
        href: "/marketplace/dev-board",
        icon: HiOutlineCodeBracket,
      },
    ],
  },
];
