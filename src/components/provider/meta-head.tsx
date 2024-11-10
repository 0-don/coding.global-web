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
  return (
    <>
      {/* Basic Meta Tags */}
      <Title>{props.title}</Title>
      <Meta name="description" content={props.description} />
      {props.keywords && <Meta name="keywords" content={props.keywords} />}

      {/* Open Graph Tags */}
      <Meta property="og:title" content={props.ogTitle || props.title} />
      <Meta
        property="og:description"
        content={props.ogDescription || props.description}
      />
      {props.ogImage && <Meta property="og:image" content={props.ogImage} />}
      <Meta property="og:type" content="website" />

      {/* Twitter Card Tags */}
      <Meta name="twitter:card" content="summary" />
      <Meta name="twitter:title" content={props.ogTitle || props.title} />
      <Meta
        name="twitter:description"
        content={props.ogDescription || props.description}
      />

      {/* Canonical URL */}
      {props.canonical && <Link rel="canonical" href={clientEnv.HOST_URL} />}

      {/* Additional Meta Tags */}
      <Meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Allow passing additional meta tags */}
      {props.children}
    </>
  );
}
