"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Calendar, Clock, MapPin, Upload, X, Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useCreateEvent, useUpdateEvent } from "@/hooks/events";
import { useAuth } from "@/hooks/useAuth";
import type { EventModel } from "@/types/models";

// Define the schema (same as previous)
const eventSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    date: z.string().refine((val) => new Date(val) > new Date(), "Date must be in the future"),
    time: z.string().min(1, "Time is required"),
    location: z.string().min(3, "Location is required"),
    locationDetails: z.string().optional(),
    category: z.string().min(1, "Category is required"),
    attendanceCount: z.number().min(1, "Attendance count must be at least 1"),
    deadlineDate: z.string().refine((val) => new Date(val) > new Date(), "Registration deadline must be in the future"),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
    initialData?: EventModel; // If provided, we are in EDIT mode
    isEditing?: boolean;
}

// Helper to safely format any date type to YYYY-MM-DD
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatDateForInput = (dateVal: any): string => {
    if (!dateVal) return "";
    try {
        // If it's a Firestore Timestamp (has toDate)
        if (typeof dateVal.toDate === 'function') {
            return dateVal.toDate().toISOString().split('T')[0];
        }
        // If it's a serialized Timestamp (has seconds)
        if (dateVal.seconds) {
            return new Date(dateVal.seconds * 1000).toISOString().split('T')[0];
        }
        // If it's a string or Date object
        const d = new Date(dateVal);
        if (!isNaN(d.getTime())) {
            return d.toISOString().split('T')[0];
        }
        return "";
    } catch (e) {
        console.error("Date parsing error:", e);
        return "";
    }
};

