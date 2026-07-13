import {revalidateTag} from 'next/cache';
import {type NextRequest, NextResponse} from 'next/server';

import {SANITY_CACHE_TAG} from '@/lib/sanity.client';

// Configure a Sanity webhook (GROQ webhook) to POST here on document changes:
//   URL:    https://<your-domain>/api/revalidate?secret=<REVALIDATE_SECRET>
// This clears the Sanity cache tag so the next request regenerates the page,
// keeping ISR writes tied to actual content changes rather than a timer.
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({revalidated: false, message: 'Invalid secret'}, {status: 401});
  }

  revalidateTag(SANITY_CACHE_TAG);

  return NextResponse.json({revalidated: true, now: Date.now()});
}
