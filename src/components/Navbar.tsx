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
      // Redirect to login page after successful logout
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="w-full sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <nav className="h-14 flex items-center justify-between rounded-2xl px-4 bg-[#FF5900] shadow-sm">
          <Link href="/" className="text-xl font-bold text-black hover:text-white transition-colors">
            ThriveUp
          </Link>
          <div className="flex items-center gap-4 text-black">
            {!user && (
              <>
                <Link
                  href="/login"
                  className="px-3 py-1.5 rounded-md bg-white text-black hover:opacity-90 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1.5 rounded-md border border-white text-white hover:bg-white hover:text-black transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
            {user && (
              <>
                <Link href="/profile" className="hover:text-white transition-colors font-medium">
                  Profile
                </Link>
                {profile?.role === "organizer" && (
                  <>
                    <Link href="/organizer/new" className="hover:text-white transition-colors font-medium">
                      Create Event
                    </Link>
                    <Link href="/organizer/events" className="hover:text-white transition-colors font-medium">
                      My Events
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-md border border-white hover:bg-white hover:text-black text-white transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}


