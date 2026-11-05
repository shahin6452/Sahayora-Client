"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "../../providers";
import { apiFetch } from "../../../lib/api";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function formatEventDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function Avatar({ src, name, size = "h-11 w-11" }) {
  const fallback = `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(
    name || "Sahayora"
  )}`;

  return (
    <img
      src={src || fallback}
      alt={`${name || "User"} avatar`}
      className={`${size} shrink-0 rounded-full border border-border bg-surface-secondary object-cover`}
    />
  );
}

export default function EventDetailsClient({ eventId }) {
  const { data: session, isPending } = useAuth();

  const [event, setEvent] = useState(null);
  const [organizer, setOrganizer] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [volunteerCount, setVolunteerCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [joining, setJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  const user = session?.user;

  const fetchEvent = useCallback(
    async (signal) => {
      try {
        setLoading(true);
        setError(false);

        // Public Event Details API
        const response = await fetch(
          `${API_URL}/api/events/${eventId}`,
          {
            signal,
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Event not found");
        }

        const data = await response.json();

        setEvent(data.event);
        setOrganizer(data.organizer || null);
        setVolunteers(data.volunteers || []);
        setVolunteerCount(data.volunteerCount || 0);

        // Protected Join Status API
        if (user) {
          const statusResponse = await apiFetch(
            `/api/events/${eventId}/join-status`,
            {
              signal,
              cache: "no-store",
            }
          );

          if (!statusResponse.ok) {
            const statusData = await statusResponse.json();
            throw new Error(
              statusData.message || "Failed to check join status"
            );
          }

          const statusData = await statusResponse.json();
          setHasJoined(statusData.hasJoined);
        } else {
          setHasJoined(false);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(true);

          if (user) {
            toast.error(err.message || "Unable to load event details.");
          }
        }
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [eventId, user?.id]
  );

  useEffect(() => {
    if (!eventId || isPending) return;

    const controller = new AbortController();

    fetchEvent(controller.signal);

    return () => controller.abort();
  }, [eventId, isPending, fetchEvent]);

  const handleJoinEvent = async () => {
    if (!user) {
      toast.error("Please login to join this event.");
      return;
    }

    try {
      setJoining(true);

      const response = await apiFetch(
        `/api/events/${eventId}/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setHasJoined(true);
        }

        throw new Error(data.message || "Failed to join event");
      }

      setHasJoined(true);

      // Refresh volunteer list and count
      const detailsResponse = await fetch(
        `${API_URL}/api/events/${eventId}`,
        { cache: "no-store" }
      );

      if (detailsResponse.ok) {
        const details = await detailsResponse.json();
        setVolunteers(details.volunteers || []);
        setVolunteerCount(details.volunteerCount || 0);
      }

      toast.success(data.message || "Successfully joined the event!");
    } catch (err) {
      toast.error(err.message || "Unable to join this event.");
    } finally {
      setJoining(false);
    }
  };

  const handleLeaveEvent = async () => {
    try {
      setJoining(true);

      const response = await apiFetch(
        `/api/events/${eventId}/leave`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to leave event");
      }

      setHasJoined(false);

      // Refresh volunteer list and count
      const detailsResponse = await fetch(
        `${API_URL}/api/events/${eventId}`,
        { cache: "no-store" }
      );

      if (detailsResponse.ok) {
        const details = await detailsResponse.json();
        setVolunteers(details.volunteers || []);
        setVolunteerCount(details.volunteerCount || 0);
      }

      toast.success(data.message || "You have left this event.");
    } catch (err) {
      toast.error(err.message || "Unable to leave this event.");
    } finally {
      setJoining(false);
    }
  };

  const handleJoinAction = () => {
    if (hasJoined) {
      handleLeaveEvent();
    } else {
      handleJoinEvent();
    }
  };

  if (loading || isPending) {
    return (
      <main className="min-h-screen bg-background px-5 py-20">
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="h-72 rounded-3xl bg-surface-secondary" />
          <div className="mt-8 h-8 w-2/3 rounded bg-surface-secondary" />
          <div className="mt-4 h-4 w-1/2 rounded bg-surface-secondary" />
          <div className="mt-8 h-40 rounded-2xl bg-surface-secondary" />
        </div>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-5">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-foreground">
            Event Not Found
          </h1>

          <p className="mt-3 text-muted">
            This event may have been removed or does not exist.
          </p>

          <Link
            href="/events"
            className="mt-6 inline-block rounded-full bg-primary px-6 py-3 font-bold text-white hover:bg-primary-hover"
          >
            Explore Events
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">

        {/* Back Button */}
        <Link
          href="/events"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:gap-3"
        >
          ← Back to Events
        </Link>

        <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">

          {/* Event Hero */}
          <div className="relative h-[240px] w-full overflow-hidden bg-surface-secondary sm:h-[320px]">
            <img
              src={event.image}
              alt={event.title}
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <span className="absolute left-5 top-5 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-primary shadow">
              {event.type}
            </span>

            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
              <h1 className="max-w-3xl text-2xl font-extrabold leading-tight text-white sm:text-3xl lg:text-4xl">
                {event.title}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-white/90 sm:text-sm">
                <span>📍 {event.location}</span>
                <span>▣ {formatEventDate(event.date)}</span>
              </div>
            </div>
          </div>

          {/* Volunteer Status Bar */}
          <div className="border-b border-border px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-4 rounded-2xl bg-surface-secondary p-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-xl text-primary">
                  ♧
                </div>

                <div>
                  <p className="text-sm font-bold text-foreground">
                    {volunteerCount}{" "}
                    {volunteerCount === 1 ? "Volunteer" : "Volunteers"} Joined
                  </p>

                  <p className="mt-1 text-xs text-muted">
                    {hasJoined
                      ? "You are confirmed for this initiative"
                      : "Join this initiative and make a difference"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: event.title,
                        url: window.location.href,
                      }).catch(() => {});
                    } else if (navigator.clipboard) {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Event link copied!");
                    }
                  }}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-lg text-foreground transition hover:bg-primary-light"
                  aria-label="Share event"
                  title="Share event"
                >
                  ↗
                </button>

                {user ? (
                  <button
                    type="button"
                    onClick={handleJoinAction}
                    disabled={joining}
                    className={`min-w-36 rounded-xl px-5 py-3 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                      hasJoined
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-primary hover:bg-primary-hover"
                    }`}
                  >
                    {joining
                      ? "Please wait..."
                      : hasJoined
                        ? "✓ Joined (Click to Leave)"
                        : "+ Join Event"}
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="min-w-36 rounded-xl bg-primary px-5 py-3 text-center text-sm font-bold !text-white transition hover:bg-primary-hover"
                  >
                    Login to Join
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 gap-7 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_260px]">

            {/* About Event */}
            <div className="min-w-0">
              <h2 className="text-lg font-extrabold text-foreground">
                About this Social Initiative
              </h2>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted">
                {event.description}
              </p>

              {/* Volunteer Guidelines */}
              <div className="mt-8">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-foreground">
                  Volunteer Guidelines
                </h3>

                <ul className="mt-4 space-y-3 text-sm leading-6 text-muted">
                  <li className="flex gap-2">
                    <span className="text-emerald-500">●</span>
                    Please arrive 15 minutes before the scheduled time.
                  </li>

                  <li className="flex gap-2">
                    <span className="text-emerald-500">●</span>
                    Wear comfortable clothing suitable for this initiative.
                  </li>

                  <li className="flex gap-2">
                    <span className="text-emerald-500">●</span>
                    Bring any pre-coordinated supplies or materials if requested.
                  </li>
                </ul>
              </div>
            </div>

            {/* Organizer & Volunteers */}
            <aside className="space-y-5">

              {/* Organizer Card */}
              <div className="rounded-2xl border border-border bg-surface p-5">
                <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-muted">
                  Initiative Organizer
                </h3>

                <div className="mt-4 flex min-w-0 items-center gap-3">
                  <Avatar
                    src={organizer?.image}
                    name={organizer?.name || "Organizer"}
                    size="h-12 w-12"
                  />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-foreground">
                      {organizer?.name || "Event Organizer"}
                    </p>

                    <p className="mt-1 truncate text-xs text-muted">
                      {organizer?.email || "Organizer"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-border pt-3 text-xs font-medium text-emerald-600">
                  <span>✓</span>
                  Sahayora Member
                </div>
              </div>

              {/* Confirmed Volunteers Card */}
              <div className="rounded-2xl border border-border bg-surface p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-muted">
                    Confirmed Volunteers
                  </h3>

                  <span className="rounded-full bg-primary-light px-2.5 py-1 text-xs font-bold text-primary">
                    {volunteerCount}
                  </span>
                </div>

                {volunteers.length > 0 ? (
                  <div className="mt-4 space-y-4">
                    {volunteers.map((volunteer) => (
                      <div
                        key={volunteer.id}
                        className="flex min-w-0 items-center gap-3"
                      >
                        <Avatar
                          src={volunteer.image}
                          name={volunteer.name}
                          size="h-9 w-9"
                        />

                        <p className="truncate text-sm font-medium text-foreground">
                          {volunteer.name}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm leading-6 text-muted">
                    No volunteers have joined yet. Be the first to participate!
                  </p>
                )}
              </div>

            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}   