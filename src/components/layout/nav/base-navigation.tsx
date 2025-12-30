"use client";

import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link, usePathname } from "@/i18n/navigation";
import type { LinkHref } from "@/i18n/routing";
import type { TranslationKey } from "@/lib/config/constants";
import { cn } from "@/lib/utils";
import { navigationAtom, toggleNavigationAtom } from "@/store/navigation-store";
import { useAtom, useSetAtom } from "jotai";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Fragment, type ReactNode } from "react";
import { isActiveLink, NavigationItem } from "./navigation";

export const RESOURCES_NAV_KEY: TranslationKey = "MAIN.NAVIGATION.RESOURCES";

type NavigationItemRenderProps = {
  item: NavigationItem;
  isActive: boolean;
  onClick?: () => void;
};

type CollapsibleItemRenderProps = {
  item: NavigationItem;
  hasCategories: boolean;
  onNavigate?: () => void;
};

type NavigationItemsProps = {
  items: NavigationItem[];
  onNavigate?: () => void;
  renderItem: (props: NavigationItemRenderProps) => ReactNode;
  renderCollapsibleItem: (props: CollapsibleItemRenderProps) => ReactNode;
};

export function NavigationItems(props: NavigationItemsProps) {
  const pathname = usePathname();

  return (
    <>
      {props.items.map((item) => {
        const hasSubmenu = item.submenu && item.submenu.length > 0;

        if (hasSubmenu) {
          const hasCategories = item.name === RESOURCES_NAV_KEY;
          return (
            <Fragment key={item.name}>
              {props.renderCollapsibleItem({
                item,
                hasCategories,
                onNavigate: props.onNavigate,
              })}
            </Fragment>
          );
        }

        const isActive = isActiveLink(pathname, item.href);
        return (
          <Fragment key={item.name}>
            {props.renderItem({
              item,
              isActive,
              onClick: props.onNavigate,
            })}
          </Fragment>
        );
      })}
    </>
  );
}

