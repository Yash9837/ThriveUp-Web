"use client";

import { onAuthStateChanged, signOut, signInWithPopup, signInWithEmailAndPassword, type User } from "firebase/auth";
import { getFirebaseAuth, googleProvider } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { getProfile } from "@/services/users";
import type { UserProfile, UserRole } from "@/types/models";
import toast from "react-hot-toast";

export function useAuth() {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, async (u) => {
      setFirebaseUser(u);
      if (u) {
        const p = await getProfile(u.uid);
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const effectiveRole: UserRole | undefined = ((): UserRole | undefined => {
    const ut = profile?.userType?.toLowerCase();
    if (ut === "host" || ut === "organiser" || ut === "organizer") return "organizer";
    if (ut === "user") return "user";
    return profile?.role;
  })();

  const enforceRoleAfterSignIn = async (selectedRole?: UserRole) => {
    const auth = getFirebaseAuth();
    const u = auth.currentUser;
    if (!u) return;
    const existing = await getProfile(u.uid);
    if (!existing) {
      toast.error("User does not exist");
      await signOut(auth);
      throw new Error("user-not-found");
    }
    const userTypeLower = (existing.userType ?? "").toLowerCase();
    const isHost = ["host", "organiser", "organizer", "club"].includes(userTypeLower);
    if (selectedRole === "organizer" && !isHost) {
      toast.error("You are not a valid organiser");
      await signOut(auth);
      throw new Error("not-organizer");
    }
  };

  const loginWithGoogle = async (initialRole?: UserRole) => {
    const auth = getFirebaseAuth();
    const res = await signInWithPopup(auth, googleProvider);
    if (res.user) {
      await enforceRoleAfterSignIn(initialRole);
    }
  };

  const loginWithEmail = async (email: string, password: string, initialRole?: UserRole) => {
    const auth = getFirebaseAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await enforceRoleAfterSignIn(initialRole);
    } catch (e) {
      toast.error("User does not exist");
      throw e;
    }
  };

  const logout = async () => {
    const auth = getFirebaseAuth();
    await signOut(auth);
  };

  return { user: firebaseUser, profile: profile ? { ...profile, role: effectiveRole ?? profile.role } : null, loading, loginWithGoogle, loginWithEmail, logout };
}


