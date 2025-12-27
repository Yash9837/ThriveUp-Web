"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, profile, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/login");
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="relative w-full max-w-5xl flex items-center justify-between px-6 py-4 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl ring-1 ring-white/5 transition-all duration-300 hover:bg-black/70">

        {/* Desktop: Left Navigation */}
        <div className="hidden md:flex flex-1 items-center gap-6">
          {profile?.role === 'organizer' ? (
            <Link
              href="/organizer/events"
              className="text-sm font-bold text-white hover:text-brand transition-colors uppercase tracking-wider flex items-center gap-2"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/events"
              className="text-sm font-medium text-gray-300 hover:text-brand transition-colors uppercase tracking-wider"
            >
              Explore
            </Link>
          )}
        </div>

        {/* Brand (Center on desktop, Left on mobile) */}
        <div className="flex-0 z-10">
          <Link href="/" className="group flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
            <div className="relative w-10 h-10 rounded-full overflow-hidden group-hover:scale-110 transition-transform duration-300">
              <Image
                src="/logo.png"
                alt="ThriveUp Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand group-hover:to-purple-500 transition-all duration-300">
              ThriveUp
            </span>
          </Link>
        </div>

        {/* Desktop: Right Auth/Profile */}
        <div className="hidden md:flex flex-1 items-center justify-end gap-4">
          {!user ? (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 rounded-full bg-white text-black text-sm font-bold hover:bg-gray-200 transition-colors shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/profile" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Profile
              </Link>

              {profile?.role === "organizer" && (
                <Link href="/organizer/new" className="text-sm font-medium text-brand hover:text-brand-light transition-colors">
                  + Create
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full border border-white/20 text-white text-xs font-semibold hover:bg-white hover:text-black transition-all"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile: Hamburger Button */}
        <div className="md:hidden flex flex-1 justify-end z-10">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-white hover:text-brand transition-colors focus:outline-none"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-2 md:hidden">
            {profile?.role === 'organizer' && (
              <Link
                href="/organizer/events"
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-bold text-white hover:text-brand transition-colors p-2 text-center"
              >
                Dashboard
              </Link>
            )}

            <Link
              href="/events"
              onClick={() => setIsMenuOpen(false)}
              className="text-lg font-medium text-gray-300 hover:text-brand transition-colors p-2 text-center"
            >
              Explore Events
            </Link>

            {!user ? (
              <div className="flex flex-col gap-3 mt-2">
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full py-3 text-center text-gray-300 border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full py-3 text-center bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3 border-t border-white/10 pt-4 mt-2">
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-medium text-gray-300 hover:text-white transition-colors p-2 text-center"
                >
                  My Profile
                </Link>

                {profile?.role === "organizer" && (
                  <Link
                    href="/organizer/new"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-medium text-brand hover:text-brand-light transition-colors p-2 text-center"
                  >
                    + Create Event
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full py-3 mt-2 rounded-xl border border-red-500/20 text-red-500 font-semibold hover:bg-red-500/10 transition-all"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

      </nav>
    </header>
  );
}


