"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, profile, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="w-full max-w-5xl flex items-center justify-between px-6 py-4 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl ring-1 ring-white/5 transition-all duration-300 hover:bg-black/70">

        {/* Left: Navigation */}
        <div className="flex-1 flex items-center gap-6">
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

        {/* Center: Brand */}
        <div className="flex-0">
          <Link href="/" className="group flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand group-hover:to-purple-500 transition-all duration-300">
              ThriveUp
            </span>
          </Link>
        </div>

        {/* Right: Auth / Profile */}
        <div className="flex-1 flex items-center justify-end gap-4">
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
                <Link href="/organizer/new" className="hidden sm:block text-sm font-medium text-brand hover:text-brand-light transition-colors">
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

      </nav>
    </header>
  );
}


