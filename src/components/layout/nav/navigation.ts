import { LinkHref, ValidRoutes } from "@/i18n/routing";
import type { TranslationKey } from "@/lib/config/constants";
import { DiJava } from "react-icons/di";
import {
  HiOutlineAcademicCap,
  HiOutlineArrowsRightLeft,
  HiOutlineBolt,
  HiOutlineBookOpen,
  HiOutlineBriefcase,
  HiOutlineChartBarSquare,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCodeBracket,
  HiOutlineCodeBracketSquare,
  HiOutlineCommandLine,
  HiOutlineInformationCircle,
  HiOutlineShieldCheck,
  HiOutlineShoppingBag,
  HiOutlineSparkles,
  HiOutlineUserGroup,
  HiOutlineUsers,
} from "react-icons/hi2";
import { IconType } from "react-icons/lib";
import {
  SiC,
  SiCplusplus,
  SiDart,
  SiDotnet,
  SiGnubash,
  SiGo,
  SiHtml5,
  SiJavascript,
  SiKotlin,
  SiLua,
  SiPhp,
  SiPython,
  SiRust,
  SiSwift,
  SiZig,
} from "react-icons/si";
import { TbSql } from "react-icons/tb";

export const isActiveLink = (pathname: string, href: ValidRoutes) => {
  let hrefString: string;

  if (typeof href === "string") {
    hrefString = href;
  } else if (typeof href === "object" && href !== null && "pathname" in href) {
    // Handle object-style hrefs like { pathname: "/community/coding/[language]", params: { language: "javascript" } }
    let resolvedPath = href.pathname as string;
    if ("params" in href && href.params) {
      const params = href.params as Record<string, string>;
      for (const [key, value] of Object.entries(params)) {
        resolvedPath = resolvedPath.replace(`[${key}]`, value);
      }
    }
    hrefString = resolvedPath;
  } else {
    return false;
  }

  // Normalize paths by removing trailing slashes
  const cleanPathname = pathname.replace(/\/$/, "") || "/";
  const cleanHref = hrefString.replace(/\/$/, "") || "/";

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
      {
        name: "MAIN.NAVIGATION.CODING",
        description: "MAIN.NAVIGATION.CODING_DESCRIPTION",
        href: "/community/coding",
        icon: HiOutlineCodeBracketSquare,
        submenu: [
          {
            name: "MAIN.NAVIGATION.CODING_JAVASCRIPT",
            description: "MAIN.NAVIGATION.CODING_JAVASCRIPT_DESCRIPTION",
            href: { pathname: "/community/coding/[language]", params: { language: "javascript" } },
            icon: SiJavascript,
          },
          {
            name: "MAIN.NAVIGATION.CODING_PYTHON",
            description: "MAIN.NAVIGATION.CODING_PYTHON_DESCRIPTION",
            href: { pathname: "/community/coding/[language]", params: { language: "python" } },
            icon: SiPython,
          },
          {
            name: "MAIN.NAVIGATION.CODING_RUST",
            description: "MAIN.NAVIGATION.CODING_RUST_DESCRIPTION",
            href: { pathname: "/community/coding/[language]", params: { language: "rust" } },
            icon: SiRust,
          },
          {
            name: "MAIN.NAVIGATION.CODING_CPP",
            description: "MAIN.NAVIGATION.CODING_CPP_DESCRIPTION",
            href: { pathname: "/community/coding/[language]", params: { language: "cpp" } },
            icon: SiCplusplus,
          },
          {
            name: "MAIN.NAVIGATION.CODING_CSHARP",
            description: "MAIN.NAVIGATION.CODING_CSHARP_DESCRIPTION",
            href: { pathname: "/community/coding/[language]", params: { language: "csharp" } },
            icon: SiDotnet,
          },
          {
            name: "MAIN.NAVIGATION.CODING_C",
            description: "MAIN.NAVIGATION.CODING_C_DESCRIPTION",
            href: { pathname: "/community/coding/[language]", params: { language: "c" } },
            icon: SiC,
          },
          {
            name: "MAIN.NAVIGATION.CODING_GO",
            description: "MAIN.NAVIGATION.CODING_GO_DESCRIPTION",
            href: { pathname: "/community/coding/[language]", params: { language: "go" } },
            icon: SiGo,
          },
          {
            name: "MAIN.NAVIGATION.CODING_JAVA",
            description: "MAIN.NAVIGATION.CODING_JAVA_DESCRIPTION",
            href: { pathname: "/community/coding/[language]", params: { language: "java" } },
            icon: DiJava,
          },
          {
            name: "MAIN.NAVIGATION.CODING_KOTLIN",
            description: "MAIN.NAVIGATION.CODING_KOTLIN_DESCRIPTION",
            href: { pathname: "/community/coding/[language]", params: { language: "kotlin" } },
            icon: SiKotlin,
          },
          {
            name: "MAIN.NAVIGATION.CODING_DART",
            description: "MAIN.NAVIGATION.CODING_DART_DESCRIPTION",
            href: { pathname: "/community/coding/[language]", params: { language: "dart" } },
            icon: SiDart,
          },
          {
            name: "MAIN.NAVIGATION.CODING_LUA",
            description: "MAIN.NAVIGATION.CODING_LUA_DESCRIPTION",
            href: { pathname: "/community/coding/[language]", params: { language: "lua" } },
            icon: SiLua,
          },
          {
            name: "MAIN.NAVIGATION.CODING_PHP",
            description: "MAIN.NAVIGATION.CODING_PHP_DESCRIPTION",
            href: { pathname: "/community/coding/[language]", params: { language: "php" } },
            icon: SiPhp,
          },
          {
            name: "MAIN.NAVIGATION.CODING_HTML_CSS",
            description: "MAIN.NAVIGATION.CODING_HTML_CSS_DESCRIPTION",
            href: { pathname: "/community/coding/[language]", params: { language: "html-css" } },
            icon: SiHtml5,
          },
          {
            name: "MAIN.NAVIGATION.CODING_SQL",
            description: "MAIN.NAVIGATION.CODING_SQL_DESCRIPTION",
            href: { pathname: "/community/coding/[language]", params: { language: "sql" } },
            icon: TbSql,
          },
          {
            name: "MAIN.NAVIGATION.CODING_SWIFT",
            description: "MAIN.NAVIGATION.CODING_SWIFT_DESCRIPTION",
            href: { pathname: "/community/coding/[language]", params: { language: "swift" } },
            icon: SiSwift,
          },
          {
            name: "MAIN.NAVIGATION.CODING_BASH_POWERSHELL",
            description: "MAIN.NAVIGATION.CODING_BASH_POWERSHELL_DESCRIPTION",
            href: { pathname: "/community/coding/[language]", params: { language: "bash-powershell" } },
            icon: SiGnubash,
          },
          {
            name: "MAIN.NAVIGATION.CODING_VISUAL_BASIC",
            description: "MAIN.NAVIGATION.CODING_VISUAL_BASIC_DESCRIPTION",
            href: { pathname: "/community/coding/[language]", params: { language: "visual-basic" } },
            icon: HiOutlineCommandLine,
          },
          {
            name: "MAIN.NAVIGATION.CODING_ZIG",
            description: "MAIN.NAVIGATION.CODING_ZIG_DESCRIPTION",
            href: { pathname: "/community/coding/[language]", params: { language: "zig" } },
            icon: SiZig,
          },
          {
            name: "MAIN.NAVIGATION.CODING_OTHER",
            description: "MAIN.NAVIGATION.CODING_OTHER_DESCRIPTION",
            href: { pathname: "/community/coding/[language]", params: { language: "other" } },
            icon: HiOutlineCodeBracket,
          },
        ],
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
