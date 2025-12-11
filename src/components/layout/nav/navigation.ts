import { LinkHref, ValidRoutes } from "@/i18n/routing";
import { TranslationKey } from "@/lib/config/constants";
import {
  HiOutlineArrowsRightLeft,
  HiOutlineCalculator,
  HiOutlineChartBarSquare,
  HiOutlineInformationCircle,
} from "react-icons/hi2";
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
};

export const navigation = (authenticated?: boolean): NavigationItem[] => [
  {
    name: "MAIN.NAVIGATION.HOME",
    description: "MAIN.NAVIGATION.HOME_DESCRIPTION",
    href: "/",
    icon: HiOutlineChartBarSquare,
    hidden: !authenticated,
  },
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
    name: "MAIN.NAVIGATION.TEAM",
    description: "MAIN.NAVIGATION.TEAM_DESCRIPTION",
    href: "/team",
    icon: HiOutlineCalculator,
  },
];

// export const navigationLegal = (): NavigationItem[] => [
//   {
//     name: "MAIN.NAVIGATION.IMPRESSUM",
//     description: "MAIN.NAVIGATION.IMPRESSUM_DESCRIPTION",
//     href: "/imprint" as const,
//     icon: HiOutlineDocument,
//   },
//   {
//     name: "MAIN.NAVIGATION.PRIVACY_POLICY",
//     description: "MAIN.NAVIGATION.PRIVACY_POLICY_DESCRIPTION",
//     href: "/privacy-policy" as const,
//     icon: HiOutlineShieldCheck,
//   },
//   {
//     name: "MAIN.NAVIGATION.TERMS_CONDITIONS",
//     description: "MAIN.NAVIGATION.TERMS_CONDITIONS_DESCRIPTION",
//     href: "/terms-of-service" as const,
//     icon: HiOutlineClipboardDocumentList,
//   },
// ];
