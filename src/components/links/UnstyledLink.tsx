import { A } from '@solidjs/router';
import { Component, ComponentProps, JSX } from 'solid-js';

export type UnstyledLinkProps = {
  href: string;
  children: JSX.Element;
  openNewTab?: boolean;
  className?: string;
  aProps?: ComponentProps<typeof A>;
  ref?: HTMLAnchorElement | ((el: HTMLAnchorElement) => void);
};

export const UnstyledLink: Component<UnstyledLinkProps> = ({
  children,
  ref,
  href,
  openNewTab,
  aProps,
  className,
  ...rest
}) => {
  const isNewTab =
    openNewTab !== undefined
      ? openNewTab
      : href && !href.startsWith('/') && !href.startsWith('#');

  if (!isNewTab) {
    return (
      <A href={href} {...aProps} class={className}>
        {children}
      </A>
    );
  }

  return (
    <a
      ref={ref}
      target='_blank'
      rel='noopener noreferrer'
      href={href}
      {...rest}
      class={className}
    >
      {children}
    </a>
  );
};
