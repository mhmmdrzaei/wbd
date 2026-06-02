import type {ReactNode} from 'react';

import {Nav} from '@/components/Nav';

export default function SiteLayout({children}: {children: ReactNode}) {
  return (
    <>
      <div className="bg-layer" />
      <Nav />
      <main className="page-wrap">{children}</main>
    </>
  );
}
