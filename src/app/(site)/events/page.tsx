import type {Metadata} from 'next';
import Image from 'next/image';

import {sanityFetch} from '@/lib/sanity.client';
import {eventsQuery} from '@/lib/sanity.queries';
import {buildMetadata} from '@/lib/seo';
import type {EventItem} from '@/lib/types';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    fallbackTitle: 'Events | Clay + Motion Studio',
    fallbackDescription: 'Upcoming pop-ups, exhibitions, and other events.',
    path: '/events'
  });
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function EventCard({event}: {event: EventItem}) {
  const imageUrl = event.picture?.asset?.url;
  const width = event.picture?.asset?.metadata?.dimensions?.width || 1200;
  const height = event.picture?.asset?.metadata?.dimensions?.height || 900;

  return (
    <article className="event-card">
      {imageUrl ? (
        <div className="event-image-wrap">
          <Image
            src={imageUrl}
            alt={event.title}
            width={width}
            height={height}
            sizes="(max-width: 960px) 50vw, 25vw"
            className="event-image"
          />
        </div>
      ) : null}
      <div className="event-card-content">
        <h3>{event.title}</h3>
        {event.date ? <p className="event-date">{formatDate(event.date)}</p> : null}
        {event.location ? <p className="event-location">{event.location}</p> : null}
        {event.url ? (
          <a href={event.url} target="_blank" rel="noopener noreferrer" className="event-link">
            Details
          </a>
        ) : null}
      </div>
    </article>
  );
}

export default async function EventsPage() {
  const events = (await sanityFetch<EventItem[]>(eventsQuery)) || [];
  const now = Date.now();
  const upcoming = events
    .filter((event) => !event.date || new Date(event.date).getTime() >= now)
    .sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  const past = events.filter((event) => event.date && new Date(event.date).getTime() < now);

  return (
    <article>
      <h1 className="page-title">Events</h1>
      <p className="page-intro">Upcoming shows, talks, and studio happenings.</p>
      {events.length === 0 ? (
        <p className="page-intro">No events scheduled right now. Check back soon.</p>
      ) : null}

      {upcoming.length ? (
        <section className="event-grid" aria-label="Upcoming events">
          {upcoming.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </section>
      ) : null}

      {past.length ? (
        <>
          <h2 className="page-title events-past-heading">Past Events</h2>
          <section className="event-grid event-grid--past" aria-label="Past events">
            {past.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </section>
        </>
      ) : null}
    </article>
  );
}
