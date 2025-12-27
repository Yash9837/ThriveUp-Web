"use client";

import { useParams } from "next/navigation";
import { useEvent } from "@/hooks/events";
import Navbar from "@/components/Navbar";
import { AuthGate } from "@/components/AuthGate";
import { EventForm } from "@/components/organizer/EventForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function EditEventPage() {
    const params = useParams<{ id: string }>();
    const eventId = typeof params?.id === 'string' ? params.id : '';
    const { event, isLoading } = useEvent(eventId);
    const { user } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0E0E10] flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-zinc-800 border-t-brand rounded-full animate-spin"></div>
            </div>
        );
    }

    // Security check: Only organizer can edit
    if (event && user && event.userId !== user.uid) {
        return (
            <div className="min-h-screen bg-[#0E0E10] flex items-center justify-center text-white">
                Access Denied
            </div>
        );
    }

    if (!event) return null;

    return (
        <AuthGate>
            <div className="min-h-screen bg-[#0E0E10] text-zinc-100 font-sans selection:bg-brand/30 selection:text-brand-100">
                <Navbar />

                <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
                    <Link href={`/organizer/events/${eventId}`} className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" /> Back to Event
                    </Link>

                    <div className="mb-10">
                        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
                            Edit Event
                        </h1>
                        <p className="text-zinc-400">Update details for {event.title}</p>
                    </div>

                    <EventForm initialData={event} isEditing={true} />
                </main>
            </div>
        </AuthGate>
    );
}
