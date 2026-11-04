
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function formatEventDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(`${API_URL}/api/events`, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();
        setEvents(data.events || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(true);
          toast.error("Unable to load events. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchEvents();

    return () => controller.abort();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="mb-12">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Make a Difference
          </p>

          <h1 className="font-[var(--font-manrope)] text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Upcoming Events
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Discover meaningful community events and find opportunities to
            make a positive impact together.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl border border-border bg-surface"
              >
                <div className="h-56 bg-surface-secondary" />
                <div className="space-y-4 p-5">
                  <div className="h-4 w-24 rounded bg-surface-secondary" />
                  <div className="h-6 w-3/4 rounded bg-surface-secondary" />
                  <div className="h-4 w-1/2 rounded bg-surface-secondary" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-border bg-surface px-6 py-16 text-center">
            <h2 className="text-xl font-bold text-foreground">
              Something went wrong
            </h2>
            <p className="mt-2 text-muted">
              We could not load events right now.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-hover"
            >
              Try Again
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface px-6 py-16 text-center">
            <h2 className="text-xl font-bold text-foreground">
              No Upcoming Events
            </h2>
            <p className="mt-2 text-muted">
              There are no upcoming events at the moment. Check back soon!
            </p>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm font-medium text-muted">
              {events.length} upcoming {events.length === 1 ? "event" : "events"}
            </p>

            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <article
                  key={event._id}
                  className="group overflow-hidden rounded-2xl border border-border bg-surface transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-56 overflow-hidden bg-surface-secondary">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-primary shadow-sm">
                      {event.type}
                    </span>
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">
                      {formatEventDate(event.date)}
                    </p>

                    <h2 className="mt-3 line-clamp-2 text-xl font-bold text-foreground">
                      {event.title}
                    </h2>

                    <p className="mt-3 flex items-center gap-2 text-sm text-muted">
                      <span aria-hidden="true">📍</span>
                      <span className="line-clamp-1">{event.location}</span>
                    </p>

                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted">
                      {event.description}
                    </p>

                    <Link
                      href={`/events/${event._id}`}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:gap-3"
                    >
                      View Event <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
