"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "./providers";
import { signOut } from "../lib/auth-client";
import { toast } from "sonner";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const eventColors = ["#F08A72", "#A59AF2", "#E8C96A"];

const formatEventDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "DATE TBA";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).toUpperCase();
};

const ArrowUpRight = () => (
  <span aria-hidden="true" className="text-xl leading-none">
    ↗
  </span>
);

export default function Home() {
  const { data: session } = useAuth();
  const user = session?.user;

  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  const [completedEvents, setCompletedEvents] = useState([]);
  const [completedLoading, setCompletedLoading] = useState(true);

  // Fetch Upcoming Events
  useEffect(() => {
    const controller = new AbortController();

    const loadEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/api/events?limit=6`, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Could not load upcoming events.");
        }

        const result = await response.json();
        setEvents(Array.isArray(result.events) ? result.events : []);
      } catch (error) {
        if (error.name !== "AbortError") {
          toast.error(error.message || "Failed to load upcoming events.");
          setEvents([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setEventsLoading(false);
        }
      }
    };

    loadEvents();

    return () => controller.abort();
  }, []);

  // Fetch Completed Events
  useEffect(() => {
    const controller = new AbortController();

    const loadCompletedEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/api/events/completed`, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Could not load completed events.");
        }

        const result = await response.json();
        setCompletedEvents(
          Array.isArray(result.events) ? result.events : []
        );
      } catch (error) {
        if (error.name !== "AbortError") {
          toast.error(error.message || "Failed to load completed events.");
          setCompletedEvents([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setCompletedLoading(false);
        }
      }
    };

    loadCompletedEvents();

    return () => controller.abort();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error(error.message || "Logout failed!");
    }
  };

  return (
    <main className="overflow-hidden bg-background text-foreground">

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-14 text-center sm:px-8 sm:pb-20 sm:pt-20 lg:px-10 lg:pb-24 lg:pt-24">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2">
            <span className="text-sm text-accent">✳</span>
            <span className="text-xs font-bold tracking-wide text-muted sm:text-sm">
              Community-Driven Social Development Platform
            </span>
          </div>

          <h1 className="mx-auto mt-7 max-w-5xl font-[var(--font-manrope)] text-4xl font-extrabold leading-[1.12] tracking-[-0.045em] text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Gather for Good.{" "}
            <span className="text-primary">
              Transform Your Neighborhood.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-muted sm:text-lg">
            Create, discover, and join local social service drives in your
            neighborhood. From winter clothes and blanket distribution in
            Mirpur and Mohammadpur to urban tree plantations and cleanups.
          </p>

          <div className="mt-9 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
            <Link
              href="/events"
              className="inline-flex items-center justify-center gap-3 rounded-xl bg-primary px-7 py-4 font-bold !text-white shadow-lg shadow-primary/20 transition hover:-translate-y-1 hover:bg-primary-hover"
            >
              Explore Upcoming Events <ArrowUpRight />
            </Link>

            <Link
              href={user ? "/create-event" : "/login"}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-7 py-4 font-bold text-foreground transition hover:-translate-y-1 hover:border-primary hover:text-primary"
            >
              <span className="text-primary" aria-hidden="true">
                ♡
              </span>
              Create an Event
            </Link>
          </div>

          {/* Community Statistics */}
          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-3 sm:mt-20 sm:gap-4 lg:grid-cols-4">
            {[
              {
                value: "1,450+",
                label: "Active Volunteers",
                color: "text-primary",
              },
              {
                value: "180+",
                label: "Events Completed",
                color: "text-accent",
              },
              {
                value: "24,000+",
                label: "Lives Impacted",
                color: "text-[#5146A5]",
              },
              {
                value: "100%",
                label: "Community Driven",
                color: "text-[#C18A20]",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border bg-surface px-4 py-6 shadow-sm sm:px-5 sm:py-7"
              >
                <p
                  className={`text-3xl font-extrabold tracking-tight sm:text-4xl ${stat.color}`}
                >
                  {stat.value}
                </p>
                <p className="mt-2 text-xs font-medium text-muted sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTRO STRIP */}
      <section className="bg-primary py-7 text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 text-center sm:px-8 lg:justify-between lg:px-10">
          <p className="text-sm font-bold tracking-wide sm:text-base">
            PEOPLE
          </p>
          <span className="text-2xl text-accent">✳</span>
          <p className="text-sm font-bold tracking-wide sm:text-base">
            PURPOSE
          </p>
          <span className="text-2xl text-accent">✳</span>
          <p className="text-sm font-bold tracking-wide sm:text-base">
            POSITIVE CHANGE
          </p>
          <span className="text-2xl text-accent">✳</span>
          <p className="text-sm font-bold tracking-wide sm:text-base">
            TOGETHER
          </p>
        </div>
      </section>
      {/* ABOUT */}
      <section
        id="about"
        className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10 lg:py-32"
      >
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-accent">
              WHY SAHAYORA?
            </p>

            <h2 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Good things grow when we grow{" "}
              <span className="text-primary">together.</span>
            </h2>
          </div>

          <div className="flex flex-col justify-between gap-8">
            <p className="text-lg leading-9 text-muted">
              We believe every person has something valuable to give. A little
              time, a helping hand, a donated book, or a planted tree can
              create a ripple of positive change. Sahayora brings people and
              meaningful causes together.
            </p>

            <Link
              href="/events"
              className="inline-flex w-fit items-center gap-3 border-b-2 border-primary pb-2 font-extrabold text-primary transition hover:gap-5"
            >
              Discover our community <ArrowUpRight />
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-surface-secondary py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-accent">
                SIMPLE AS THAT
              </p>

              <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
                Three steps.{" "}
                <span className="text-primary">Real impact.</span>
              </h2>
            </div>

            <p className="max-w-sm leading-7 text-muted">
              You don't need to change the whole world. Just start somewhere.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Find your cause",
                description:
                  "Explore community events and discover something that matters to you.",
                symbol: "⌕",
              },
              {
                number: "02",
                title: "Show up & join in",
                description:
                  "Join an event, meet like-minded people, and become part of the action.",
                symbol: "↗",
              },
              {
                number: "03",
                title: "Make a difference",
                description:
                  "Share your time and skills to create positive change in your community.",
                symbol: "✳",
              },
            ].map((item) => (
              <div
                key={item.number}
                className="rounded-2xl border border-border bg-surface p-8 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold tracking-widest text-accent">
                    {item.number}
                  </span>

                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-3xl text-primary">
                    {item.symbol}
                  </span>
                </div>

                <h3 className="mt-10 text-2xl font-extrabold">
                  {item.title}
                </h3>

                <p className="mt-4 leading-7 text-muted">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* UPCOMING EVENTS */}
      <section
        id="events"
        className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10 lg:py-32"
      >
        <div className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-accent">
              FIND YOUR NEXT GOOD THING
            </p>

            <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Get out there.{" "}
              <span className="text-primary">Do good.</span>
            </h2>

            <p className="mt-4 max-w-lg leading-7 text-muted">
              A few ways to get involved and make your community a better place.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex w-fit items-center gap-3 rounded-full border border-border px-6 py-3 font-bold transition hover:border-primary hover:text-primary"
          >
            View all events <ArrowUpRight />
          </Link>
        </div>

        {eventsLoading ? (
          <div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            aria-label="Loading events"
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-border bg-surface"
              >
                <div className="aspect-[1.35] animate-pulse bg-surface-secondary" />
                <div className="space-y-4 p-7">
                  <div className="h-3 w-1/2 animate-pulse rounded bg-surface-secondary" />
                  <div className="h-6 w-4/5 animate-pulse rounded bg-surface-secondary" />
                  <div className="h-16 animate-pulse rounded bg-surface-secondary" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-14 text-center">
            <p className="text-xl font-extrabold">
              No upcoming events yet
            </p>

            <p className="mt-3 text-sm text-muted">
              New community events will appear here when they are created.
            </p>

            <Link
              href={user ? "/create-event" : "/register"}
              className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary-hover"
            >
              {user ? "Create an event" : "Join Sahayora"}
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event, index) => (
              <article
                key={event._id || event.id}
                className="group overflow-hidden rounded-2xl border border-border bg-surface transition hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="relative aspect-[1.35] overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <span
                    className="absolute left-5 top-5 rounded-full px-4 py-2 text-[10px] font-extrabold tracking-[0.12em] text-foreground"
                    style={{
                      backgroundColor:
                        eventColors[index % eventColors.length],
                    }}
                  >
                    {(event.type || "COMMUNITY").toUpperCase()}
                  </span>

                  <span className="absolute bottom-4 right-5 text-5xl font-extrabold text-white/80">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="p-6 sm:p-7">
                  <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-muted">
                    <span>◷ {formatEventDate(event.date)}</span>
                    <span>⌖ {event.location}</span>
                  </div>

                  <h3 className="mt-5 text-2xl font-extrabold leading-tight transition group-hover:text-primary">
                    {event.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-muted">
                    {event.description}
                  </p>

                  <Link
                    href={`/events/${event._id || event.id}`}
                    className="mt-7 inline-flex items-center gap-3 border-b border-foreground/20 pb-2 text-sm font-extrabold transition group-hover:border-primary group-hover:text-primary"
                  >
                    View Event <ArrowUpRight />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* COMMUNITY IN ACTION - COMPLETED EVENTS */}
      <section
        id="community-in-action"
        className="bg-surface-secondary py-24"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-12 text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-accent">
              VISUAL STORIES
            </p>

            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Community in Action
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted">
              Moments from volunteer drives, relief distributions, and green
              initiatives across Dhaka and beyond.
            </p>
          </div>

          {completedLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-[1.25] animate-pulse rounded-2xl bg-surface"
                />
              ))}
            </div>
          ) : completedEvents.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-14 text-center">
              <p className="text-xl font-extrabold">
                No completed events yet
              </p>
              <p className="mt-3 text-sm text-muted">
                Completed community events will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {completedEvents.map((event) => (
                <Link
                  key={event._id}
                  href={`/events/${event._id}`}
                  className="group relative block aspect-[1.25] overflow-hidden rounded-2xl bg-surface shadow-sm"
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                    <span className="inline-flex rounded-md bg-primary px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">
                      {event.type || "Community"}
                    </span>

                    <h3 className="mt-3 text-xl font-extrabold leading-tight">
                      {event.title}
                    </h3>

                    <p className="mt-2 flex items-center gap-2 text-xs font-medium text-white/80">
                      <span aria-hidden="true">⌖</span>
                      <span>{event.location}</span>
                    </p>

                    <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-white/65">
                      Completed · {formatEventDate(event.date)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      {/* COMMUNITY CTA */}
      <section className="px-5 py-24 sm:px-8 lg:px-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#25233A] px-7 py-16 text-white sm:px-14 sm:py-20 lg:px-20">
          <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full border border-white/10" />
          <div className="absolute -right-4 -top-8 h-52 w-52 rounded-full border border-white/10" />
          <div className="absolute bottom-0 right-[20%] h-36 w-36 rounded-full bg-accent/20 blur-3xl" />

          <div className="relative z-10 max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#F08A72]">
              YOUR TURN TO MAKE A DIFFERENCE
            </p>

            <h2 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              The world needs more people like you.
            </h2>

            <p className="mt-6 max-w-lg leading-8 text-white/65">
              Join a community that believes in kindness, action, and making
              good things happen. Your next step starts here.
            </p>

            <Link
              href="/register"
              className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#F08A72] px-7 py-4 font-extrabold text-[#25233A] transition hover:-translate-y-1 hover:bg-[#ffab98]"
            >
              Join Sahayora <ArrowUpRight />
            </Link>
          </div>

          <div className="absolute bottom-8 right-12 hidden text-[150px] leading-none text-white/5 lg:block">
            ✳
          </div>
        </div>
      </section>
    </main>
  );
}