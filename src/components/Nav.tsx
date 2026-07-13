import Image from 'next/image';
import Link from 'next/link';

import {NavMenu} from '@/components/NavMenu';
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

const brandColors = [
  '#1b1636',
  '#29294d',
  '#0d5c5c',
  '#12805a',
  '#1fc48c',
  '#8ccf6b',
  '#ffc24d',
  '#e8663a',
  '#e51a4c',
  '#a83a6d',
  '#6a1670',
  '#14309b'
];

function ColorfulBrand({text}: {text: string}) {
  let colorIndex = 0;

  return (
    <span className="brand-text" aria-label={text}>
      {Array.from(text).map((char, index) => {
        if (char === ' ') {
          return (
            <span key={index} aria-hidden="true">
              &nbsp;
            </span>
          );
        }

        const color = brandColors[colorIndex % brandColors.length];
        colorIndex += 1;

        return (
          <span key={index} aria-hidden="true" style={{color}}>
            {char}
          </span>
        );
      })}
    </span>
  );
}

export async function Nav() {
  const settings = await sanityFetch<SiteSettings>(siteSettingsQuery);
  const links = settings?.menuItems?.length ? settings.menuItems : defaultLinks;

  return (
    <header className="site-header">
      {/* Hand-drawn wobble filter for the speech bubble outline. */}
      <svg className="brand-svg-defs" aria-hidden="true" focusable="false" width="0" height="0">
        <filter id="brand-wobble">
          <feTurbulence type="fractalNoise" baseFrequency="0.017" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
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
        <span className="brand-bubble">
          <ColorfulBrand text={settings?.siteTitle || 'Clay + Motion'} />
        </span>
      </Link>
      <NavMenu links={links} />
    </header>
  );
}