export function NavItemFromData(props: {
  item: NavigationItem;
  isActive: boolean;
  onClick?: () => void;
}) {
  const t = useTranslations();
  return (
    <li className="list-none">
      <Link
        href={props.item.href}
        onClick={props.onClick}
        className={cn(
          "hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          props.isActive && "bg-primary/10 text-primary",
        )}
      >
        {props.item.icon && (
          <props.item.icon
            className={cn("size-4", props.isActive && "text-primary")}
          />
        )}
        <span>{t(props.item.name)}</span>
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

export function CollapsibleNavItem(props: CollapsibleNavItemProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const [navigationState] = useAtom(navigationAtom);
  const toggleNavigation = useSetAtom(toggleNavigationAtom);

  const isActive = isActiveLink(pathname, props.item.href);
  const hasSubmenu = props.item.submenu && props.item.submenu.length > 0;
  const isExpanded = navigationState[props.item.name] ?? false;
  const toggle = () => toggleNavigation(props.item.name);

  return (
    <li className={cn("list-none", props.className)}>
      <div className="flex items-center">
        <Link
          href={props.item.href}
          onClick={props.onNavigate}
          className={cn(
            "hover:bg-accent hover:text-accent-foreground flex flex-1 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            isActive && "bg-primary/10 text-primary",
          )}
        >
          <props.item.icon
            className={cn("size-4", isActive && "text-primary")}
          />
          <span>{t(props.item.name)}</span>
        </Link>
        {hasSubmenu && (
          <button
            type="button"
            onClick={toggle}
            className={cn(
              "flex items-center justify-center rounded-md transition-colors",
              "hover:bg-accent size-8",
            )}
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
          {props.hasCategories
            ? props.item.submenu!.map((subItem) => (
                <CategoryGroup
                  key={subItem.name}
                  category={subItem.name}
                  items={subItem.submenu || []}
                  onNavigate={props.onNavigate}
                />
              ))
            : props.item.submenu!.map((subItem) => {
                const isSubActive = isActiveLink(pathname, subItem.href);
                return (
                  <NavItemFromData
                    key={subItem.name}
                    item={subItem}
                    isActive={isSubActive}
                    onClick={props.onNavigate}
                  />
                );
              })}
        </ul>
      )}
    </li>
  );
}

type CategoryGroupProps = {
  category: TranslationKey;
  items: NavigationItem[];
  onNavigate?: () => void;
};

export function CategoryGroup(props: CategoryGroupProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const [navigationState] = useAtom(navigationAtom);
  const toggleNavigation = useSetAtom(toggleNavigationAtom);

  const isExpanded = navigationState[props.category] ?? false;
  const toggle = () => toggleNavigation(props.category);

  if (!props.category) {
    return (
      <>
        {props.items.map((item) => {
          const isActive = isActiveLink(pathname, item.href);
          return (
            <NavItemFromData
              key={item.name}
              item={item}
              isActive={isActive}
              onClick={props.onNavigate}
            />
          );
        })}
      </>
    );
  }

  return (
    <li className="flex flex-col">
      <button
        type="button"
        onClick={toggle}
        className="text-muted-foreground hover:text-foreground flex items-center justify-between px-2 py-1.5 text-xs font-semibold uppercase transition-colors"
      >
        <span>{t(props.category)}</span>
        <ChevronRight
          className={cn(
            "size-3 transition-transform duration-200",
            isExpanded && "rotate-90",
          )}
        />
      </button>
      {isExpanded && (
        <ul className="flex flex-col gap-1 pl-2">
          {props.items.map((item) => {
            const isActive = isActiveLink(pathname, item.href);
            return (
              <NavItemFromData
                key={item.name}
                item={item}
                isActive={isActive}
                onClick={props.onNavigate}
              />
            );
          })}
        </ul>
      )}
    </li>
  );
}

export function SidebarNavItem(props: {
  item: NavigationItem;
  isActive: boolean;
  onClick?: () => void;
}) {
  const t = useTranslations();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={t(props.item.name)}
        isActive={props.isActive}
        className={cn(
          props.isActive && "bg-primary/10 text-primary font-medium",
        )}
      >
        <Link
          href={props.item.href as LinkHref}
          onClick={props.onClick}
          className="flex items-center gap-2"
        >
          <props.item.icon className={cn(props.isActive && "text-primary")} />
          <span>{t(props.item.name)}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function SidebarCategoryGroup(props: {
  category: TranslationKey;
  items: NavigationItem[];
  onNavigate?: () => void;
}) {
  const t = useTranslations();
  const pathname = usePathname();
  const [navigationState] = useAtom(navigationAtom);
  const toggleNavigation = useSetAtom(toggleNavigationAtom);

  const isExpanded = navigationState[props.category] ?? false;
  const toggle = () => toggleNavigation(props.category);

  if (!props.category) {
    return (
      <>
        {props.items.map((item) => {
          const isActive = isActiveLink(pathname, item.href);
          return (
            <SidebarMenuSubItem key={item.name}>
              <SidebarMenuSubButton
                isActive={isActive}
                className={cn(
                  isActive && "bg-primary/10 text-primary font-medium",
                )}
                render={
                  <Link
                    href={item.href as LinkHref}
                    onClick={props.onNavigate}
                    className="flex items-center gap-2"
                  >
                    <item.icon
                      className={cn("size-4", isActive && "text-primary")}
                    />
                    <span>{t(item.name)}</span>
                  </Link>
                }
              />
            </SidebarMenuSubItem>
          );
        })}
      </>
    );
  }

  return (
    <li className="flex flex-col">
      <button
        type="button"
        onClick={toggle}
        className="text-muted-foreground hover:text-foreground flex items-center justify-between px-2 py-1.5 text-xs font-semibold uppercase transition-colors"
      >
        <span>{t(props.category)}</span>
        <ChevronRight
          className={cn(
            "size-3 transition-transform duration-200",
            isExpanded && "rotate-90",
          )}
        />
      </button>
      {isExpanded && (
        <ul className="flex flex-col gap-1 pl-2">
          {props.items.map((item) => {
            const isActive = isActiveLink(pathname, item.href);
            return (
              <SidebarMenuSubItem key={item.name}>
                <SidebarMenuSubButton
                  isActive={isActive}
                  className={cn(
                    isActive && "bg-primary/10 text-primary font-medium",
                  )}
                  render={
                    <Link
                      href={item.href as LinkHref}
                      onClick={props.onNavigate}
                      className="flex items-center gap-2"
                    >
                      <item.icon
                        className={cn("size-4", isActive && "text-primary")}
                      />
                      <span>{t(item.name)}</span>
                    </Link>
                  }
                />
              </SidebarMenuSubItem>
            );
          })}
        </ul>
      )}
    </li>
  );
}

export function SidebarCollapsibleItem(props: {
  item: NavigationItem;
  hasCategories?: boolean;
  onNavigate?: () => void;
}) {
  const t = useTranslations();
  const pathname = usePathname();
  const [navigationState] = useAtom(navigationAtom);
  const toggleNavigation = useSetAtom(toggleNavigationAtom);

  const isActive = isActiveLink(pathname, props.item.href);
  const hasSubmenu = props.item.submenu && props.item.submenu.length > 0;
  const isExpanded = navigationState[props.item.name] ?? false;
  const toggle = () => toggleNavigation(props.item.name);

  return (
    <SidebarMenuItem>
      <div className="flex items-center">
        <SidebarMenuButton
          tooltip={t(props.item.name)}
          isActive={isActive}
          className={cn(
            "flex-1",
            isActive && "bg-primary/10 text-primary font-medium",
          )}
        >
          <Link
            href={props.item.href as LinkHref}
            onClick={props.onNavigate}
            className="flex flex-1 items-center gap-2"
          >
            <props.item.icon
              className={cn("size-4", isActive && "text-primary")}
            />
            <span>{t(props.item.name)}</span>
          </Link>
        </SidebarMenuButton>
        {hasSubmenu && (
          <button
            type="button"
            onClick={toggle}
            className={cn(
              "flex items-center justify-center rounded-md transition-colors",
              "hover:bg-sidebar-accent size-8",
            )}
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
        <SidebarMenuSub>
          {props.hasCategories
            ? props.item.submenu!.map((subItem) => (
                <SidebarCategoryGroup
                  key={subItem.name}
                  category={subItem.name}
                  items={subItem.submenu || []}
                  onNavigate={props.onNavigate}
                />
              ))
            : props.item.submenu!.map((subItem) => {
                const isSubActive = isActiveLink(pathname, subItem.href);
                return (
                  <SidebarMenuSubItem key={subItem.name}>
                    <SidebarMenuSubButton
                      isActive={isSubActive}
                      className={cn(
                        isSubActive && "bg-primary/10 text-primary font-medium",
                      )}
                      render={
                        <Link
                          href={subItem.href as LinkHref}
                          onClick={props.onNavigate}
                          className="flex items-center gap-2"
                        >
                          <subItem.icon
                            className={cn(
                              "size-4",
                              isSubActive && "text-primary",
                            )}
                          />
                          <span>{t(subItem.name)}</span>
                        </Link>
                      }
                    />
                  </SidebarMenuSubItem>
                );
              })}
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  );
}
