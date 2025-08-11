"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth, googleProvider } from "@/lib/firebase";
import { getProfile } from "@/services/users";
import type { UserProfile, UserRole } from "@/types/models";
import toast from "react-hot-toast";

export function useAuth() {
  const [firebaseUser, setFirebaseUser] = useState<import("firebase/auth").User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(getFirebaseAuth(), async (u) => {
      console.log("=== Auth state changed ===");
      console.log("Previous user:", firebaseUser?.uid);
      console.log("New user:", u?.uid);
      console.log("User email:", u?.email);
      console.log("Loading state before:", loading);
      
      setFirebaseUser(u);
      if (u) {
        console.log("User authenticated, fetching profile for:", u.uid);
        
        // Retry logic for profile loading
        let retryCount = 0;
        const maxRetries = 3;
        
        while (retryCount < maxRetries) {
          try {
            // Add a small delay to ensure Firebase is fully ready
            await new Promise(resolve => setTimeout(resolve, 100 * (retryCount + 1)));
            
            const p = await getProfile(u.uid);
            console.log(`Profile fetch attempt ${retryCount + 1}:`, { profile: p, userType: p?.userType, role: p?.role });
            
            if (p) {
              // Always assign role based on userType if it exists, regardless of existing role
              if (p.userType) {
                const userTypeLower = p.userType.toLowerCase();
                if (["host", "organiser", "organizer", "club"].includes(userTypeLower)) {
                  p.role = "organizer";
                  console.log("Assigned organizer role based on userType:", p.userType);
                } else {
                  p.role = "user";
                  console.log("Assigned user role based on userType:", p.userType);
                }
              }
              
              // If no userType, keep existing role or default to user
              if (!p.role) {
                p.role = "user";
                console.log("No userType found, defaulting to user role");
              }
              
              console.log("Setting profile state to:", p);
              setProfile(p);
              break; // Success, exit retry loop
            } else {
              console.log(`No profile found for user (attempt ${retryCount + 1}):`, u.uid);
              if (retryCount === maxRetries - 1) {
                setProfile(null);
              }
            }
          } catch (error) {
            console.error(`Error fetching profile (attempt ${retryCount + 1}):`, error);
            if (retryCount === maxRetries - 1) {
              setProfile(null);
            }
          }
          
          retryCount++;
          if (retryCount < maxRetries) {
            console.log(`Retrying profile fetch in ${100 * retryCount}ms...`);
            await new Promise(resolve => setTimeout(resolve, 100 * retryCount));
          }
        }
      } else {
        console.log("User signed out, clearing profile");
        setProfile(null);
        setFirebaseUser(null);
      }
      
      console.log("Setting loading to false");
      setLoading(false);
      console.log("Final state:", { user: u?.uid, profile: profile, loading: false });
    });
    return () => unsub();
  }, [firebaseUser?.uid, loading]); // Add dependencies to prevent warning

  // Debug profile state changes
  useEffect(() => {
    console.log("Profile state changed:", { 
      hasProfile: !!profile, 
      userType: profile?.userType, 
      role: profile?.role,
      uid: profile?.uid 
    });
  }, [profile]);

  // Function to manually set user role (used by login page)
  const setUserRole = async (role: UserRole) => {
    console.log("setUserRole called with role:", role, "Current profile:", profile);
    
    // Don't update if profile already has the correct role
    if (profile && profile.role === role) {
      console.log("Profile already has correct role:", role, "skipping update");
      return;
    }
    
    if (profile) {
      const updatedProfile = { ...profile, role };
      console.log("Setting profile with existing profile data:", updatedProfile);
      setProfile(updatedProfile);
      console.log("Updated existing profile with role:", role);
      
      // Wait a bit for state to update
      await new Promise(resolve => setTimeout(resolve, 50));
    } else if (firebaseUser) {
      // If no profile but we have a Firebase user, try to fetch the profile first
      console.log("No profile yet, fetching profile for user:", firebaseUser.uid);
      try {
        const fetchedProfile = await getProfile(firebaseUser.uid);
        if (fetchedProfile) {
          // Ensure the role is set correctly based on userType
          if (fetchedProfile.userType) {
            const userTypeLower = fetchedProfile.userType.toLowerCase();
            if (["host", "organiser", "organizer", "club"].includes(userTypeLower)) {
              fetchedProfile.role = "organizer";
            } else {
              fetchedProfile.role = "user";
            }
          }
          
          const updatedProfile = { ...fetchedProfile, role };
          console.log("Setting profile with fetched profile data:", updatedProfile);
          setProfile(updatedProfile);
          console.log("Fetched and updated profile with role:", role);
          
          // Wait a bit for state to update
          await new Promise(resolve => setTimeout(resolve, 50));
        } else {
          console.error("Could not fetch profile for user:", firebaseUser.uid);
        }
      } catch (error) {
        console.error("Error fetching profile in setUserRole:", error);
      }
    } else {
      console.error("Cannot set user role: no profile and no Firebase user");
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(getFirebaseAuth(), googleProvider);
      toast.success("Successfully signed in with Google!");
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Failed to sign in with Google");
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      console.log("Attempting login with email:", email);
      await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
      toast.success("Successfully signed in!");
    } catch (error) {
      console.error("Email sign-in error:", error);
      toast.error("Failed to sign in. Please check your credentials.");
    }
  };

  const logout = async () => {
    try {
      await signOut(getFirebaseAuth());
      toast.success("Successfully signed out!");
    } catch (error) {
      console.error("Sign-out error:", error);
      toast.error("Failed to sign out");
    }
  };

  // Function to manually refresh the profile
  const refreshProfile = async () => {
    if (!firebaseUser) {
      console.log("Cannot refresh profile: no Firebase user");
      return;
    }
    
    console.log("Manually refreshing profile for user:", firebaseUser.uid);
    setLoading(true);
    
    try {
      const p = await getProfile(firebaseUser.uid);
      console.log("Profile refreshed:", { profile: p, userType: p?.userType, role: p?.role });
      
      if (p) {
        // Always assign role based on userType if it exists
        if (p.userType) {
          const userTypeLower = p.userType.toLowerCase();
          if (["host", "organiser", "organizer", "club"].includes(userTypeLower)) {
            p.role = "organizer";
            console.log("Assigned organizer role based on userType:", p.userType);
          } else {
            p.role = "user";
            console.log("Assigned user role based on userType:", p.userType);
          }
        }
        
        // If no userType, keep existing role or default to user
        if (!p.role) {
          p.role = "user";
          console.log("No userType found, defaulting to user role");
        }
        
        setProfile(p);
        console.log("Profile refreshed successfully");
      } else {
        console.log("No profile found during refresh");
        setProfile(null);
      }
    } catch (error) {
      console.error("Error refreshing profile:", error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  return { 
    user: firebaseUser, 
    profile, 
    loading, 
    loginWithGoogle, 
    loginWithEmail, 
    logout,
    setUserRole,
    refreshProfile
  };
}


