"use client";

import Navbar from "@/components/Navbar";
import { AuthGate } from "@/components/AuthGate";
import { useAuth } from "@/hooks/useAuth";
import { useMyRegistrations } from "@/hooks/registrations";
import Link from "next/link";
import type { RegistrationDoc } from "@/types/models";

export default function ProfilePage() {
  const { user, profile } = useAuth();
  const { registrations, isLoading } = useMyRegistrations(user?.uid);

  return (
    <AuthGate>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <div className="border rounded-md p-4 mb-6">
          <p><strong>Name:</strong> {profile?.name}</p>
          <p><strong>Email:</strong> {profile?.email}</p>
        </div>
        <h2 className="text-xl font-semibold mb-2">My Registrations</h2>
        {isLoading && <p>Loading...</p>}
        <ul className="space-y-2">
          {registrations.map((r: RegistrationDoc & { eventTitle?: string }) => (
            <li key={r.id} className="border rounded-md p-3 flex items-center justify-between">
              <span>Event: {r.eventTitle ?? r.eventId}</span>
              <Link className="text-[#FF5900] hover:underline" href={`/events/${r.eventId}`}>Open</Link>
            </li>
          ))}
        </ul>
        {!isLoading && registrations.length === 0 && <p>No registrations yet.</p>}
      </main>
    </AuthGate>
  );
}


