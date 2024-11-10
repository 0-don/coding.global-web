import { Link, Meta, Title } from "@solidjs/meta";
import { JSX } from "solid-js";
import { clientEnv } from "~/utils/env/client";

interface MetaHeadProps {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
  children?: JSX.Element;
}

export function MetaHead(props: MetaHeadProps) {
  // Default logo path
  const defaultLogoPath = "/images/logo_512.gif";

  return (
    <>
      {/* Basic Meta Tags */}
      <Title>{props.title}</Title>
      <Meta name="description" content={props.description} />
      {props.keywords && <Meta name="keywords" content={props.keywords} />}

      {/* Favicon */}
      <Link rel="icon" href="/favicon.ico" />

      {/* Logo/Image related meta tags */}
      <Link
        rel="image_src"
        href={`${clientEnv.HOST_URL}${props.ogImage || defaultLogoPath}`}
      />

      {/* Open Graph Tags */}
      <Meta property="og:title" content={props.ogTitle || props.title} />
      <Meta
        property="og:description"
        content={props.ogDescription || props.description}
      />
      <Meta
        property="og:image"
        content={`${clientEnv.HOST_URL}${props.ogImage || defaultLogoPath}`}
      />
      <Meta property="og:image:type" content="image/gif" />
      <Meta property="og:type" content="website" />
      <Meta property="og:url" content={clientEnv.HOST_URL} />

      {/* Twitter Card Tags */}
      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:title" content={props.ogTitle || props.title} />
      <Meta
        name="twitter:description"
        content={props.ogDescription || props.description}
      />
      <Meta
        name="twitter:image"
        content={`${clientEnv.HOST_URL}${props.ogImage || defaultLogoPath}`}
      />

      {/* Canonical URL */}
      {props.canonical && (
        <Link
          rel="canonical"
          href={`${clientEnv.HOST_URL}${props.canonical}`}
        />
      )}

      {/* Viewport */}
      <Meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Additional Meta Tags */}
      {props.children}
    </>
  );
}
