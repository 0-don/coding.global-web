import { LinkHref, ValidRoutes } from "@/i18n/routing";
import type { TranslationKey } from "@/lib/config/constants";
import {
  HiOutlineArrowsRightLeft,
  HiOutlineBriefcase,
  HiOutlineChartBarSquare,
  HiOutlineCodeBracket,
  HiOutlineInformationCircle,
  HiOutlineShoppingBag,
  HiOutlineSparkles,
  HiOutlineUserGroup,
  HiOutlineBookOpen,
  HiOutlineWrenchScrewdriver,
  HiOutlineBolt,
  HiOutlineUsers,
} from "react-icons/hi2";
import { SiJavascript, SiPython } from "react-icons/si";
import { IconType } from "react-icons/lib";

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
    name: "MAIN.NAVIGATION.COMMUNITY",
    description: "MAIN.NAVIGATION.COMMUNITY_DESCRIPTION",
    href: "/news",
    icon: HiOutlineUserGroup,
    submenu: [
      {
        name: "MAIN.NAVIGATION.NEWS",
        description: "MAIN.NAVIGATION.NEWS_DESCRIPTION",
        href: "/news",
        icon: HiOutlineArrowsRightLeft,
      },
      {
        name: "MAIN.NAVIGATION.RULES",
        description: "MAIN.NAVIGATION.RULES_DESCRIPTION",
        href: "/rules",
        icon: HiOutlineInformationCircle,
      },
      {
        name: "MAIN.NAVIGATION.SHOWCASE",
        description: "MAIN.NAVIGATION.SHOWCASE_DESCRIPTION",
        href: "/showcase",
        icon: HiOutlineSparkles,
      },
      {
        name: "MAIN.NAVIGATION.TEAM",
        description: "MAIN.NAVIGATION.TEAM_DESCRIPTION",
        href: "/team",
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
        name: "MAIN.NAVIGATION.RESOURCES_JAVASCRIPT",
        description: "MAIN.NAVIGATION.RESOURCES_JAVASCRIPT_DESCRIPTION",
        href: "/resources/javascript",
        icon: SiJavascript,
        category: "MAIN.NAVIGATION.RESOURCES_LANGUAGES",
      },
      {
        name: "MAIN.NAVIGATION.RESOURCES_PYTHON",
        description: "MAIN.NAVIGATION.RESOURCES_PYTHON_DESCRIPTION",
        href: "/resources/python",
        icon: SiPython,
        category: "MAIN.NAVIGATION.RESOURCES_LANGUAGES",
      },
      {
        name: "MAIN.NAVIGATION.RESOURCES_VIBE_CODING",
        description: "MAIN.NAVIGATION.RESOURCES_VIBE_CODING_DESCRIPTION",
        href: "/resources/vibe-coding",
        icon: HiOutlineBolt,
        category: "MAIN.NAVIGATION.RESOURCES_GENERAL",
      },
      {
        name: "MAIN.NAVIGATION.RESOURCES_BEST_TOOLS",
        description: "MAIN.NAVIGATION.RESOURCES_BEST_TOOLS_DESCRIPTION",
        href: "/resources/best-tools",
        icon: HiOutlineWrenchScrewdriver,
        category: "MAIN.NAVIGATION.RESOURCES_GENERAL",
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
