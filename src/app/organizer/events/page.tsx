"use client";

import Navbar from "@/components/Navbar";
import { RoleGate } from "@/components/AuthGate";
import { useAuth } from "@/hooks/useAuth";
import { useDeleteEvent, useMyEvents } from "@/hooks/events";
import Link from "next/link";
import { Calendar, MapPin, Clock, Users, Plus, Eye, Users as UsersIcon, Trash2 } from "lucide-react";

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
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Active Events</h1>
                <p className="text-gray-600 mt-2">Manage and monitor your events</p>
              </div>
              <Link
                href="/organizer/new"
                className="flex items-center gap-2 px-6 py-3 bg-[#FF5900] text-white font-semibold rounded-lg hover:bg-[#E54D00] transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create New Event
              </Link>
            </div>
          </div>

          {/* Events List */}
          {isLoading ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 border-4 border-[#FF5900] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
              <p className="text-gray-600 mb-6">Create your first event to get started!</p>
              <Link
                href="/organizer/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF5900] text-white font-semibold rounded-lg hover:bg-[#E54D00] transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Your First Event
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event.eventId} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Event Image */}
                  <div className="h-48 bg-gradient-to-br from-[#FF5900] to-[#E54D00] flex items-center justify-center">
                    {event.posterUrl ? (
                      <img 
                        src={event.posterUrl} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Calendar className="w-16 h-16 text-white opacity-80" />
                    )}
                  </div>
                  
                  {/* Event Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{event.title}</h3>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-[#FF5900]" />
                        <span className="text-sm">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4 text-[#FF5900]" />
                        <span className="text-sm">{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-[#FF5900]" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4 text-[#FF5900]" />
                        <span className="text-sm">{event.attendanceCount} attendees</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/events/${event.eventId}`}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-[#FF5900] text-[#FF5900] rounded-lg hover:bg-[#FF5900] hover:text-white transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                      <Link
                        href={`/organizer/events/${event.eventId}/registrations`}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#FF5900] text-white rounded-lg hover:bg-[#E54D00] transition-colors"
                      >
                        <UsersIcon className="w-4 h-4" />
                        Registrations
                      </Link>
                      <button
                        onClick={() => del.mutate(event.eventId)}
                        disabled={del.isPending}
                        className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </RoleGate>
  );
}


