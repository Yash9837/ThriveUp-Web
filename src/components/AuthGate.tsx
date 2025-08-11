"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, router, pathname]);

  if (!user) return null;
  return <>{children}</>;
}

export function RoleGate({ children, role }: { children: React.ReactNode; role: "organizer" | "user" }) {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect if we're not loading and we have a profile but the role doesn't match
    if (!loading && profile && profile.role && profile.role !== role) {
      console.log(`RoleGate: Access denied. Required: ${role}, Got: ${profile.role}`);
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, profile, role, router, pathname]);

  // Show loading state while profile is being fetched
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFD1A1] to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FF5900] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if no profile or role doesn't match
  if (!profile || profile.role !== role) {
    console.log(`RoleGate: Not rendering. Profile:`, profile, `Required role:`, role);
    return null;
  }

  return <>{children}</>;
}


