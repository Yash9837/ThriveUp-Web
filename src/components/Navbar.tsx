"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { user, profile, logout } = useAuth();
  return (
    <header className="w-full sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <nav className="h-14 flex items-center justify-between rounded-2xl px-4 bg-[#FF5900] shadow-sm">
          <Link href="/" className="text-xl font-bold text-black">ThriveUp</Link>
          <div className="flex items-center gap-4 text-black">
          {!user && (
            <Link
              href="/login"
                className="px-3 py-1.5 rounded-md bg-white text-black hover:opacity-90"
            >
              Login
            </Link>
          )}
          {user && (
            <>
              <Link href="/profile" className="hover:underline">Profile</Link>
              {profile?.role === "organizer" && (
                <>
                  <Link href="/organizer/new" className="hover:underline">Create Event</Link>
                  <Link href="/organizer/events" className="hover:underline">My Events</Link>
                </>
              )}
              <button
                onClick={() => logout()}
                className="px-3 py-1.5 rounded-md border hover:bg-[#FFEDD9]"
              >
                Logout
              </button>
            </>
          )}
          </div>
        </nav>
      </div>
    </header>
  );
}


