"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ArrowRight, Calendar, Users, Star, CheckCircle, Smartphone, Shield, Zap, Globe, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black overflow-x-hidden font-sans selection:bg-brand selection:text-white">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-40 overflow-hidden bg-black">
        {/* Animated Background Blobs - Grayscale & Orange Only */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-white rounded-full mix-blend-overlay filter blur-[100px] opacity-10 animate-blob" />
          <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-brand rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-gray-800 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-4000" />
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">

            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-sm font-medium text-white mb-8 animate-fade-in-up hover:bg-white/10 transition-all cursor-default">
                <Sparkles className="w-4 h-4 text-brand" />
                <span>Reimagining Campus Events</span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tight animate-fade-in-up delay-100">
                THRIVE <br />
                <span className="text-brand animate-pulse-glow">
                  TOGETHER
                </span>
              </h1>

              <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-fade-in-up delay-200 font-light">
                The ultimate ecosystem for student life. Discover exclusive events, manage communities, and build your legacy.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up delay-300">
                <Link
                  href="/events"
                  className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-bold text-lg rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-gray-200"
                >
                  <span className="relative z-10">Explore Events</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white font-semibold text-lg rounded-full border border-white/20 hover:bg-white/5 hover:border-brand transition-all duration-300 backdrop-blur-sm"
                >
                  Start Hosting
                </Link>
              </div>
            </div>

            {/* Floating Visuals */}
            <div className="flex-1 relative w-full max-w-[500px] lg:max-w-none h-[400px] lg:h-[600px] animate-fade-in-up delay-500">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
                {/* Card 1 */}
                <div className="absolute top-0 right-10 w-64 h-80 bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl transform rotate-6 animate-float z-20 overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                  <div className="h-40 bg-gradient-to-br from-gray-800 to-black relative">
                    <div className="absolute bottom-4 left-4 p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/5">
                      <Calendar className="w-6 h-6 text-brand" />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="h-4 w-24 bg-gray-700/50 rounded mb-4" />
                    <div className="h-3 w-32 bg-gray-700/30 rounded mb-2" />
                    <div className="h-3 w-20 bg-gray-700/30 rounded" />
                  </div>
                </div>

                {/* Card 2 */}
                <div className="absolute bottom-10 left-10 w-72 h-44 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl transform -rotate-3 animate-float animation-delay-2000 z-30 flex items-center p-6 gap-4">
                  <div className="w-16 h-16 rounded-full bg-brand flex items-center justify-center shadow-[0_0_20px_rgba(255,89,0,0.4)]">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Hackathon 2025</h3>
                    <p className="text-brand text-sm font-medium flex items-center gap-1">
                      <span className="w-2 h-2 bg-brand rounded-full animate-pulse" />
                      Live Now
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* --- FEATURES BENTO GRID --- */}
      <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black tracking-tight">
              Why ThriveUp? <br />
              <span className="text-brand">Features That Hit Different 🚀</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We didn&apos;t just build an app. We built the ultimate campus ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[350px]">

            {/* Feature 1: Large Card (Engage/Social) */}
            <div className="md:col-span-2 row-span-1 md:row-span-2 group relative bg-black rounded-3xl p-10 border border-gray-100 shadow-2xl transition-all duration-300 overflow-hidden hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]">
              <div className="absolute top-0 right-0 w-80 h-80 bg-brand/20 rounded-full blur-[100px] -mr-20 -mt-20 transition-transform group-hover:scale-150" />

              <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-brand border border-white/10 backdrop-blur-md">
                      <Users className="w-7 h-7" />
                    </div>
                    <h3 className="text-4xl font-black text-white mb-2 uppercase italic tracking-wider">No Randos. <br /> Just Vibes.</h3>
                  </div>
                  <div className="hidden md:block px-4 py-2 bg-brand/20 text-brand rounded-full text-sm font-bold border border-brand/20">
                    Social Hub
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-4">
                    <p className="text-lg text-gray-300 font-medium">Your new circle is waiting.</p>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-gray-400">
                        <span className="w-1.5 h-1.5 bg-brand rounded-full" />
                        <span>Filter by <strong>College & Vibes</strong></span>
                      </li>
                      <li className="flex items-center gap-3 text-gray-400">
                        <span className="w-1.5 h-1.5 bg-brand rounded-full" />
                        <span>Match via <strong>shared interests</strong></span>
                      </li>
                      <li className="flex items-center gap-3 text-gray-400">
                        <span className="w-1.5 h-1.5 bg-brand rounded-full" />
                        <span><strong>Real-time Chat</strong> (Verified Only)</span>
                      </li>
                    </ul>
                  </div>

                  {/* Visual Element representing chat/profile */}
                  <div className="relative h-40 bg-gray-900/50 rounded-xl border border-white/10 p-4 transform group-hover:rotate-1 transition-transform cursor-default">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-brand" />
                      <div className="h-2 w-20 bg-gray-700 rounded-full" />
                    </div>
                    <div className="space-y-2">
                      <div className="p-2 rounded-lg bg-brand/10 text-brand text-xs w-fit">
                        Hitting up the fest tonight? 🎫
                      </div>
                      <div className="p-2 rounded-lg bg-white/5 text-gray-400 text-xs w-fit ml-auto">
                        Yeah! Just got my ticket. Let&apos;s link.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Tall Card (Organizers) */}
            <div className="md:col-span-1 row-span-1 md:row-span-2 group relative bg-gray-50 rounded-3xl p-8 border border-gray-200 shadow-lg overflow-hidden text-black hover:bg-white transition-colors">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gray-100 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10 h-full flex flex-col">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 border border-gray-200 shadow-md text-brand">
                  <Calendar className="w-7 h-7" />
                </div>
                <h3 className="text-3xl font-black mb-2 uppercase tracking-wide">Host Like <br /> A Pro 🎯</h3>
                <p className="text-gray-500 mb-8 font-medium">
                  Launch events that people actually want to attend.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm group-hover:scale-105 transition-transform">
                    <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Analytics</div>
                    <div className="text-2xl font-black text-black">1,420 <span className="text-sm font-medium text-green-500">+12%</span></div>
                    <div className="text-xs text-gray-400">Registrations today</div>
                  </div>
                </div>

                <div className="mt-auto space-y-3">
                  <div className="font-bold text-gray-900 mb-2">The Toolkit:</div>
                  {[
                    "Map Integration 🗺️",
                    "QR Check-ins 📱",
                    "Direct Attendee Blast 📣",
                    "Waitlists ⏳"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-gray-100 shadow-sm text-sm font-semibold text-gray-700">
                      <CheckCircle className="w-4 h-4 text-brand" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Feature 3: Small Card (Community/Tribes) */}
            <div className="group relative bg-brand rounded-3xl p-8 shadow-xl overflow-hidden text-white transition-all hover:translate-y-[-5px] hover:shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10" />
              <div className="relative z-10 h-full flex flex-col">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-black mb-2 uppercase">Find Your <br /> Tribe 🤝</h3>
                <p className="text-orange-100 text-sm font-medium mb-6">
                  Join student clubs, organize meetups, and lead your community.
                </p>

                <div className="mt-auto flex flex-wrap gap-2">
                  {["Clubs", "Societies", "Groups"].map((tag, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-sm border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Feature 4: Small Card (Profile) */}
            <div className="group relative bg-white rounded-3xl p-8 border border-gray-200 shadow-lg hover:shadow-xl hover:border-brand/30 transition-all">
              <div className="relative z-10 h-full flex flex-col">
                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Star className="w-6 h-6 text-brand" />
                </div>
                <h3 className="text-2xl font-black text-black mb-2 uppercase">Flex Your <br /> Profile 💎</h3>
                <p className="text-gray-500 text-sm font-medium mb-6">
                  Bento-style profiles. Show off your hobbies, interests, and vibes.
                </p>

                <div className="mt-auto flex -space-x-2">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-brand flex items-center justify-center text-[10px] text-white font-bold">+500</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- APP DOWNLOAD SECTION --- */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[2.5rem] bg-black overflow-hidden p-10 md:p-16 shadow-2xl">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/30 rounded-full blur-[120px] -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/40 rounded-full blur-[120px] -ml-32 -mb-32" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-block px-4 py-1.5 rounded-full bg-brand/20 border border-brand/30 text-brand text-sm font-bold mb-6 uppercase tracking-wider">
                  Coming to iOS
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                  Experience ThriveUp <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-light">
                    On The Go ⚡
                  </span>
                </h2>
                <p className="text-xl text-gray-400 mb-10 max-w-lg">
                  Get the full aesthetic experience. Swipe through events, easy check-ins, and instant chat notifications.
                </p>

                <Link
                  href="https://apps.apple.com/th/app/thriveup/id6743316129"
                  target="_blank"
                  className="inline-flex items-center gap-4 group"
                >
                  <div className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-lg transition-all transform group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                    <Smartphone className="w-6 h-6" />
                    Download on App Store
                  </div>
                </Link>
              </div>

              <div className="flex-1 relative w-full flex justify-center perspective-1000">
                <div className="relative w-72 md:w-80 aspect-[9/19] bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden transform rotate-[-6deg] hover:rotate-0 transition-all duration-500">
                  {/* Mock Screen Content - Abstract */}
                  <div className="absolute inset-0 bg-gray-900 flex flex-col">
                    <div className="h-full w-full bg-gradient-to-br from-gray-800 to-black p-6 flex flex-col">
                      {/* Fake UI Elements */}
                      <div className="w-full flex justify-between items-center mb-8">
                        <div className="w-8 h-8 rounded-full bg-gray-700" />
                        <div className="w-20 h-4 rounded-full bg-gray-700" />
                      </div>
                      <div className="w-full aspect-[4/5] rounded-2xl bg-gradient-to-br from-brand to-purple-600 mb-6 shadow-lg flex items-end p-4">
                        <div className="w-full">
                          <div className="w-3/4 h-6 bg-white/20 rounded mb-2" />
                          <div className="w-1/2 h-4 bg-white/20 rounded" />
                        </div>
                      </div>
                      <div className="flex gap-4 justify-center mt-auto">
                        <div className="w-16 h-16 rounded-full bg-gray-800 border border-red-500/30 flex items-center justify-center text-red-500">✕</div>
                        <div className="w-16 h-16 rounded-full bg-brand/20 border border-brand flex items-center justify-center text-brand">♥</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="relative py-40 bg-black overflow-hidden flex items-center justify-center text-center border-t border-gray-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800 via-black to-black" />
        </div>

        <div className="relative z-10 max-w-4xl px-4">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">
            READY TO <span className="text-brand">ASCEND?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join the community that&apos;s redefining campus culture.
            Create, connect, and thrive.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-brand text-white font-bold text-xl rounded-full hover:bg-brand-light hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,89,0,0.4)]"
            >
              Get Started Now
              <ArrowRight className="w-6 h-6" />
            </Link>
            <Link
              href="https://apps.apple.com/th/app/thriveup/id6743316129"
              target="_blank"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white/10 text-white font-bold text-xl rounded-full hover:bg-white/20 hover:scale-105 transition-all duration-300 border border-white/10"
            >
              Download App
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
              <span className="font-bold text-white text-lg">T</span>
            </div>
            <span className="text-2xl font-bold tracking-tight">ThriveUp</span>
          </div>

          <div className="flex items-center gap-8">
            <Link href="https://apps.apple.com/th/app/thriveup/id6743316129" target="_blank" className="text-sm text-gray-400 hover:text-brand transition-colors">
              App Store
            </Link>
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} ThriveUp Inc. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
