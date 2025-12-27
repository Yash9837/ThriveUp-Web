"use client";

import Navbar from "@/components/Navbar";
import { RoleGate } from "@/components/AuthGate";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PosterUpload } from "@/components/PosterUpload";
import { useCreateEvent } from "@/hooks/events";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { useState, useCallback } from "react";
import { LocationPicker } from "@/components/LocationPicker";
import { SpeakerManager } from "@/components/SpeakerManager";
import { TagSelector } from "@/components/TagSelector";
import { EVENT_CATEGORIES } from "@/constants/events";
import type { Speaker } from "@/types/models";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  category: z.string().min(1, "Please select a category"),
  attendanceCount: z.number().min(1, "Attendance count must be at least 1"),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  deadlineDate: z.string().min(1, "Please select a deadline date"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  locationDetails: z.string().min(1, "Please provide location details"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function CreateEventPage() {
  const { profile } = useAuth();
  const create = useCreateEvent();
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();

  const handleLocationChange = useCallback((lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      category: "",
      attendanceCount: 100,
      date: "",
      time: "",
      deadlineDate: "",
      location: "",
      locationDetails: "",
      description: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      console.log("=== FORM SUBMISSION START ===");

      // Check if profile exists
      if (!profile) {
        toast.error("Please log in to create an event");
        return;
      }

      if (!profile.uid) {
        toast.error("User ID not found. Please log in again.");
        return;
      }

      if (selectedTags.length === 0) {
        toast.error("Please select at least one tag");
        return;
      }

      if (speakers.length === 0) {
        toast.error("Please add at least one speaker");
        return;
      }

      // Format date and time for display
      const eventDate = new Date(values.date);
      const formattedDate = eventDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

      const formattedTime = values.time;

      console.log("Form values:", values);
      console.log("Formatted date:", formattedDate);
      console.log("Selected tags:", selectedTags);
      console.log("Speakers:", speakers);
      console.log("Profile:", profile);
      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);
      console.log("Poster file:", posterFile);

      // Validate location coordinates
      if (latitude === undefined || longitude === undefined) {
        console.log("Location coordinates not set, using default values");
      }

      // Ensure coordinates are valid numbers
      const validLatitude = typeof latitude === 'number' && !isNaN(latitude) ? latitude : undefined;
      const validLongitude = typeof longitude === 'number' && !isNaN(longitude) ? longitude : undefined;

      console.log("Valid coordinates:", { latitude: validLatitude, longitude: validLongitude });

      const eventPayload = {
        title: values.title,
        category: values.category,
        attendanceCount: values.attendanceCount,
        organizerName: profile?.name ?? "",
        date: formattedDate,
        time: formattedTime,
        deadlineDate: new Date(values.deadlineDate),
        location: values.location,
        locationDetails: values.locationDetails,
        description: values.description,
        speakers,
        tags: selectedTags,
        organizerUid: profile?.uid ?? "",
        posterFile,
        status: "pending",
        ...(validLatitude !== undefined && validLongitude !== undefined && {
          latitude: validLatitude,
          longitude: validLongitude
        }),
      };

      console.log("Event payload:", eventPayload);
      console.log("=== CALLING CREATE EVENT ===");

      await create.mutateAsync(eventPayload);

      console.log("=== EVENT CREATED SUCCESSFULLY ===");
      toast.success("Event created successfully!");
      window.location.href = "/organizer/events";
    } catch (error) {
      console.error("=== ERROR IN FORM SUBMISSION ===");
      console.error("Error details:", error);
      console.error("Error message:", error instanceof Error ? error.message : 'Unknown error');
      console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
      toast.error(`Failed to create event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <RoleGate role="organizer">
      <Navbar />
      <div className="min-h-screen bg-[#0E0E10] text-zinc-100 font-sans selection:bg-brand/30 selection:text-brand-100">
        <Navbar />

        {/* Global Background Noise/Gradient */}
        <div className="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

        <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
              Create New Event
            </h1>
            <p className="text-zinc-400">Fill in the details to launch your event.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-zinc-900/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-white/5 space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-brand">✨</span> Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Event Title</label>
                  <input
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 text-white placeholder-zinc-600 focus:outline-none focus:border-brand/50 transition-colors"
                    placeholder="e.g. Tech Summit 2025"
                    {...register("title")}
                  />
                  {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Category</label>
                  <select
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand/50 transition-colors appearance-none"
                    {...register("category")}
                  >
                    <option value="" className="bg-zinc-900 text-zinc-500">Select a category</option>
                    {EVENT_CATEGORIES.map((category) => (
                      <option key={category} value={category} className="bg-zinc-900">{category}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Expected Attendance</label>
                  <input
                    type="number"
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 text-white placeholder-zinc-600 focus:outline-none focus:border-brand/50 transition-colors"
                    placeholder="500"
                    {...register("attendanceCount", { valueAsNumber: true })}
                  />
                  {errors.attendanceCount && <p className="text-sm text-red-500 mt-1">{errors.attendanceCount.message}</p>}
                </div>
              </div>
            </div>

            {/* Date and Time */}
            <div className="bg-zinc-900/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-white/5 space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-brand">📅</span> Date and Time
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Event Date</label>
                  <input
                    type="date"
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand/50 transition-colors [color-scheme:dark]"
                    {...register("date")}
                  />
                  {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Event Time</label>
                  <input
                    type="time"
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand/50 transition-colors [color-scheme:dark]"
                    {...register("time")}
                  />
                  {errors.time && <p className="text-sm text-red-500 mt-1">{errors.time.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Registration Deadline</label>
                  <input
                    type="date"
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand/50 transition-colors [color-scheme:dark]"
                    {...register("deadlineDate")}
                  />
                  {errors.deadlineDate && <p className="text-sm text-red-500 mt-1">{errors.deadlineDate.message}</p>}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-zinc-900/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-white/5 space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-brand">📍</span> Location
              </h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Venue</label>
                    <input
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 text-white placeholder-zinc-600 focus:outline-none focus:border-brand/50 transition-colors"
                      placeholder="e.g., Online, Conference Center"
                      {...register("location")}
                    />
                    {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Details / Room</label>
                    <input
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 text-white placeholder-zinc-600 focus:outline-none focus:border-brand/50 transition-colors"
                      placeholder="e.g., Room 101, Zoom Link"
                      {...register("locationDetails")}
                    />
                    {errors.locationDetails && <p className="text-sm text-red-500 mt-1">{errors.locationDetails.message}</p>}
                  </div>
                </div>
                <LocationPicker
                  latitude={latitude}
                  longitude={longitude}
                  onLocationChange={handleLocationChange}
                />
              </div>
            </div>

            {/* Description */}
            <div className="bg-zinc-900/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-white/5 space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-brand">📝</span> Event Description
              </h2>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Description</label>
                <textarea
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 text-white placeholder-zinc-600 focus:outline-none focus:border-brand/50 transition-colors"
                  rows={6}
                  placeholder="Tell us everything about the event..."
                  {...register("description")}
                />
                {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-zinc-900/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-white/5 space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-brand">🏷️</span> Tags
              </h2>
              <TagSelector
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
                maxTags={15}
              />
            </div>

            {/* Speakers */}
            <div className="bg-zinc-900/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-white/5 space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-brand">🎤</span> Speakers
              </h2>
              <SpeakerManager
                speakers={speakers}
                onSpeakersChange={setSpeakers}
              />
            </div>

            {/* Poster */}
            <div className="bg-zinc-900/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-white/5 space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-brand">🖼️</span> Event Poster
              </h2>
              <PosterUpload onFile={setPosterFile} />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                className="px-8 py-4 rounded-xl bg-brand text-white font-bold text-lg hover:bg-orange-600 disabled:opacity-60 transition-all shadow-lg shadow-brand/20 flex items-center gap-2 group"
                disabled={create.isPending}
              >
                {create.isPending ? "Launching Event..." : "Launch Event"}
                {!create.isPending && <span className="group-hover:translate-x-1 transition-transform">🚀</span>}
              </button>
            </div>
          </form>
        </main>
      </div>
    </RoleGate>
  );
}


