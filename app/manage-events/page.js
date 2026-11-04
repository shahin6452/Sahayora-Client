
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "../providers";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const EMPTY_FORM = {
  title: "",
  description: "",
  type: "",
  image: "",
  location: "",
  date: "",
};

const EVENT_TYPES = [
  "Donation",
  "Education",
  "Environment",
  "Food Distribution",
  "Health",
  "Clothing Distribution",
  "Community Support",
  "Other",
];

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function EventSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="h-48 animate-pulse bg-surface-secondary" />
      <div className="space-y-4 p-5">
        <div className="h-4 w-1/3 animate-pulse rounded bg-surface-secondary" />
        <div className="h-6 w-3/4 animate-pulse rounded bg-surface-secondary" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-surface-secondary" />
        <div className="flex gap-3">
          <div className="h-10 flex-1 animate-pulse rounded-full bg-surface-secondary" />
          <div className="h-10 flex-1 animate-pulse rounded-full bg-surface-secondary" />
        </div>
      </div>
    </div>
  );
}

export default function ManageEventsPage() {
  const router = useRouter();
  const { data: session, isPending } = useAuth();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMyEvents = useCallback(
    async (signal) => {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(`${API_URL}/api/events/my-events`, {
          credentials: "include",
          cache: "no-store",
          signal,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load your events");
        }

        setEvents(data.events || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(true);
          toast.error(err.message || "Unable to load your events.");
        }
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      setLoading(false);
      router.replace("/login");
      return;
    }

    const controller = new AbortController();

    fetchMyEvents(controller.signal);

    return () => controller.abort();
  }, [session?.user?.id, isPending, router, fetchMyEvents]);

  const openEditModal = (event) => {
    setEditingEvent(event);

    const localDate = new Date(event.date);
    const timezoneOffset = localDate.getTimezoneOffset() * 60000;
    const localDateTime = new Date(
      localDate.getTime() - timezoneOffset
    )
      .toISOString()
      .slice(0, 16);

    setForm({
      title: event.title || "",
      description: event.description || "",
      type: event.type || "",
      image: event.image || "",
      location: event.location || "",
      date: localDateTime,
    });
  };

  const closeEditModal = () => {
    if (saving) return;

    setEditingEvent(null);
    setForm(EMPTY_FORM);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingEvent) return;

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/api/events/${editingEvent._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update event");
      }

      setEvents((previous) =>
        previous.map((event) =>
          event._id === editingEvent._id ? data.event : event
        )
      );

      toast.success(data.message || "Event updated successfully!");
      setEditingEvent(null);
      setForm(EMPTY_FORM);
    } catch (err) {
      toast.error(err.message || "Unable to update event.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      setDeleting(true);

      const response = await fetch(
        `${API_URL}/api/events/${deletingId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete event");
      }

      setEvents((previous) =>
        previous.filter((event) => event._id !== deletingId)
      );

      toast.success(data.message || "Event deleted successfully!");
      setDeletingId(null);
    } catch (err) {
      toast.error(err.message || "Unable to delete event.");
    } finally {
      setDeleting(false);
    }
  };

  if (isPending || loading) {
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
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-primary">
              Your Activities
            </p>

            <h1 className="mt-3 text-3xl font-extrabold text-foreground sm:text-4xl">
              Manage Events
            </h1>

            <p className="mt-3 max-w-2xl leading-7 text-muted">
              Manage the community events you have created. Update details or
              remove events whenever needed.
            </p>
          </div>

          <Link
            href="/create-event"
            className="inline-flex w-fit items-center justify-center rounded-full bg-primary px-6 py-3 font-bold text-white transition hover:bg-primary-hover"
          >
            + Create Event
          </Link>
        </div>

        {error ? (
          <div className="rounded-2xl border border-border bg-surface px-6 py-16 text-center">
            <h2 className="text-xl font-bold text-foreground">
              Unable to load your events
            </h2>

            <p className="mt-3 text-muted">
              Something went wrong while loading your events.
            </p>

            <button
              onClick={() => fetchMyEvents()}
              className="mt-6 rounded-full bg-primary px-6 py-3 font-bold text-white transition hover:bg-primary-hover"
            >
              Try Again
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-3xl border border-border bg-surface px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-3xl">
              ✳
            </div>

            <h2 className="mt-6 text-2xl font-extrabold text-foreground">
              No Events Created Yet
            </h2>

            <p className="mx-auto mt-3 max-w-md leading-7 text-muted">
              You haven't created any community events yet. Start an initiative
              and bring people together.
            </p>

            <Link
              href="/create-event"
              className="mt-7 inline-flex rounded-full bg-primary px-7 py-3 font-bold text-white transition hover:bg-primary-hover"
            >
              Create Your First Event
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm font-semibold text-muted">
                {events.length} {events.length === 1 ? "Event" : "Events"} Created
              </p>
            </div>

            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <article
                  key={event._id}
                  className="overflow-hidden rounded-2xl border border-border bg-surface transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-48 overflow-hidden bg-surface-secondary">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover"
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

                    <div className="mt-5 flex flex-wrap gap-3 border-t border-border pt-4">
                      <button
                        onClick={() => openEditModal(event)}
                        className="flex-1 rounded-full border border-primary px-4 py-2.5 text-sm font-bold text-primary transition hover:bg-primary-light"
                      >
                        Edit Event
                      </button>

                      <button
                        onClick={() => setDeletingId(event._id)}
                        className="flex-1 rounded-full border border-red-200 px-4 py-2.5 text-sm font-bold text-red-500 transition hover:bg-red-50"
                      >
                        Delete
                      </button>

                      <Link
                        href={`/events/${event._id}`}
                        className="w-full rounded-full bg-surface-secondary px-4 py-2.5 text-center text-sm font-bold text-foreground transition hover:bg-primary-light hover:text-primary"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Edit Event Modal */}
      {editingEvent && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeEditModal();
          }}
        >
          <div className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-border bg-surface p-6 shadow-2xl sm:p-8">
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-primary">
                  Update Information
                </p>

                <h2 className="mt-2 text-2xl font-extrabold text-foreground">
                  Edit Event
                </h2>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={saving}
                aria-label="Close edit form"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-secondary text-xl text-foreground hover:bg-primary-light hover:text-primary"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-foreground">
                  Event Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  maxLength={100}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-foreground">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  rows={5}
                  required
                  className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-foreground">
                  Event Type
                </label>

                <select
                  name="type"
                  value={form.type}
                  onChange={handleFormChange}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary"
                >
                  {!EVENT_TYPES.includes(form.type) && form.type && (
                    <option value={form.type}>{form.type}</option>
                  )}

                  <option value="">Select event type</option>

                  {EVENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-foreground">
                  Image URL
                </label>

                <input
                  type="url"
                  name="image"
                  value={form.image}
                  onChange={handleFormChange}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-foreground">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleFormChange}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-foreground">
                  Event Date & Time
                </label>

                <input
                  type="datetime-local"
                  name="date"
                  value={form.date}
                  onChange={handleFormChange}
                  min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                    .toISOString()
                    .slice(0, 16)}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={saving}
                  className="rounded-full border border-border px-6 py-3 font-bold text-foreground transition hover:bg-surface-secondary disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-primary px-7 py-3 font-bold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !deleting) {
              setDeletingId(null);
            }
          }}
        >
          <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-7 shadow-2xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl">
              🗑️
            </div>

            <h2 className="mt-5 text-xl font-extrabold text-foreground">
              Delete This Event?
            </h2>

            <p className="mt-3 leading-7 text-muted">
              Are you sure you want to delete this event? This action cannot
              be undone.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                disabled={deleting}
                className="rounded-full border border-border px-5 py-3 font-bold text-foreground hover:bg-surface-secondary disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-full bg-red-500 px-6 py-3 font-bold text-white transition hover:bg-red-600 disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
