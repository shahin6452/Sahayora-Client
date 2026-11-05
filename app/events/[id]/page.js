import { Suspense } from "react";
import EventDetailsClient from "./EventDetailsClient";

function EventDetailsLoading() {
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

async function EventDetailsContent({ params }) {
  const { id } = await params;
  return <EventDetailsClient eventId={id} />;
}

export default function EventDetailsPage({ params }) {
  return (
    <Suspense fallback={<EventDetailsLoading />}>
      <EventDetailsContent params={params} />
    </Suspense>
  );
}