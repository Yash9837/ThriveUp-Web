"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { AuthGate } from "@/components/AuthGate";
import { useAuth } from "@/hooks/useAuth";
import { useMyRegistrations } from "@/hooks/registrations";
import Link from "next/link";
import { MapPin, Mail, Calendar, Code, Sparkles, ExternalLink, Award, Ticket, X, Copy, Check } from "lucide-react";

export default function ProfilePage() {
  const { user, profile } = useAuth();
  const { registrations, isLoading } = useMyRegistrations(user?.uid);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

  // Safe access to extended profile fields (assuming they might not strict-type yet)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extendedProfile = profile as any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    // Handle Firestore timestamp or string
    try {
      const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
      return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    } catch {
      return "Unknown";
    }
  };

  // ORGANIZER VIEW
  if (profile?.role === 'organizer') {
    return (
      <AuthGate>
        <div className="min-h-screen bg-black relative overflow-hidden text-white">
          <div className="relative z-50"><Navbar /></div>

          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-[-20%] right-[-20%] w-[800px] h-[800px] bg-brand/10 rounded-full blur-[120px] mix-blend-screen" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
          </div>

          <main className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-12">

              {/* Organizer Header */}
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-brand p-1">
                  <img
                    src={extendedProfile?.profileImageURL || "https://ui-avatars.com/api/?name=" + (profile?.name || "User") + "&background=random"}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{profile.name}</h1>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-brand text-white text-xs font-bold uppercase tracking-wider rounded-md">
                      Organizer
                    </span>
                    <p className="text-zinc-400 text-sm flex items-center gap-1.5">
                      <Mail className="w-4 h-4" /> {profile.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dashboard Card */}
                <Link href="/organizer/events" className="group relative overflow-hidden bg-zinc-900 border border-white/10 rounded-2xl p-8 hover:border-brand/40 transition-all">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Award className="w-6 h-6 text-brand" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Organizer Dashboard</h2>
                    <p className="text-zinc-400 mb-6">Manage your events, view registrations, and access insights.</p>
                    <span className="inline-flex items-center gap-2 text-brand font-bold text-sm group-hover:gap-3 transition-all">
                      Go to Dashboard <ExternalLink className="w-4 h-4" />
                    </span>
                  </div>
                </Link>

                {/* Create Event Card */}
                <Link href="/organizer/new" className="group relative overflow-hidden bg-zinc-900 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all">
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Create New Event</h2>
                    <p className="text-zinc-400 mb-6">Launch a new event and start collecting registrations.</p>
                    <span className="inline-flex items-center gap-2 text-white font-bold text-sm group-hover:gap-3 transition-all">
                      Start Creating <ExternalLink className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </div>

              {/* Account Settings (Simplified) */}
              <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-8">
                <h3 className="text-lg font-bold text-white mb-6">Account Settings</h3>
                <div className="space-y-4">
                  <button className="w-full text-left px-4 py-3 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-lg text-zinc-300 transition-colors flex justify-between items-center group">
                    <span>Edit Profile Details</span>
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-lg text-zinc-300 transition-colors flex justify-between items-center group">
                    <span>Notification Preferences</span>
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              </div>

            </div>
          </main>
        </div>
      </AuthGate>
    );
  }

  // ATTENDEE / DEFAULT VIEW
  return (
    <AuthGate>
      <div className="min-h-screen bg-black relative overflow-hidden text-white">
        {/* Navbar Wrapper */}
        <div className="relative z-50">
          <Navbar />
        </div>

        {/* Background Effects - More Vibrant Orange */}
        <div className="fixed inset-0 pointer-events-none">
          {/* Top Right Orange Explosion */}
          <div className="absolute top-[-20%] right-[-20%] w-[800px] h-[800px] bg-brand/20 rounded-full blur-[120px] mix-blend-screen animate-blob" />
          {/* Bottom Left Secondary Orange */}
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[100px] mix-blend-screen animate-blob animation-delay-2000" />
          {/* Center Subtle Glow */}
          <div className="absolute top-[30%] left-[30%] w-[500px] h-[500px] bg-brand/10 rounded-full blur-[150px] mix-blend-screen" />

          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        </div>

        <main className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-8">

            {/* 1. Header Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand via-orange-500 to-brand rounded-[2.5rem] opacity-40 blur-xl group-hover:opacity-60 transition duration-1000"></div>
              <div className="relative bg-[#0F0F0F] border border-brand/30 rounded-[2rem] shadow-2xl overflow-hidden">

                {/* Cover Area - More Orange */}
                <div className="h-48 bg-gradient-to-r from-brand via-orange-600 to-black relative">
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40" />
                  <div className="absolute inset-0 bg-black/20 mix-blend-overlay" />
                </div>

                {/* Profile Info Overlay */}
                <div className="px-8 pb-8 -mt-20 flex flex-col md:flex-row items-center md:items-end gap-6 relative z-10">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-40 h-40 rounded-full p-1 bg-gradient-to-br from-white/20 to-brand/20 backdrop-blur-md border border-white/20 shadow-2xl">
                      <img
                        src={extendedProfile?.profileImageURL || "https://ui-avatars.com/api/?name=" + (profile?.name || "User") + "&background=random"}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover bg-black"
                      />
                    </div>
                    {/* Status Indicator */}
                    <div className="absolute bottom-4 right-4 w-6 h-6 bg-brand border-4 border-[#0F0F0F] rounded-full shadow-[0_0_10px_rgba(255,89,0,0.5)]"></div>
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 pb-2 text-center md:text-left min-w-0">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-3 mb-2">
                      <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight break-words max-w-full drop-shadow-md">
                        {profile?.name}
                      </h1>
                      <span className="px-3 py-1 bg-brand text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-brand/20 shrink-0 border border-brand/50">
                        {extendedProfile?.role || "Explorer"}
                      </span>
                    </div>

                    {extendedProfile?.college && (
                      <p className="text-xl text-gray-300 font-medium flex items-center justify-center md:justify-start gap-2 mb-3">
                        <MapPin className="w-5 h-5 text-brand" />
                        <span className="truncate">{extendedProfile.college}</span>
                      </p>
                    )}

                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-400 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-brand" />
                        Joined {formatDate(extendedProfile?.createdAt)}
                      </span>
                      {extendedProfile?.email && (
                        <span className="flex items-center gap-1.1 break-all">
                          <Mail className="w-4 h-4 text-brand" />
                          {extendedProfile.email}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pb-4 shrink-0">
                    <button className="px-6 py-3 bg-brand text-white font-bold rounded-full hover:bg-orange-600 transition-colors shadow-lg shadow-brand/30 flex items-center gap-2">
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Card: The Vibe (Interests) */}
              <div className="md:col-span-2 bg-gray-900/80 backdrop-blur-sm border border-brand/20 rounded-3xl p-8 relative overflow-hidden group hover:border-brand/50 transition-colors hover:shadow-[0_0_30px_rgba(255,89,0,0.1)] bg-gradient-to-br from-gray-900 to-black">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Sparkles className="w-32 h-32 text-brand" />
                </div>
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold flex items-center gap-2 mb-6 text-white">
                    <Sparkles className="w-6 h-6 text-brand" />
                    The Vibe
                  </h2>
                  {extendedProfile?.interests && extendedProfile.interests.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {extendedProfile.interests.map((interest: string, i: number) => (
                        <span key={i} className="px-4 py-2 bg-gradient-to-r from-orange-800 to-brand border border-brand/20 rounded-xl text-gray-200 font-medium hover:text-white hover:border-brand hover:bg-brand/10 transition-all cursor-default">
                          {interest}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No vibe set yet. Add some interests!</p>
                  )}
                </div>
              </div>

              {/* Card: Flagship Tech (Stack) */}
              <div className="bg-gray-900/80 backdrop-blur-sm border border-brand/20 rounded-3xl p-8 relative overflow-hidden group hover:border-brand/50 transition-colors hover:shadow-[0_0_30px_rgba(255,89,0,0.1)] bg-gradient-to-br from-gray-900 to-black">
                <div className="absolute bottom-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Code className="w-24 h-24 text-gray-700" />
                </div>
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold flex items-center gap-2 mb-6 text-white">
                    <Code className="w-6 h-6 text-brand" />
                    My Stack
                  </h2>
                  {extendedProfile?.techStack && extendedProfile.techStack.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {extendedProfile.techStack.map((tech: string, i: number) => (
                        <span key={i} className="px-3 py-1.5 bg-brand/5 border border-brand/20 text-gray-300 rounded-lg text-sm font-semibold hover:bg-brand/10 hover:border-brand hover:text-white transition-all cursor-default">
                          {tech}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Stack empty.</p>
                  )}
                </div>
              </div>

              {/* Card: Registrations & Tickets */}
              <div className="md:col-span-3 bg-gray-900/80 backdrop-blur-sm border border-brand/20 rounded-3xl p-8 h-full bg-gradient-to-br from-gray-900 to-black">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Award className="w-6 h-6 text-brand" />
                    My Events & Tickets
                  </h2>
                  <span className="text-sm font-medium text-gray-500 bg-white/5 px-3 py-1 rounded-full">{registrations.length} Registered</span>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : registrations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {registrations.map((r: any) => (
                      <div
                        key={r.id}
                        className="group flex flex-col p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-brand/30 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand group-hover:scale-110 transition-transform">
                            <Ticket className="w-5 h-5" />
                          </div>
                          <Link href={`/events/${r.eventId}`}>
                            <ExternalLink className="w-4 h-4 text-gray-600 hover:text-white transition-colors" />
                          </Link>
                        </div>
                        <h3 className="font-bold text-lg text-white mb-1 group-hover:text-brand transition-colors line-clamp-1">{r.eventTitle || "Unnamed Event"}</h3>
                        <p className="text-sm text-gray-500 mb-4">Event ID: {r.eventId}</p>

                        <div className="mt-auto pt-4 border-t border-white/5 flex gap-2">
                          <button
                            onClick={() => setSelectedTicket(r)}
                            className="flex-1 py-2 bg-brand/10 hover:bg-brand text-brand hover:text-white text-xs font-bold uppercase rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                            <Ticket className="w-3 h-3" /> View Ticket
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white/5 rounded-2xl border border-dashed border-white/10">
                    <p className="text-gray-500 text-lg mb-2">No upcoming events.</p>
                    <Link href="/events" className="text-brand font-bold hover:underline">Find something to do!</Link>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Ticket Modal */}
          {selectedTicket && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="relative w-full max-w-sm bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">

                {/* Close Button */}
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 text-white hover:bg-white hover:text-black rounded-full transition-colors z-10"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="bg-brand p-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay" />
                  <div className="relative z-10">
                    <h3 className="text-2xl font-black text-white mb-1 tracking-tight">{selectedTicket.eventTitle || "Event Ticket"}</h3>
                    <p className="text-orange-100 text-sm font-medium opacity-90">Admit One</p>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  <div className="flex justify-center">
                    <div className="p-4 bg-white rounded-2xl shadow-inner">
                      {/* QR Code Visualization using API */}
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(JSON.stringify({
                          uid: selectedTicket.uid,
                          eventId: selectedTicket.eventId,
                          ticketId: selectedTicket.id
                        }))}`}
                        alt="Ticket QR"
                        className="w-40 h-40 mix-blend-multiply opacity-90"
                      />
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Ticket ID</p>
                    <div className="flex items-center justify-center gap-2 text-white font-mono bg-zinc-900 py-2 px-4 rounded-lg border border-white/5">
                      {selectedTicket.id.slice(0, 8).toUpperCase()}
                      <Copy className="w-3 h-3 text-gray-600 cursor-pointer hover:text-white" />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Attendee</span>
                      <span className="text-white font-medium">{profile?.name}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-500">Status</span>
                      <span className="text-green-500 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> Confirmed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </AuthGate>
  );
}


