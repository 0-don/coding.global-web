"use client";

import { Link, usePathname } from "@/i18n/navigation";
import type { LinkHref } from "@/i18n/routing";
import type { TranslationKey } from "@/lib/config/constants";
import { cn } from "@/lib/utils";
import {
  navigationExpansionAtom,
  toggleExpansionAtom,
} from "@/store/navigation-expansion-store";
import { useAtom, useSetAtom } from "jotai";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { IconType } from "react-icons/lib";
import { isActiveLink, NavigationItem } from "./navigation";

const RESOURCES_NAV_KEY = "MAIN.NAVIGATION.RESOURCES";

type NavItemProps = {
  children: React.ReactNode;
  href: LinkHref;
  icon?: IconType;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
};

export function NavItem(props: NavItemProps) {
  return (
    <li className="list-none">
      <Link
        href={props.href}
        onClick={props.onClick}
        className={cn(
          "hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          props.isActive && "bg-primary/10 text-primary",
          props.className,
        )}
      >
        {props.icon && (
          <props.icon
            className={cn("size-4", props.isActive && "text-primary")}
          />
        )}
        <span>{props.children}</span>
      </Link>
    </li>
  );
}

type CollapsibleNavItemProps = {
  item: NavigationItem;
  hasCategories?: boolean;
  onNavigate?: () => void;
  className?: string;
};

export function CollapsibleNavItem({
  item,
  hasCategories = false,
  onNavigate,
  className,
}: CollapsibleNavItemProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const [expansionState] = useAtom(navigationExpansionAtom);
  const toggleExpansion = useSetAtom(toggleExpansionAtom);

  const isActive = isActiveLink(pathname, item.href);
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const isExpanded = expansionState[item.name] ?? false;

  return (
    <li className={cn("list-none", className)}>
      <div className="flex items-center">
        <Link
          href={item.href}
          onClick={onNavigate}
          className={cn(
            "hover:bg-accent hover:text-accent-foreground flex flex-1 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            isActive && "bg-primary/10 text-primary",
          )}
        >
          <item.icon className={cn("size-4", isActive && "text-primary")} />
          <span>{t(item.name)}</span>
        </Link>
        {hasSubmenu && (
          <button
            type="button"
            onClick={() => toggleExpansion(item.name)}
            className="hover:bg-accent flex size-8 items-center justify-center rounded-md transition-colors"
            aria-label={isExpanded ? "Collapse submenu" : "Expand submenu"}
          >
            <ChevronRight
              className={cn(
                "size-4 transition-transform duration-200",
                isExpanded && "rotate-90",
              )}
            />
          </button>
        )}
      </div>
      {hasSubmenu && isExpanded && (
        <ul className="mt-1 ml-4 flex flex-col gap-1 border-l pl-2">
          {hasCategories
            ? item.submenu!.map((subItem) => (
                <CategoryGroup
                  key={subItem.name}
                  category={subItem.name}
                  items={subItem.submenu || []}
                  onNavigate={onNavigate}
                />
              ))
            : item.submenu!.map((subItem) => {
                const isSubActive = isActiveLink(pathname, subItem.href);
                return (
                  <NavItem
                    key={subItem.name}
                    href={subItem.href}
                    icon={subItem.icon}
                    isActive={isSubActive}
                    onClick={onNavigate}
                  >
                    {t(subItem.name)}
                  </NavItem>
                );
              })}
        </ul>
      )}
    </li>
  );
}

type CategoryGroupProps = {
  category: TranslationKey | null;
  items: NavigationItem[];
  onNavigate?: () => void;
};

export function CategoryGroup({
  category,
  items,
  onNavigate,
}: CategoryGroupProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const [expansionState] = useAtom(navigationExpansionAtom);
  const toggleExpansion = useSetAtom(toggleExpansionAtom);

  const categoryKey = category || "uncategorized";
  const isExpanded = expansionState[categoryKey] ?? false;

  if (!category) {
    return (
      <>
        {items.map((item) => {
          const isActive = isActiveLink(pathname, item.href);
          return (
            <NavItem
              key={item.name}
              href={item.href}
              icon={item.icon}
              isActive={isActive}
              onClick={onNavigate}
            >
              {t(item.name)}
            </NavItem>
          );
        })}
      </>
    );
  }

  return (
    <li className="flex flex-col">
      <button
        type="button"
        onClick={() => toggleExpansion(categoryKey)}
        className="text-muted-foreground hover:text-foreground flex items-center justify-between px-2 py-1.5 text-xs font-semibold uppercase transition-colors"
      >
        <span>{t(category)}</span>
        <ChevronRight
          className={cn(
            "size-3 transition-transform duration-200",
            isExpanded && "rotate-90",
          )}
        />
      </button>
      {isExpanded && (
        <ul className="flex flex-col gap-1 pl-2">
          {items.map((item) => {
            const isActive = isActiveLink(pathname, item.href);
            return (
              <NavItem
                key={item.name}
                href={item.href}
                icon={item.icon}
                isActive={isActive}
                onClick={onNavigate}
              >
                {t(item.name)}
              </NavItem>
            );
          })}
        </ul>
      )}
    </li>
  );
}

type NavListProps = {
  items: NavigationItem[];
  onNavigate?: () => void;
  className?: string;
};

export function NavList({ items, onNavigate, className }: NavListProps) {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col gap-1", className)}>
      {items.map((item) => {
        const hasSubmenu = item.submenu && item.submenu.length > 0;

        if (hasSubmenu) {
          const hasCategories = item.name === RESOURCES_NAV_KEY;
          return (
            <CollapsibleNavItem
              key={item.name}
              item={item}
              hasCategories={hasCategories}
              onNavigate={onNavigate}
            />
          );
        }

        const isActive = isActiveLink(pathname, item.href);
        return (
          <NavItem
            key={item.name}
            href={item.href}
            icon={item.icon}
            isActive={isActive}
            onClick={onNavigate}
          >
            {t(item.name)}
          </NavItem>
        );
      })}
    </nav>
  );
}
