"use client";

import { useEffect, useState } from "react";
import { useMyEvents } from "@/hooks/events";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { AuthGate } from "@/components/AuthGate";
import Link from "next/link";
import { Calendar, Users, Ticket, BarChart3, Plus } from "lucide-react";
import { OrganizerEventCard } from "@/components/OrganizerEventCard";
import { getRegistrationCount } from "@/services/registrations";

export default function OrganizerEventsPage() {
  const { user } = useAuth();
  const { events, isLoading } = useMyEvents(user?.uid);
  const [totalAttendees, setTotalAttendees] = useState(0);

  // Calculate Aggregated Stats
  const totalEvents = events.length;

  useEffect(() => {
    async function calculateTotal() {
      if (!events.length) {
        setTotalAttendees(0);
        return;
      }
      try {
        const counts = await Promise.all(events.map(e => getRegistrationCount(e.eventId)));
        const sum = counts.reduce((a, b) => a + b, 0);
        setTotalAttendees(sum);
      } catch (error) {
        console.error("Failed to calculate total attendees:", error);
      }
    }
    calculateTotal();
  }, [events]);

  return (
    <AuthGate>
      <div className="min-h-screen bg-[#0E0E10] text-zinc-100 font-sans selection:bg-brand/30 selection:text-brand-100">
        <Navbar />

        {/* Subtle Background Texture */}
        <div className="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        <div className="fixed top-0 left-0 right-0 h-96 bg-gradient-to-b from-brand/5 to-transparent pointer-events-none" />

        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">

          {/* Header & Actions */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
                Organizer Dashboard
              </h1>
              <p className="text-zinc-400">Manage your events and track performance.</p>
            </div>
            <Link
              href="/organizer/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white font-bold rounded-lg hover:bg-orange-600 transition-all shadow-lg shadow-brand/20 group"
            >
              <Plus className="w-5 h-5" /> Create Event
            </Link>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
            <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-colors">
              <div className="absolute top-0 right-0 p-32 bg-brand/5 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-50 group-hover:opacity-100" />
              <div className="relative z-10">
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Total Events</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white">{totalEvents}</span>
                  <Ticket className="w-5 h-5 text-brand" />
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-colors">
              <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-50 group-hover:opacity-100" />
              <div className="relative z-10">
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Total Attendees</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white">{totalAttendees}</span>
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-colors">
              <div className="absolute top-0 right-0 p-32 bg-green-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-50 group-hover:opacity-100" />
              <div className="relative z-10">
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Avg. Engagement</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white">--</span>
                  <BarChart3 className="w-5 h-5 text-green-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Events Grid */}
          <section>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              Your Events <span className="opacity-50 text-sm font-normal">({totalEvents})</span>
            </h2>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-zinc-800 border-t-brand rounded-full animate-spin"></div>
              </div>
            ) : events.length === 0 ? (
              <div className="bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-zinc-600" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">No events yet</h3>
                <p className="text-zinc-500 mb-6">Create your first event to start tracking registrations.</p>
                <Link href="/organizer/create" className="text-brand font-medium hover:underline">
                  Create Event
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {events.map((event) => (
                  <OrganizerEventCard key={event.eventId} event={event} />
                ))}
              </div>
            )}
          </section>

        </main>
      </div>
    </AuthGate>
  );
}
