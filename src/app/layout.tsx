import type {Metadata} from 'next';
import {Figtree} from 'next/font/google';
import localFont from 'next/font/local';
import type {ReactNode} from 'react';

import {sanityFetch} from '@/lib/sanity.client';
import {siteSettingsQuery} from '@/lib/sanity.queries';
import type {SiteSettings} from '@/lib/types';

import './globals.css';

const plasticine = localFont({
  src: './fonts/Plasticine.woff',
  variable: '--font-display',
  display: 'swap'
});

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700']
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<SiteSettings>(siteSettingsQuery);

  return {
    title: settings?.siteTitle || 'Clay + Motion Studio',
    description: 'Colorful portfolio and shop for a ceramic and animation practice.',
    icons: settings?.siteIcon?.asset?.url
      ? {
          icon: [{url: settings.siteIcon.asset.url}]
        }
      : undefined
  };
}

export default function RootLayout({children}: Readonly<{children: ReactNode}>) {
  return (
    <html lang="en" className={`${plasticine.variable} ${figtree.variable}`}>
      <body>{children}</body>
    </html>
  );
}
