
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "../providers";
import { apiFetch } from "../../lib/api";

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function EventSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="h-52 animate-pulse bg-surface-secondary" />
      <div className="space-y-4 p-5">
        <div className="h-4 w-1/3 animate-pulse rounded bg-surface-secondary" />
        <div className="h-6 w-3/4 animate-pulse rounded bg-surface-secondary" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-surface-secondary" />
        <div className="h-10 animate-pulse rounded-full bg-surface-secondary" />
      </div>
    </div>
  );
}

export default function JoinedEventsPage() {
  const router = useRouter();
  const { data: session, isPending } = useAuth();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/login");
      return;
    }

    const controller = new AbortController();

    const fetchJoinedEvents = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await apiFetch("/api/events/joined", {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load joined events");
        }

        setEvents(data.events || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(true);
          toast.error(err.message || "Unable to load joined events.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchJoinedEvents();

    return () => controller.abort();
  }, [session?.user?.id, isPending, router]);

  const handleLeaveEvent = async () => {
    if (!selectedEvent || leaving) return;

    try {
      setLeaving(true);

      const response = await apiFetch(
        `/api/events/${selectedEvent._id}/leave`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to leave event");
      }

      setEvents((currentEvents) =>
        currentEvents.filter(
          (event) => event._id !== selectedEvent._id
        )
      );

      setSelectedEvent(null);
      toast.success(data.message || "You have left the event.");
    } catch (err) {
      toast.error(err.message || "Unable to leave this event.");
    } finally {
      setLeaving(false);
    }
  };

  if (isPending || loading || !session?.user) {
    return (
      <main className="min-h-screen bg-background px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 h-9 w-64 animate-pulse rounded bg-surface-secondary" />
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <EventSkeleton key={item} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-5 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">
            Your Participation
          </p>

          <h1 className="mt-3 text-3xl font-extrabold text-foreground sm:text-4xl">
            Joined Events
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-muted">
            Keep track of the community events you have joined and get ready
            to make a difference.
          </p>
        </div>

        {error ? (
          <div className="rounded-2xl border border-border bg-surface px-6 py-16 text-center">
            <h2 className="text-xl font-bold text-foreground">
              Unable to load events
            </h2>

            <p className="mt-3 text-muted">
              Something went wrong while loading your joined events.
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-full bg-primary px-6 py-3 font-bold text-white transition hover:bg-primary-hover"
            >
              Try Again
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-3xl border border-border bg-surface px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-3xl">
              ♡
            </div>

            <h2 className="mt-6 text-2xl font-extrabold text-foreground">
              No Joined Events Yet
            </h2>

            <p className="mx-auto mt-3 max-w-md leading-7 text-muted">
              You haven't joined any events yet. Explore upcoming community
              events and find a cause you care about.
            </p>

            <Link
              href="/events"
              className="mt-7 inline-flex rounded-full bg-primary px-7 py-3 font-bold !text-white transition hover:bg-primary-hover"
            >
              Explore Events
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm font-semibold text-muted">
                {events.length} {events.length === 1 ? "Event" : "Events"} Joined
              </p>

              <Link
                href="/events"
                className="text-sm font-bold text-primary hover:underline"
              >
                Explore More Events →
              </Link>
            </div>

            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <article
                  key={event._id}
                  className="group overflow-hidden rounded-2xl border border-border bg-surface transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-52 overflow-hidden bg-surface-secondary">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <span className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-xs font-bold text-primary shadow">
                      {event.type}
                    </span>
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-primary">
                      {formatDate(event.date)}
                    </p>

                    <h2 className="mt-3 line-clamp-2 text-xl font-extrabold text-foreground">
                      {event.title}
                    </h2>

                    <p className="mt-3 flex items-center gap-2 text-sm text-muted">
                      <span aria-hidden="true">📍</span>
                      <span className="line-clamp-1">{event.location}</span>
                    </p>

                    <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-green-600">
                          ✓ Joined
                        </span>

                        <Link
                          href={`/events/${event._id}`}
                          className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-hover"
                        >
                          View Details
                        </Link>
                      </div>

                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="w-full rounded-full border border-red-200 px-5 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
                      >
                        Leave Event
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Leave Event Confirmation Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-5 py-8 backdrop-blur-sm"
          onClick={() => !leaving && setSelectedEvent(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="leave-event-title"
            className="w-full max-w-md rounded-3xl bg-surface p-7 shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl text-red-600">
              !
            </div>

            <h2
              id="leave-event-title"
              className="mt-5 text-center text-2xl font-extrabold text-foreground"
            >
              Leave This Event?
            </h2>

            <p className="mt-3 text-center leading-7 text-muted">
              Are you sure you want to leave{" "}
              <span className="font-bold text-foreground">
                {selectedEvent.title}
              </span>
              ? You can join again later if the event is still available.
            </p>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                onClick={() => setSelectedEvent(null)}
                disabled={leaving}
                className="flex-1 rounded-full border border-border px-5 py-3 font-bold text-foreground transition hover:bg-surface-secondary disabled:opacity-50"
              >
                Keep Joined
              </button>

              <button
                onClick={handleLeaveEvent}
                disabled={leaving}
                className="flex-1 rounded-full bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {leaving ? "Leaving..." : "Yes, Leave"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