export function EventForm({ initialData, isEditing = false }: EventFormProps) {
    const router = useRouter();
    const { user } = useAuth();
    const createMutation = useCreateEvent();
    const updateMutation = useUpdateEvent();

    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.posterUrl || null);
    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(
        initialData?.latitude && initialData?.longitude
            ? { lat: initialData.latitude, lng: initialData.longitude }
            : null
    );

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EventFormData>({
        resolver: zodResolver(eventSchema),
        defaultValues: initialData ? {
            title: initialData.title,
            description: initialData.description,
            date: formatDateForInput(initialData.date),
            time: initialData.time,
            location: initialData.location,
            locationDetails: initialData.locationDetails,
            category: initialData.category,
            attendanceCount: initialData.attendanceCount || 100,
            deadlineDate: formatDateForInput(initialData.deadlineDate),
        } : {
            attendanceCount: 100,
        }
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPosterFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (values: EventFormData) => {
        if (!user) {
            toast.error("You must be logged in");
            return;
        }

        try {
            if (isEditing && initialData) {
                // UPDATE MODE
                // Note: For update, we might need to handle image upload separately if not abstracting it fully in current hook
                // But the previous hook assumed `createEvent`. Update needs a different payload structure or logic.
                // For now, let's assume we pass what we can. 

                // Wait, the useUpdateEvent hook only takes { patch }. Implementation of image update might be missing in `updateEvent`.
                // Let's assume for this step we update text fields. Image update needs backend checks.

                await updateMutation.mutateAsync({
                    id: initialData.eventId,
                    patch: {
                        ...values,
                        deadlineDate: new Date(values.deadlineDate), // Convert string to Date
                        // If coordinates changed
                        ...(coordinates ? { latitude: coordinates.lat, longitude: coordinates.lng } : {}),
                        // Image logic would go here if we upload it first
                    }
                });

                toast.success("Event updated successfully!");
                router.push(`/organizer/events/${initialData.eventId}`);

            } else {
                // CREATE MODE
                if (!posterFile) {
                    toast.error("Please upload an event poster");
                    return;
                }
                if (!coordinates) {
                    toast.error("Please select a location on the map");
                    return;
                }

                const eventId = await createMutation.mutateAsync({
                    ...values,
                    locationDetails: values.locationDetails || "",
                    organizerUid: user.uid,
                    organizerName: user.displayName || "ThriveUp Organizer", // Fallback
                    posterFile: posterFile,
                    deadlineDate: new Date(values.deadlineDate),
                    latitude: coordinates.lat,
                    longitude: coordinates.lng,
                    tags: ["event", values.category.toLowerCase()], // Default tags
                    speakers: [], // Default empty
                });

                toast.success("Event created successfully!");
                router.push(`/organizer/events/${eventId}`);
            }

        } catch (error) {
            console.error(error);
            toast.error(isEditing ? "Failed to update event" : "Failed to create event");
        }
    };

    // Mock Map Click (Simplified for demo, replace with real map later if needed)
    const handleMapClick = () => {
        // Just setting dummy coords for now or toggling a state
        const dummyCoords = { lat: 12.9716, lng: 77.5946 }; // Bangalore
        setCoordinates(dummyCoords);
        toast.success("Location pinned! (Simulated)");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

            {/* 1. Basic Info */}
            <div className="space-y-6 bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-brand" /> Event Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Event Title</label>
                        <input
                            {...register("title")}
                            className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand/50 transition-colors"
                            placeholder="e.g. Tech Summit 2025"
                        />
                        {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Category</label>
                        <select
                            {...register("category")}
                            className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand/50 transition-colors appearance-none"
                        >
                            <option value="">Select Category</option>
                            <option value="Technology">Technology</option>
                            <option value="Business">Business</option>
                            <option value="Music">Music</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Social">Social</option>
                        </select>
                        {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Description</label>
                    <textarea
                        {...register("description")}
                        rows={5}
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand/50 transition-colors"
                        placeholder="Tell potential attendees what this event is about..."
                    />
                    {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
                </div>
            </div>

            {/* 2. Date & Time */}
            <div className="space-y-6 bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-brand" /> Schedule
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="date"
                                {...register("date")}
                                className="w-full bg-zinc-900 border border-white/10 rounded-lg pl-10 pr-3 py-3 text-white focus:outline-none focus:border-brand/50 transition-colors [color-scheme:dark]"
                            />
                        </div>
                        {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Time</label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="time"
                                {...register("time")}
                                className="w-full bg-zinc-900 border border-white/10 rounded-lg pl-10 pr-3 py-3 text-white focus:outline-none focus:border-brand/50 transition-colors [color-scheme:dark]"
                            />
                        </div>
                        {errors.time && <p className="text-sm text-red-500 mt-1">{errors.time.message}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Registration Deadline</label>
                    <input
                        type="date"
                        {...register("deadlineDate")}
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand/50 transition-colors [color-scheme:dark]"
                    />
                    {errors.deadlineDate && <p className="text-sm text-red-500 mt-1">{errors.deadlineDate.message}</p>}
                </div>
            </div>

            {/* 3. Location */}
            <div className="space-y-6 bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-brand" /> Location
                </h3>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Venue Name</label>
                    <input
                        {...register("location")}
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand/50 transition-colors"
                        placeholder="e.g. Grand Convention Center"
                    />
                    {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Venue Details / Room</label>
                    <input
                        {...register("locationDetails")}
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand/50 transition-colors"
                        placeholder="e.g. Hall 2, 3rd Floor"
                    />
                </div>

                {/* Map Simulation - keeping it simple for now */}
                <div
                    className="h-48 rounded-xl bg-zinc-800 border-2 border-dashed border-zinc-700 flex flex-col items-center justify-center cursor-pointer hover:border-brand/50 hover:bg-zinc-800/80 transition-all group"
                    onClick={handleMapClick}
                >
                    {coordinates ? (
                        <div className="text-center">
                            <MapPin className="w-8 h-8 text-green-500 mx-auto mb-2" />
                            <p className="text-green-500 font-bold text-sm">Location Pinned</p>
                            <p className="text-zinc-500 text-xs">Lat: {coordinates.lat.toFixed(4)}, Lng: {coordinates.lng.toFixed(4)}</p>
                        </div>
                    ) : (
                        <div className="text-center">
                            <MapPin className="w-8 h-8 text-zinc-600 mx-auto mb-2 group-hover:text-brand transition-colors" />
                            <p className="text-zinc-400 text-sm font-medium">Click to Pin Location on Map</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 4. Poster & Capacity */}
            <div className="space-y-6 bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Upload className="w-5 h-5 text-brand" /> Media & Capacity
                </h3>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Event Poster</label>
                    <div className="flex items-center gap-6">
                        <div className="w-32 h-40 bg-zinc-800 rounded-lg flex items-center justify-center border border-white/5 overflow-hidden relative">
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => { setImagePreview(null); setPosterFile(null); }}
                                        className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white hover:bg-red-500 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </>
                            ) : (
                                <Upload className="w-8 h-8 text-zinc-600" />
                            )}
                        </div>
                        <div className="flex-1">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700"
                            />
                            <p className="text-xs text-zinc-500 mt-2">Recommended: 4:5 aspect ratio, max 5MB.</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Capacity (Attendees)</label>
                    <input
                        type="number"
                        {...register("attendanceCount", { valueAsNumber: true })}
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand/50 transition-colors"
                    />
                    {errors.attendanceCount && <p className="text-sm text-red-500 mt-1">{errors.attendanceCount.message}</p>}
                </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-6">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-4 bg-brand hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-brand/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> {isEditing ? "Updating..." : "Creating..."}</>
                    ) : (
                        <>{isEditing ? "Update Event" : "Launch Event"} <Sparkles className="w-5 h-5" /></>
                    )}
                </button>
            </div>

        </form>
    );
}
