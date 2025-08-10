"use client";

import Navbar from "@/components/Navbar";
import { RoleGate } from "@/components/AuthGate";
import { useEventRegistrations } from "@/hooks/registrations";
import { useParams } from "next/navigation";

export default function EventRegistrationsPage() {
  const params = useParams<{ id: string }>();
  const eventId = params?.id as string;
  const { registrations, isLoading } = useEventRegistrations(eventId);

  return (
    <RoleGate role="organizer">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Registrations</h1>
        {isLoading && <p>Loading...</p>}
        <ul className="space-y-2">
          {registrations.map((r) => (
            <li key={r.id} className="border rounded-md p-3">
              <div className="text-sm">User: {r.userId}</div>
              <div className="text-sm text-black">At: {String(r.registeredAt)}</div>
            </li>
          ))}
        </ul>
        {!isLoading && registrations.length === 0 && <p>No registrations.</p>}
      </main>
    </RoleGate>
  );
}


