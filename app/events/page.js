
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const categories = [
  "All",
  "Donation",
  "Cleanup",
  "Plantation",
  "Winter Relief",
  "Food Drive",
  "Health Camp",
  "Education",
];

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
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesCategory =
        activeCategory === "All" ||
        event.type?.toLowerCase() === activeCategory.toLowerCase();

      const query = searchQuery.trim().toLowerCase();

      const matchesSearch =
        !query ||
        event.title?.toLowerCase().includes(query) ||
        event.location?.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [events, activeCategory, searchQuery]);

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">

        {/* Page Heading */}
        <div className="mb-9 flex flex-col gap-6 border-b border-border pb-9 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-light px-3 py-1.5 text-xs font-bold text-primary">
              <span>▣</span>
              Future Community Drives
            </div>

            <h1 className="font-[var(--font-manrope)] text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Upcoming Events
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base">
              Discover verified volunteer initiatives scheduled for upcoming
              dates. Past events are automatically excluded so you can focus
              on active drives that need support.
            </p>
          </div>

          <Link
            href="/create-event"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold !text-white shadow-sm transition hover:bg-primary-hover hover:-translate-y-0.5"
          >
            <span className="text-lg leading-none">⊕</span>
            Create Event
          </Link>
        </div>

        {/* Category Filter & Search */}
        <div className="mb-9 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition sm:text-sm ${
                  activeCategory === category
                    ? "bg-primary text-white shadow-sm"
                    : "border border-border bg-surface text-muted hover:border-primary hover:text-primary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full lg:max-w-[280px]">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </span>

            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events or areas..."
              aria-label="Search events or areas"
              className="w-full rounded-xl border border-border bg-surface py-3 pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
        </div>

        {/* Loading */}
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
          /* Error State */
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
        ) : (
          <>
            {/* Event Count */}
            <p className="mb-6 text-sm font-medium text-muted">
              {filteredEvents.length} upcoming{" "}
              {filteredEvents.length === 1 ? "event" : "events"}
              {activeCategory !== "All" && ` in ${activeCategory}`}
            </p>

            {filteredEvents.length === 0 ? (
              /* Empty / No Search Results */
              <div className="rounded-2xl border border-border bg-surface px-6 py-16 text-center">
                <div className="mb-4 text-4xl">🔎</div>

                <h2 className="text-xl font-bold text-foreground">
                  {events.length === 0
                    ? "No Upcoming Events"
                    : "No Events Found"}
                </h2>

                <p className="mt-2 text-muted">
                  {events.length === 0
                    ? "There are no upcoming events at the moment. Check back soon!"
                    : "Try another search term or select a different category."}
                </p>

                {(activeCategory !== "All" || searchQuery) && (
                  <button
                    onClick={() => {
                      setActiveCategory("All");
                      setSearchQuery("");
                    }}
                    className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-hover"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              /* Event Cards */
              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map((event) => (
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
                        <span className="line-clamp-1">
                          {event.location}
                        </span>
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
            )}
          </>
        )}
      </section>
    </main>
  );
}
