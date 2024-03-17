import { Component } from "solid-js";
import { UnstyledLink, UnstyledLinkProps } from "./UnstyledLink";

export const UnderlineLink: Component<UnstyledLinkProps> = ({
  children,
  href,
  ref,
  aProps,
  className,
}) => {
  return (
    <UnstyledLink
      ref={ref}
      {...aProps}
      href={href}
      className={`animated-underline custom-link border-dark inline-flex items-center border-b border-dotted font-semibold hover:border-black/0 
      focus:outline-none focus-visible:rounded focus-visible:ring focus-visible:ring-red-500 focus-visible:ring-offset-2 ${className}`}
    >
      {children}
    </UnstyledLink>
  );
};
