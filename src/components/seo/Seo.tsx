import { Head, Link, Meta, Title, useLocation } from 'solid-start';
import { openGraph } from '../../utils/helper';

export const defaultMeta = {
  title: 'Official Coding Discord Website',
  siteName: 'Official Coding Discord Website',
  description:
    'Official discord.gg/coding Website for the Coding Discord Server',
  url: 'https://coding.global',
  type: 'website',
  robots: 'follow, index',
  image: '',
};

type SeoProps = {
  date?: string;
  templateTitle?: string;
} & Partial<typeof defaultMeta>;
type Favicons = {
  rel: string;
  href: string;
  sizes?: string;
  type?: string;
};

export default function Seo(props: SeoProps) {
  const location = useLocation();
  const meta = {
    ...defaultMeta,
    ...props,
  };
  meta['title'] = props.templateTitle
    ? `${props.templateTitle} | ${meta.siteName}`
    : meta.title;

  // // Use siteName if there is templateTitle
  // // but show full title if there is none
  meta['image'] = openGraph({
    description: meta.description,
    siteName: props.templateTitle ? meta.siteName : meta.title,
    templateTitle: props.templateTitle,
  });

  return (
    <Head>
      <Title>{meta.title}</Title>
      <Meta name='robots' content={meta.robots} />
      <Meta
        name='viewport'
        content='width=device-width, initial-scale=1.0'
      ></Meta>
      <Meta content={meta.description} name='description' />
      <Meta property='og:url' content={`${meta.url}${location.pathname}`} />
      <Link rel='canonical' href={`${meta.url}${location.pathname}`} />
      {/* Open Graph */}
      <Meta property='og:type' content={meta.type} />
      <Meta property='og:site_name' content={meta.siteName} />
      <Meta property='og:description' content={meta.description} />
      <Meta property='og:title' content={meta.title} />
      <Meta name='image' property='og:image' content={meta.image} />
      {/* Twitter */}
      <Meta name='twitter:card' content='summary_large_image' />
      <Meta name='twitter:site' content='@th_clarence' />
      <Meta name='twitter:title' content={meta.title} />
      <Meta name='twitter:description' content={meta.description} />
      <Meta name='twitter:image' content={meta.image} />
      {meta.date && (
        <>
          <Meta property='article:published_time' content={meta.date} />
          <Meta
            name='publish_date'
            property='og:publish_date'
            content={meta.date}
          />
          <Meta
            name='author'
            property='article:author'
            content='Theodorus Clarence'
          />
        </>
      )}

      {/* Favicons */}
      {favicons.map((linkProps) => (
        <Link {...linkProps} />
      ))}
      <Meta name='msapplication-TileColor' content='#ffffff' />
      <Meta
        name='msapplication-TileImage'
        content='/favicon/ms-icon-144x144.png'
      />
      <Meta name='theme-color' content='#ffffff' />
    </Head>
  );
}

const favicons: Array<Favicons> = [
  {
    rel: 'apple-touch-icon',
    sizes: '57x57',
    href: '/favicon/apple-icon-57x57.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '60x60',
    href: '/favicon/apple-icon-60x60.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '72x72',
    href: '/favicon/apple-icon-72x72.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '76x76',
    href: '/favicon/apple-icon-76x76.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '114x114',
    href: '/favicon/apple-icon-114x114.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '120x120',
    href: '/favicon/apple-icon-120x120.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '144x144',
    href: '/favicon/apple-icon-144x144.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '152x152',
    href: '/favicon/apple-icon-152x152.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '180x180',
    href: '/favicon/apple-icon-180x180.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '192x192',
    href: '/favicon/android-icon-192x192.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '32x32',
    href: '/favicon/favicon-32x32.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '96x96',
    href: '/favicon/favicon-96x96.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: '/favicon/favicon-16x16.png',
  },
  {
    rel: 'manifest',
    href: '/favicon/manifest.json',
  },
];
