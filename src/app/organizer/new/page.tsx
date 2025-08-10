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
import { useState } from "react";
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
      <main className="mx-auto max-w-4xl px-4 py-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Create New Event</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
                <input 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#FF5900] focus:border-[#FF5900]" 
                  placeholder="Enter event title"
                  {...register("title")} 
                />
                {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#FF5900] focus:border-[#FF5900]"
                  {...register("category")}
                >
                  <option value="">Select a category</option>
                  {EVENT_CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expected Attendance *</label>
                <input 
                  type="number" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#FF5900] focus:border-[#FF5900]" 
                  placeholder="500"
                  {...register("attendanceCount", { valueAsNumber: true })} 
                />
                {errors.attendanceCount && <p className="text-sm text-red-600 mt-1">{errors.attendanceCount.message}</p>}
              </div>
            </div>
          </div>

          {/* Date and Time */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Date and Time</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Date *</label>
                <input 
                  type="date" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#FF5900] focus:border-[#FF5900]" 
                  {...register("date")} 
                />
                {errors.date && <p className="text-sm text-red-600 mt-1">{errors.date.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Time *</label>
                <input 
                  type="time" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#FF5900] focus:border-[#FF5900]" 
                  {...register("time")} 
                />
                {errors.time && <p className="text-sm text-red-600 mt-1">{errors.time.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Registration Deadline *</label>
                <input 
                  type="date" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#FF5900] focus:border-[#FF5900]" 
                  {...register("deadlineDate")} 
                />
                {errors.deadlineDate && <p className="text-sm text-red-600 mt-1">{errors.deadlineDate.message}</p>}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Location</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <input 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#FF5900] focus:border-[#FF5900]" 
                    placeholder="e.g., Online, Conference Center, University Campus"
                    {...register("location")} 
                  />
                  {errors.location && <p className="text-sm text-red-600 mt-1">{errors.location.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location Details *</label>
                  <input 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#FF5900] focus:border-[#FF5900]" 
                    placeholder="e.g., Room 101, Online meeting link, etc."
                    {...register("locationDetails")} 
                  />
                  {errors.locationDetails && <p className="text-sm text-red-600 mt-1">{errors.locationDetails.message}</p>}
                </div>
              </div>
              <LocationPicker 
                latitude={latitude} 
                longitude={longitude} 
                onLocationChange={(lat, lng) => {
                  setLatitude(lat);
                  setLongitude(lng);
                }} 
              />
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Event Description</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea 
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#FF5900] focus:border-[#FF5900]" 
                rows={6} 
                placeholder="Describe your event in detail..."
                {...register("description")} 
              />
              {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <TagSelector 
              selectedTags={selectedTags} 
              onTagsChange={setSelectedTags} 
              maxTags={15}
            />
          </div>

          {/* Speakers */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <SpeakerManager 
              speakers={speakers} 
              onSpeakersChange={setSpeakers} 
            />
          </div>

          {/* Poster */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Event Poster</h2>
            <PosterUpload onFile={setPosterFile} />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 rounded-md bg-[#FF5900] text-white font-medium hover:bg-[#FF4400] disabled:opacity-60 transition-colors"
              disabled={create.isPending}
            >
              {create.isPending ? "Creating Event..." : "Create Event"}
            </button>
          </div>
        </form>
      </main>
    </RoleGate>
  );
}


