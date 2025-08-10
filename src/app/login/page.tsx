"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { updateRole } from "@/services/users";
import type { UserRole } from "@/types/models";

function LoginInner() {
  const { user, profile, loginWithGoogle, loginWithEmail } = useAuth();
  const search = useSearchParams();
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("user");
  const next = search.get("next") ?? "/";

  useEffect(() => {
    if (!user || !profile) return;
    const ut = (profile.userType ?? "").toLowerCase();
    const isHost = ["host", "organiser", "organizer", "club"].includes(ut);
    const selectorShown = !profile.role; // first-time profile
    if (selectorShown) {
      if (role === "organizer") {
        if (isHost) router.replace("/organizer/events");
        else router.replace(next || "/");
      } else {
        router.replace(next || "/");
      }
      return;
    }
    if (profile.role === "organizer") router.replace("/organizer/events");
    else router.replace(next || "/");
  }, [user, profile, role, next, router]);

  const showRoleSelector = !profile?.role;

  const handleGoogle = async () => {
    await loginWithGoogle(showRoleSelector ? role : undefined);
  };

  const handleEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement & { email: { value: string }; password: { value: string } };
    try {
      await loginWithEmail(form.email.value, form.password.value, showRoleSelector ? role : undefined);
    } catch {
      // toast shown from hook for non-existent user
    }
  };

  useEffect(() => {
    // If user logged in and profile exists but has no role set, persist selected role once
    const persistRole = async () => {
      if (user && profile && !profile.role && role) {
        await updateRole(user.uid, role);
      }
    };
    void persistRole();
  }, [user, profile, role]);

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-md px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        {showRoleSelector ? (
          <div className="mb-6">
            <p className="mb-2">Are you logging in as Organizer or User?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setRole("user")}
                className={`px-3 py-1.5 rounded-md border ${role === "user" ? "bg-[#FF5900] text-white" : "bg-white"}`}
              >
                User
              </button>
              <button
                onClick={() => setRole("organizer")}
                className={`px-3 py-1.5 rounded-md border ${role === "organizer" ? "bg-[#FF5900] text-white" : "bg-white"}`}
              >
                Organizer
              </button>
            </div>
          </div>
        ) : (
          <p className="mb-4">Detected role: <strong>{profile?.role}</strong></p>
        )}

        <div className="space-y-3">
          <button onClick={handleGoogle} className="w-full px-3 py-2 rounded-md border hover:bg-[#FFEDD9]">Continue with Google</button>
          <form onSubmit={handleEmail} className="space-y-3">
            <input name="email" type="email" placeholder="Email" required className="w-full border rounded-md px-3 py-2" />
            <input name="password" type="password" placeholder="Password" required className="w-full border rounded-md px-3 py-2" />
            <button type="submit" className="w-full px-3 py-2 rounded-md bg-[#FF5900] text-white">Continue</button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}


