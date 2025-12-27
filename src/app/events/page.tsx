"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { EventGrid } from "@/components/EventGrid";
import { useEvents } from "@/hooks/events";
import { Search, TrendingUp, Award, Users, Star } from "lucide-react";

// Featured categories
const featuredCategories = [
  { name: "Tech & Innovation", icon: TrendingUp, color: "from-blue-500 to-purple-600", count: 12 },
  { name: "Workshops", icon: Award, color: "from-green-500 to-teal-600", count: 8 },
  { name: "Networking", icon: Users, color: "from-orange-500 to-red-600", count: 15 },
  { name: "Conferences", icon: Star, color: "from-pink-500 to-rose-600", count: 6 }
];

export default function EventsPage() {
  const { events, isLoading, error } = useEvents();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Filter events based on search and category
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Navbar Spacing Wrapper */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand/10 rounded-full blur-[120px] mix-blend-screen animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 pt-32 pb-20">
        {/* Search and Filter Section */}
        <section className="mb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-purple-500">Perfect Event</span>
              </h1>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">Discover events that match your vibe, schedule, and interests.</p>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* Search Bar */}
              <div className="relative mb-8 group">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-brand transition-colors" />
                <input
                  type="text"
                  placeholder="Search events by title, description, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 text-lg bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-brand focus:border-transparent focus:bg-white/10 transition-all outline-none shadow-xl backdrop-blur-sm"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 transform hover:scale-105 ${selectedCategory === ""
                    ? "bg-brand text-white shadow-lg shadow-brand/25 ring-2 ring-brand ring-offset-2 ring-offset-black"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
                    }`}
                >
                  All Events
                </button>
                {featuredCategories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 transform hover:scale-105 ${selectedCategory === category.name
                      ? "bg-brand text-white shadow-lg shadow-brand/25 ring-2 ring-brand ring-offset-2 ring-offset-black"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
                      }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Events Grid */}
        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <p className="text-gray-400 font-medium">Loading events...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20 bg-red-500/10 rounded-3xl border border-red-500/20 max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                  <span className="text-3xl">⚠️</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Oops! Something went wrong</h3>
                <p className="text-gray-400">Failed to load events. Please try again later.</p>
              </div>
            ) : (
              <>
                {filteredEvents.length > 0 ? (
                  <EventGrid events={filteredEvents} />
                ) : (
                  <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm max-w-2xl mx-auto">
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="w-8 h-8 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No events found</h3>
                    <p className="text-gray-400">We couldn&apos;t find any events matching your criteria.</p>
                    <button
                      onClick={() => { setSearchQuery(""); setSelectedCategory(""); }}
                      className="mt-6 px-6 py-2 bg-brand text-white rounded-full font-bold text-sm hover:bg-white hover:text-black transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
