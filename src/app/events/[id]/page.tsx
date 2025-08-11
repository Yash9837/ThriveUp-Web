"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useEvent } from "@/hooks/events";
import { useAuth } from "@/hooks/useAuth";
import { useParams, useRouter } from "next/navigation";
import { getProfile } from "@/services/users";
import type { UserProfile } from "@/types/models";
import { Calendar, Clock, MapPin, Users, User, Tag, CalendarDays } from "lucide-react";

export default function EventDetailsPage() {
  const params = useParams<{ id: string }>();
  const eventId = params?.id as string;
  const { event, isLoading } = useEvent(eventId);
  const { user, profile } = useAuth();
  const router = useRouter();
  const [organizerProfile, setOrganizerProfile] = useState<UserProfile | null>(null);

  // Fetch organizer profile when event loads
  useEffect(() => {
    if (event?.userId) {
      getProfile(event.userId).then(setOrganizerProfile);
    }
  }, [event?.userId]);

  const handleRegister = async () => {
    if (!user) {
      router.push(`/login?next=/events/${eventId}`);
      return;
    }
    // Only block organizers
    if (profile?.role === "organizer") return;
    
    // Redirect to registration form
    router.push(`/events/${eventId}/register`);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
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

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg mb-6"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!event) {
    return (
      <div>
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
            <p className="text-gray-600">The event you're looking for doesn't exist or has been removed.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Hero Section with Image and Title */}
        <div className="relative mb-8">
          {event.imageName && (
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={event.imageName} 
                alt={`${event.title} poster`} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-[#FF5900] text-white text-sm font-medium rounded-full">
                    {event.category}
                  </span>
                  <span className="px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full backdrop-blur-sm">
                    {event.attendanceCount} attendees
                  </span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">{event.title}</h1>
                <p className="text-white/90 text-lg">{event.description.substring(0, 120)}...</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Details */}
            <section className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Details</h2>
              
              <div className="space-y-6">
                {/* Date and Time */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#FF5900]/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-[#FF5900]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Date & Time</h3>
                    <p className="text-gray-700">{formatDate(event.date)}</p>
                    <p className="text-gray-600">{formatTime(event.time)}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                    <p className="text-gray-700">{event.location}</p>
                    {event.locationDetails && (
                      <p className="text-gray-600 text-sm">{event.locationDetails}</p>
                    )}
                  </div>
                </div>

                {/* Organizer */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <User className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Organized by</h3>
                    <p className="text-gray-700">{event.organizerName}</p>
                    {organizerProfile?.email && (
                      <p className="text-gray-600 text-sm">{organizerProfile.email}</p>
                    )}
                  </div>
                </div>

                {/* Attendance */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Expected Attendance</h3>
                    <p className="text-gray-700">{event.attendanceCount.toLocaleString()} people</p>
                  </div>
                </div>

                {/* Registration Deadline */}
                {event.deadlineDate && (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <CalendarDays className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Registration Deadline</h3>
                      <p className="text-gray-700">
                        {event.deadlineDate instanceof Date 
                          ? event.deadlineDate.toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : event.deadlineDate.toDate?.()?.toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) || 'TBD'
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Description */}
            <section className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{event.description}</p>
              </div>
            </section>

            {/* Speakers */}
            {event.speakers && event.speakers.length > 0 && (
              <section className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Speakers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {event.speakers.map((speaker, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      {speaker.imageURL && (
                        <img 
                          src={speaker.imageURL} 
                          alt={speaker.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">{speaker.name}</h3>
                        <p className="text-gray-600 text-sm">Speaker</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <section className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Tags</h2>
                <div className="flex flex-wrap gap-3">
                  {event.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Register for Event</h3>
              
              {!user ? (
                <button
                  onClick={() => router.push(`/login?next=/events/${eventId}`)}
                  className="w-full px-6 py-3 bg-[#FF5900] text-white font-semibold rounded-lg hover:bg-[#E54D00] transition-colors"
                >
                  Login to Register
                </button>
              ) : !profile ? (
                <div className="text-center py-4">
                  <div className="w-6 h-6 border-2 border-[#FF5900] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading user profile...</p>
                </div>
              ) : profile.role === "organizer" ? (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-3">Organizers cannot register for events</p>
                  <button
                    onClick={() => router.push('/organizer/events')}
                    className="px-4 py-2 text-[#FF5900] border border-[#FF5900] rounded-lg hover:bg-[#FF5900] hover:text-white transition-colors"
                  >
                    View My Events
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleRegister}
                  className="w-full px-6 py-3 bg-[#FF5900] text-white font-semibold rounded-lg hover:bg-[#E54D00] transition-colors"
                >
                  Register Now
                </button>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Event Date:</span>
                  <span className="font-medium text-gray-900">{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium text-gray-900">{formatTime(event.time)}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium text-gray-900">{event.location}</span>
                </div>
              </div>
            </div>

            {/* Location Map */}
            {event.latitude && event.longitude && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Event Location</h3>
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-3">Location coordinates:</p>
                  <p className="text-xs text-gray-500 font-mono">
                    {event.latitude.toFixed(6)}, {event.longitude.toFixed(6)}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">{event.location}</p>
                  {event.locationDetails && (
                    <p className="text-xs text-gray-500 mt-1">{event.locationDetails}</p>
                  )}
                </div>
                <div className="mt-4">
                  <a
                    href={`https://www.google.com/maps?q=${event.latitude},${event.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors text-center block"
                  >
                    View on Google Maps
                  </a>
                </div>
              </div>
            )}

            {/* Quick Info */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Tag className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Category: <span className="font-medium text-gray-900">{event.category}</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Capacity: <span className="font-medium text-gray-900">{event.attendanceCount.toLocaleString()}</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Organizer: <span className="font-medium text-gray-900">{event.organizerName}</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


