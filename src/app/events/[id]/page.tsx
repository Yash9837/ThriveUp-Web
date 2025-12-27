"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useEvent } from "@/hooks/events";
import { useAuth } from "@/hooks/useAuth";
import { useMyRegistrations } from "@/hooks/registrations";
import { useParams, useRouter } from "next/navigation";
import { Calendar, MapPin, Users, User, Share2, ArrowLeft, Clock, Info, ChevronRight, Globe, Link as LinkIcon, CalendarDays, Ticket, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function EventDetailsPage() {
  const params = useParams<{ id: string }>();
  // Handle potentially undefined or array params
  const eventId = typeof params?.id === 'string' ? params.id : '';

  const { event, isLoading: isLoadingEvent } = useEvent(eventId);
  const { user, profile } = useAuth();
  const router = useRouter();

  // LOGIC CHANGE: Fetch all registrations for this user to check status
  // This reuses the working logic from the Profile page.
  const { registrations: myRegistrations, isLoading: isLoadingRegistrations } = useMyRegistrations(user?.uid);

  // Check if we found a registration for THIS event
  const userRegistration = myRegistrations?.find(r => r.eventId === eventId);

  // DEBUG LOGGING
  useEffect(() => {
    if (user?.uid) {
      console.log("DEBUG: Checking registrations for user:", user.uid);
      console.log("DEBUG: All Registrations:", myRegistrations);
      console.log("DEBUG: Found Registration for this event:", userRegistration);
    }
  }, [user, myRegistrations, userRegistration]);



  const handleRegister = async () => {
    if (!user) {
      router.push(`/login?next=/events/${eventId}`);
      return;
    }

    // Only block organizers
    if (profile?.role === "organizer") return;

    // If already registered, redirect to profile to view ticket
    if (userRegistration) {
      router.push('/profile');
      return;
    }

    // Redirect to registration form
    router.push(`/events/${eventId}/register`);
  };

  const formatDate = (dateString: string) => {
    // Return distinct parts for layout
    try {
      const date = new Date(dateString);
      return {
        weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
        day: date.toLocaleDateString('en-US', { day: 'numeric' }),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        full: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
      };
    } catch {
      return { weekday: '', day: '', month: '', full: dateString };
    }
  };

  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  if (isLoadingEvent) {
    return (
      <div className="min-h-screen bg-[#0E0E10] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-zinc-800 border-t-brand rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#0E0E10] flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-bold text-white tracking-tight">Event Unavailable</h1>
            <p className="text-zinc-400">The event you are looking for has been moved or deleted.</p>
            <Link href="/events" className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 text-white font-medium rounded-lg hover:bg-zinc-700 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Return to Explore
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const dateObj = formatDate(event.date);

  return (
    <div className="min-h-screen bg-[#0E0E10] text-zinc-100 font-sans selection:bg-brand/30 selection:text-brand-100">
      <Navbar />

      {/* Subtle Background Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      <div className="fixed top-0 left-0 right-0 h-96 bg-gradient-to-b from-brand/5 to-transparent pointer-events-none" />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">

        {/* Breadcrumb / Back */}
        <Link href="/events" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Events
          <ChevronRight className="w-3 h-3 text-zinc-700" />
          <span className="text-zinc-300 truncate max-w-[200px]">{event.title}</span>
        </Link>

        {/* HEADER SECTION: Magazine Style Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-16">

          {/* Left: Content Typography */}
          <div className="lg:col-span-7 space-y-8">

            {/* Meta Badge Row */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 bg-brand/10 text-brand text-xs font-bold uppercase tracking-wider rounded-md border border-brand/20">
                {event.category}
              </span>
              {event.attendanceCount > 50 && (
                <span className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs font-medium rounded-md border border-zinc-700 flex items-center gap-1.5">
                  <Users className="w-3 h-3" /> Trending
                </span>
              )}
              {userRegistration && (
                <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-wider rounded-md border border-green-500/20 flex items-center gap-1.5 animate-in fade-in zoom-in">
                  <Ticket className="w-3 h-3" /> Registered
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white tracking-tight leading-[1.05]">
              {event.title}
            </h1>

            {/* Organizer Row */}
            <div className="flex items-center gap-4 py-4 border-y border-white/5">
              <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 text-zinc-500 ring-2 ring-[#0E0E10] relative">
                {/* Avatar Placeholder */}
                <User className="w-6 h-6" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[#0E0E10] flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-0.5">Organized By</p>
                <p className="text-white font-semibold text-lg hover:text-brand transition-colors cursor-pointer">{event.organizerName}</p>
              </div>
              <div className="ml-auto flex gap-2">
                <button className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>

          {/* Right: Feature Image (Floating Card) */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/5 bg-zinc-900 relative group">
              {event.imageName ? (
                <img
                  src={event.imageName}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-700">
                  <MapPin className="w-16 h-16 opacity-20" />
                </div>
              )}

              {/* Date Badge Overlay */}
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md text-black rounded-xl p-3 min-w-[80px] text-center shadow-lg">
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">{dateObj.month}</p>
                <p className="text-3xl font-black leading-none">{dateObj.day}</p>
                <p className="text-xs font-medium text-zinc-500">{dateObj.weekday}</p>
              </div>
            </div>
          </div>

        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* LEFT COLUMN: Details (8 cols) */}
          <div className="lg:col-span-8 space-y-12">

            {/* About Section */}
            <section>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Info className="w-5 h-5 text-brand" /> About Event
              </h3>
              <div className="prose prose-invert prose-zinc max-w-none prose-lg leading-relaxed">
                <p className="whitespace-pre-wrap">{event.description || "No specific details provided for this event."}</p>
              </div>

              {/* Tags Pill Cloud */}
              {event.tags && event.tags.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {event.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-300 text-sm hover:border-zinc-700 transition-colors">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* Speakers Section */}
            {event.speakers && event.speakers.length > 0 && (
              <section className="pt-8 border-t border-white/5">
                <h3 className="text-xl font-bold text-white mb-6">Speakers & Guests</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {event.speakers.map((speaker, index) => (
                    <div key={index} className="group flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-900 hover:border-white/10 transition-all">
                      <div className="w-12 h-12 rounded-full bg-zinc-800 overflow-hidden ring-2 ring-zinc-900 group-hover:ring-brand/50 transition-all">
                        {speaker.imageURL ? (
                          <img src={speaker.imageURL} alt={speaker.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-full h-full p-3 text-zinc-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-100 group-hover:text-white">{speaker.name}</h4>
                        <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Guest Speaker</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Location Section */}
            {event.latitude && event.longitude && (
              <section className="pt-8 border-t border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-brand" /> Location
                  </h3>
                  <a
                    href={`https://www.google.com/maps?q=${event.latitude},${event.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-brand hover:text-brand-light flex items-center gap-1"
                  >
                    Get Directions <ChevronRight className="w-3 h-3" />
                  </a>
                </div>

                <div className="bg-zinc-900 rounded-2xl p-1.5 border border-white/5">
                  <div className="h-64 sm:h-80 bg-zinc-800 rounded-xl w-full relative overflow-hidden group">
                    {/* Dark Mode Google Map Embed */}
                    <iframe
                      width="100%"
                      height="100%"
                      className="absolute inset-0 w-full h-full filter grayscale-[100%] invert-[100%] contrast-[83%] opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                      frameBorder="0"
                      title="map"
                      marginHeight={0}
                      marginWidth={0}
                      scrolling="no"
                      src={`https://maps.google.com/maps?q=${event.latitude},${event.longitude}&hl=en&z=14&output=embed`}
                    />

                    {/* Gradient Overlay to ensure text readability */}
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent pointer-events-none" />

                    <div className="absolute bottom-4 left-4 bg-zinc-900/90 backdrop-blur-md px-4 py-3 rounded-lg border border-white/10 shadow-xl max-w-xs z-10">
                      <p className="text-white text-sm font-semibold">{event.location}</p>
                      {event.locationDetails && <p className="text-zinc-400 text-xs mt-0.5 truncate">{event.locationDetails}</p>}
                    </div>
                  </div>
                </div>
              </section>
            )}

          </div>

          {/* RIGHT COLUMN: Action Docket (4 cols) */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-32 space-y-6">

              {/* Main Action Card */}
              <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/40 relative overflow-hidden">
                {/* Brand Gradient Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand via-orange-500 to-brand" />

                <div className="space-y-6">
                  <div className="space-y-6">
                    <div>
                      <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Date & Time</p>
                      <div className="flex items-center gap-3 text-zinc-100 mb-2">
                        <Clock className="w-5 h-5 text-brand" />
                        <span className="font-semibold text-lg">{formatTime(event.time)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-zinc-100">
                        <Calendar className="w-5 h-5 text-brand" />
                        <span className="font-medium">{dateObj.full}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Location</p>
                      <div className="flex items-start gap-3 text-zinc-100">
                        <MapPin className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium block">{event.location}</span>
                          {event.locationDetails && (
                            <span className="text-zinc-400 text-sm block mt-0.5">{event.locationDetails}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5">
                    {!user ? (
                      <button
                        onClick={() => router.push(`/login?next=/events/${eventId}`)}
                        className="w-full py-3.5 bg-brand text-white font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-brand/20"
                      >
                        Login to Register
                      </button>
                    ) : profile?.role === "organizer" ? (
                      <div className="bg-zinc-800/50 rounded-lg p-4 text-center border border-white/5">
                        <p className="text-zinc-400 text-sm mb-2">Organizer View</p>
                        <Link href="/organizer/events" className="text-brand font-bold text-sm hover:underline">Manage This Event</Link>
                      </div>
                    ) : userRegistration ? (
                      // REGISTERED STATE
                      <div className="space-y-3">
                        <div className="w-full py-3.5 bg-green-500/10 border border-green-500/20 text-green-500 font-bold rounded-lg flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-5 h-5" /> Spot Secured
                        </div>
                        <Link
                          href="/profile"
                          className="w-full py-3.5 bg-zinc-800 text-white font-bold rounded-lg hover:bg-zinc-700 transition-all flex items-center justify-center gap-2 group"
                        >
                          View My Ticket <Ticket className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        </Link>
                      </div>
                    ) : (event.isRegistrationOpen === false) ? (
                      // REGISTRATION CLOSED STATE
                      <button
                        disabled
                        className="w-full py-3.5 bg-zinc-800/50 text-zinc-500 font-bold rounded-lg border border-white/5 cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        Registration Closed
                      </button>
                    ) : (
                      // NOT REGISTERED & OPEN
                      <button
                        onClick={handleRegister}
                        className="w-full py-3.5 bg-brand text-white font-bold rounded-lg hover:bg-white hover:text-black transition-all shadow-lg shadow-brand/20 group flex items-center justify-center gap-2"
                      >
                        {isLoadingRegistrations ? "Checking..." : "Secure My Spot"}
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}

                    {!userRegistration && (
                      <p className="text-center text-xs text-zinc-500 mt-3">limited capacity available</p>
                    )}
                  </div>
                </div>
              </div>

              {/* External Links / Socials */}
              <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
                <button className="w-full flex items-center justify-between p-4 text-zinc-300 hover:bg-zinc-800 transition-colors text-sm font-medium group">
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-zinc-500 group-hover:text-white" /> Website
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white" />
                </button>
                <button className="w-full flex items-center justify-between p-4 text-zinc-300 hover:bg-zinc-800 transition-colors text-sm font-medium group">
                  <div className="flex items-center gap-3">
                    <LinkIcon className="w-4 h-4 text-zinc-500 group-hover:text-white" /> Copy Link
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white" />
                </button>
                <button className="w-full flex items-center justify-between p-4 text-zinc-300 hover:bg-zinc-800 transition-colors text-sm font-medium group">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="w-4 h-4 text-zinc-500 group-hover:text-white" /> Add to Calendar
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
