import Image from 'next/image';
import Link from 'next/link';

import {sanityFetch} from '@/lib/sanity.client';
import {siteSettingsQuery} from '@/lib/sanity.queries';
import type {SiteSettings} from '@/lib/types';

const defaultLinks = [
  {href: '/', label: 'Home'},
  {href: '/shop', label: 'Shop'},
  {href: '/events', label: 'Events'},
  {href: '/about', label: 'About'},
  {href: '/studio', label: 'Studio'}
];

export async function Nav() {
  const settings = await sanityFetch<SiteSettings>(siteSettingsQuery);
  const links = settings?.menuItems?.length ? settings.menuItems : defaultLinks;

  return (
    <header className="site-header">
      <Link href="/" className="brand">
        {settings?.siteIcon?.asset?.url ? (
          <Image
            src={settings.siteIcon.asset.url}
            alt=""
            width={settings.siteIcon.asset.metadata?.dimensions?.width || 64}
            height={settings.siteIcon.asset.metadata?.dimensions?.height || 64}
            className="brand-icon"
          />
        ) : (
          <span className="brand-dot" />
        )}
        {settings?.siteTitle || 'Clay + Motion'}
      </Link>
      <nav>
        <ul className="nav-list">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
