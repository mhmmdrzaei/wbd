'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect, useState} from 'react';

type NavLink = {
  href: string;
  label: string;
};

type Props = {
  links: NavLink[];
};

export function NavMenu({links}: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <nav className="site-nav">
      <button
        type="button"
        className={open ? 'nav-toggle nav-toggle--open' : 'nav-toggle'}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="nav-toggle-bar" />
        <span className="nav-toggle-bar" />
        <span className="nav-toggle-bar" />
      </button>

      {open ? (
        <button
          type="button"
          className="nav-backdrop"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <ul className={open ? 'nav-list nav-list--open' : 'nav-list'}>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
