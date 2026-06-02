'use client';

import {NextStudio} from 'next-sanity/studio';
import config from '../../../../sanity.config';

export default function StudioPage() {
  return (
    <>
      <style jsx global>{`
        body {
          background: #ffffff !important;
        }
      `}</style>
      <NextStudio config={config} />
    </>
  );
}
