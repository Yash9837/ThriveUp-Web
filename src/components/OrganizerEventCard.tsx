"use client";

import Link from "next/link";
import { Users, MapPin, Calendar, ArrowUpRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getRegistrationCount } from "@/services/registrations";
import type { EventModel } from "@/types/models";

interface OrganizerEventCardProps {
    event: EventModel;
}

export function OrganizerEventCard({ event }: OrganizerEventCardProps) {
    // Fetch real-time count from DB
    const { data: realCount, isLoading } = useQuery({
        queryKey: ["event-count", event.eventId],
        queryFn: () => getRegistrationCount(event.eventId),
        staleTime: 1000 * 60 * 5, // Cache for 5 mins
    });

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        } catch {
            return dateString;
        }
    };

    return (
        <Link
            href={`/organizer/events/${event.eventId}`}
            className="group bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden hover:border-brand/30 transition-all hover:shadow-xl hover:shadow-brand/5 flex flex-col sm:flex-row"
        >
            {/* Image / Date Strip */}
            <div className="sm:w-48 h-48 sm:h-auto bg-zinc-800 relative shrink-0">
                {event.posterUrl ? (
                    <img
                        src={event.posterUrl}
                        alt={event.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Calendar className="w-8 h-8 text-zinc-600" />
                    </div>
                )}

                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded">
                    {formatDate(event.date)}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
                <div className="flex-1">
                    <div className="flex justify-between items-start gap-4 mb-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-brand transition-colors line-clamp-1">
                            {event.title}
                        </h3>
                        <ArrowUpRight className="w-5 h-5 text-zinc-600 group-hover:text-brand transition-colors" />
                    </div>
                    <p className="text-zinc-400 text-sm line-clamp-2 mb-4">
                        {event.description}
                    </p>
                </div>

                {/* Footer Stats */}
                <div className="pt-4 border-t border-white/5 flex items-center gap-6">
                    <div className="flex items-center gap-2 text-sm text-zinc-300">
                        <Users className="w-4 h-4 text-zinc-500" />
                        <span className="font-semibold text-white">
                            {isLoading ? "..." : realCount || 0}
                        </span>
                        <span className="hidden sm:inline">Registered</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-300">
                        <MapPin className="w-4 h-4 text-zinc-500" />
                        <span className="truncate max-w-[100px]">{event.location}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
