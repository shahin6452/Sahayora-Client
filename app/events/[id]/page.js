
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "../../providers";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function formatEventDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function EventDetailsPage() {
  const params = useParams();
  const { data: session, isPending } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [joining, setJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    if (!params.id) return;

    const controller = new AbortController();

    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(
          `${API_URL}/api/events/${params.id}`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Event not found");
        }

        const data = await response.json();
        setEvent(data.event);
        if (session?.user) {
          const statusResponse = await fetch(
            `${API_URL}/api/events/${params.id}/join-status`,
            {
              signal: controller.signal,
              credentials: "include",
              cache: "no-store",
            }
          );

          if (statusResponse.ok) {
            const statusData = await statusResponse.json();
            setHasJoined(statusData.hasJoined);
          }
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchEvent();

    return () => controller.abort();
  }, [params.id, session?.user?.id]);

  const handleJoinEvent = async () => {
    if (!session?.user) {
      toast.error("Please login to join this event.");
      return;
    }

    try {
      setJoining(true);

      const response = await fetch(
        `${API_URL}/api/events/${params.id}/join`,
        {
          method: "POST",
          credentials: "include",
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
      toast.success(data.message || "Successfully joined the event!");
    } catch (err) {
      toast.error(err.message || "Unable to join this event.");
    } finally {
      setJoining(false);
    }
  };

  if (loading || isPending) {
    return (
      <main className="min-h-screen bg-background px-5 py-20">
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="h-72 rounded-3xl bg-surface-secondary" />
          <div className="mt-8 h-8 w-2/3 rounded bg-surface-secondary" />
          <div className="mt-4 h-4 w-1/2 rounded bg-surface-secondary" />
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
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">

        <Link
          href="/events"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-primary hover:gap-3"
        >
          ← Back to Events
        </Link>

        <div className="overflow-hidden rounded-3xl border border-border bg-surface">

          {/* Event Image */}
          <div className="relative h-[220px] w-full overflow-hidden bg-surface-secondary sm:h-[280px] lg:h-[320px]">
            <img
              src={event.image}
              alt={event.title}
              className="absolute inset-0 block h-full w-full object-cover"
            />

            <span className="absolute left-5 top-5 z-10 rounded-full bg-white px-5 py-2 text-sm font-bold text-primary shadow">
              {event.type}
            </span>
          </div>

          {/* Event Content */}
          <div className="grid grid-cols-1 gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10 lg:p-10">

            {/* Event Information */}
            <div className="min-w-0">

              <p className="text-sm font-bold uppercase tracking-wider text-primary">
                {formatEventDate(event.date)}
              </p>

              <h1 className="mt-4 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">
                {event.title}
              </h1>

              <div className="mt-6 flex items-center gap-3 text-muted">
                <span className="text-xl" aria-hidden="true">📍</span>
                <span>{event.location}</span>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-bold text-foreground">
                  About This Event
                </h2>

                <p className="mt-4 whitespace-pre-line text-base leading-8 text-muted">
                  {event.description}
                </p>
              </div>
            </div>

            {/* Join Event Card */}
            <aside className="h-fit w-full self-start rounded-2xl bg-surface-secondary p-6">

              <h2 className="text-lg font-bold text-foreground">
                Interested in joining?
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted">
                Be part of this initiative and help make a positive difference
                in your community.
              </p>

              {session?.user ? (
                <button
                  onClick={handleJoinEvent}
                  disabled={joining || hasJoined}
                  className="mt-6 w-full rounded-full bg-primary px-5 py-3 font-bold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {joining
                    ? "Please wait..."
                    : hasJoined
                      ? "Already Joined"
                      : "Join Event"}
                </button>
              ) : (
                <Link
                  href="/login"
                  className="mt-6 block w-full rounded-full bg-primary px-5 py-3 text-center font-bold text-white transition hover:bg-primary-hover"
                >
                  Login to Join
                </Link>
              )}
            </aside>

          </div>
        </div>
      </section>
    </main>
  );
}
