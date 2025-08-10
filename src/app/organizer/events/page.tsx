"use client";

import Navbar from "@/components/Navbar";
import { RoleGate } from "@/components/AuthGate";
import { useAuth } from "@/hooks/useAuth";
import { useDeleteEvent, useMyEvents } from "@/hooks/events";
import Link from "next/link";

export default function OrganizerEventsPage() {
  const { profile } = useAuth();
  const { events, isLoading } = useMyEvents(profile?.uid);
  const del = useDeleteEvent();

  // Debug logging
  console.log("OrganizerEventsPage - Profile:", profile);
  console.log("OrganizerEventsPage - Profile UID:", profile?.uid);
  console.log("OrganizerEventsPage - Events:", events);
  console.log("OrganizerEventsPage - IsLoading:", isLoading);

  return (
    <RoleGate role="organizer">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">My Active Events</h1>
        {isLoading && <p>Loading...</p>}
        <div className="space-y-3">
          {events.map((e) => (
            <div key={e.eventId} className="border rounded-md p-3 flex items-center justify-between">
              <div>
                <p className="font-medium">{e.title}</p>
                <p className="text-sm text-black">{new Date(e.date).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link className="px-3 py-1.5 rounded-md border" href={`/events/${e.eventId}`}>View</Link>
                <Link className="px-3 py-1.5 rounded-md border" href={`/organizer/events/${e.eventId}/registrations`}>Registrations</Link>
                <button
                  className="px-3 py-1.5 rounded-md border text-red-600"
                  onClick={() => del.mutate(e.eventId)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {events.length === 0 && !isLoading && <p>No events found.</p>}
        </div>
      </main>
    </RoleGate>
  );
}


