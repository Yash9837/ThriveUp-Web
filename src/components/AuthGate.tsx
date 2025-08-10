"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";

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
  const warnedRef = useRef(false);

  useEffect(() => {
    if (!loading && profile?.role !== role) {
      if (!warnedRef.current && role === "organizer") {
        warnedRef.current = true;
        toast.error("You are not a valid organiser");
      }
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, profile, role, router, pathname]);

  if (!profile || profile.role !== role) return null;
  return <>{children}</>;
}


