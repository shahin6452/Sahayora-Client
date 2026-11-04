
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "../providers";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const eventTypes = [
  "Donation",
  "Community Service",
  "Environment",
  "Education",
  "Health",
  "Other",
];

export default function CreateEventPage() {
  const router = useRouter();
  const { data: session, isPending } = useAuth();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    image: "",
    location: "",
    date: "",
  });

  const [errors, setErrors] = useState({});

  const today = new Date();
  const localDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 16);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = "This field is required";
      }
    });

    if (
      formData.image &&
      !/^https?:\/\/.+/i.test(formData.image.trim())
    ) {
      newErrors.image = "Please enter a valid image URL";
    }

    if (
      formData.date &&
      new Date(formData.date) <= new Date()
    ) {
      newErrors.date = "Please select a future date and time";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please check the form fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/events`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create event");
      }

      toast.success("Event created successfully!");

      router.push(`/events/${data.event._id}`);
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted">Loading...</p>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-5">
        <div className="max-w-md rounded-3xl border border-border bg-surface p-8 text-center">
          <h1 className="text-2xl font-extrabold text-foreground">
            Login Required
          </h1>
          <p className="mt-3 text-muted">
            Please login to create a community event.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-full bg-primary px-7 py-3 font-bold text-white hover:bg-primary-hover"
          >
            Login Now
          </Link>
        </div>
      </main>
    );
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/15";

  const labelClass = "text-sm font-bold text-foreground";

  return (
    <main className="min-h-screen bg-background px-5 py-12 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <Link
            href="/events"
            className="mb-6 inline-flex text-sm font-bold text-primary hover:underline"
          >
            ← Back to Events
          </Link>

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Create Something Meaningful
          </p>

          <h1 className="mt-3 text-3xl font-extrabold text-foreground sm:text-4xl">
            Create an Event
          </h1>

          <p className="mt-4 leading-7 text-muted">
            Bring people together and create positive change in your
            community.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-7 rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-9"
        >
          <div>
            <label htmlFor="title" className={labelClass}>
              Event Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              maxLength={100}
              placeholder="e.g. Winter Clothes Distribution"
              value={formData.title}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.title && (
              <p className="mt-2 text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>
              Event Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              placeholder="Describe your event, its purpose and how people can participate..."
              value={formData.description}
              onChange={handleChange}
              className={`${inputClass} resize-y`}
            />
            {errors.description && (
              <p className="mt-2 text-xs text-red-500">
                {errors.description}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="type" className={labelClass}>
              Event Category *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select a category</option>
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="mt-2 text-xs text-red-500">{errors.type}</p>
            )}
          </div>

          <div>
            <label htmlFor="image" className={labelClass}>
              Event Image URL *
            </label>
            <input
              id="image"
              name="image"
              type="url"
              placeholder="https://example.com/event-image.jpg"
              value={formData.image}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.image && (
              <p className="mt-2 text-xs text-red-500">{errors.image}</p>
            )}

            {formData.image &&
              /^https?:\/\/.+/i.test(formData.image) && (
                <div className="mt-4 overflow-hidden rounded-xl border border-border">
                  <img
                    src={formData.image}
                    alt="Event preview"
                    className="h-48 w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
          </div>

          <div>
            <label htmlFor="location" className={labelClass}>
              Event Location *
            </label>
            <input
              id="location"
              name="location"
              type="text"
              placeholder="e.g. Sylhet, Bangladesh"
              value={formData.location}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.location && (
              <p className="mt-2 text-xs text-red-500">
                {errors.location}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="date" className={labelClass}>
              Event Date & Time *
            </label>
            <input
              id="date"
              name="date"
              type="datetime-local"
              min={localDate}
              value={formData.date}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.date && (
              <p className="mt-2 text-xs text-red-500">{errors.date}</p>
            )}
          </div>

          <div className="border-t border-border pt-6">
            <p className="text-xs leading-6 text-muted">
              Your account will automatically be registered as the event
              creator.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="mt-5 w-full rounded-full bg-primary px-6 py-4 font-bold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Event..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
