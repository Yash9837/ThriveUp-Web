"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getProfile } from "@/services/users";
import toast from "react-hot-toast";

// Separate component that uses useSearchParams
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false); // Add redirect guard

  const { user, profile, loading, loginWithEmail, setUserRole } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  // Single useEffect to handle authentication and redirection
  useEffect(() => {
    const handleAuthentication = async () => {
      console.log("=== Login Page Authentication Check ===");
      console.log("Loading state:", loading);
      console.log("User:", user);
      console.log("Profile:", profile);
      console.log("Next parameter:", next);
      console.log("Has redirected:", hasRedirected);

      // Reset redirect guard when user changes (new login session)
      if (user && !hasRedirected) {
        setHasRedirected(false);
      }

      // Don't proceed if still loading
      if (loading) {
        console.log("Still loading, waiting...");
        return;
      }

      // If no user, stay on login page
      if (!user) {
        console.log("No user yet, waiting for authentication...");
        return;
      }

      // If we already have a profile with a role, redirect accordingly
      if (profile && profile.role && !hasRedirected) {
        console.log("Profile already loaded with role:", profile.role);
        setHasRedirected(true); // Mark as redirected to prevent loops

        // Add a small delay to ensure state is stable
        await new Promise(resolve => setTimeout(resolve, 100));

        if (profile.role === "organizer") {
          console.log("Redirecting organizer to /organizer/events");
          router.replace("/organizer/events");
        } else {
          console.log("Redirecting user to:", next || "/");
          router.push(next || "/");
        }
        return;
      }

      // If we have a user but no profile, fetch it from backend
      if (user.uid && !profile && !hasRedirected) {
        console.log("User authenticated, checking backend profile for:", user.uid);
        setIsCheckingProfile(true);

        try {
          const backendProfile = await getProfile(user.uid);
          console.log("Backend profile fetched:", backendProfile);

          if (backendProfile && backendProfile.userType) {
            // Automatically handle role assignment based on userType
            if (backendProfile.userType === "host") {
              // Host automatically becomes organizer - no role selection needed
              console.log("Host detected, automatically setting role as organizer");
              await setUserRole("organizer");
              console.log("Role set to organizer, redirecting to /organizer/events");
              setHasRedirected(true); // Mark as redirected to prevent loops

              // Add a small delay to ensure state is stable
              await new Promise(resolve => setTimeout(resolve, 100));
              router.replace("/organizer/events");
            } else if (backendProfile.userType === "user") {
              // Regular user automatically becomes user
              console.log("User detected, automatically setting role as user");
              await setUserRole("user");
              console.log("Role set to user, redirecting to:", next || "/");
              setHasRedirected(true); // Mark as redirected to prevent loops

              // Add a small delay to ensure state is stable
              await new Promise(resolve => setTimeout(resolve, 100));
              router.push(next || "/");
            } else {
              // Unknown userType, default to user
              console.log("Unknown userType, defaulting to user role");
              await setUserRole("user");
              setHasRedirected(true); // Mark as redirected to prevent loops

              // Add a small delay to ensure state is stable
              await new Promise(resolve => setTimeout(resolve, 100));
              router.push(next || "/");
            }
          } else {
            console.error("User profile not found or userType is missing");
            toast.error("User profile not found or userType is missing");
          }
        } catch (error) {
          console.error("Error fetching backend profile:", error);
          toast.error("Failed to fetch user profile");
        } finally {
          setIsCheckingProfile(false);
        }
      }
    };

    handleAuthentication();
  }, [user, profile, loading, router, next, setUserRole, hasRedirected]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Starting login process for email:", email);

      // Try to login with Firebase
      await loginWithEmail(email, password);

      console.log("Login successful, waiting for auth state update...");
      toast.success("Login successful! Checking user profile...");

      // The useEffect will handle checking the backend profile and redirection
    } catch (error) {
      console.error("Login error:", error);
      // Error handling is done in useAuth hook
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isCheckingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand/20 rounded-full blur-[100px] animate-blob" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px] animate-blob animation-delay-2000" />

        <div className="text-center relative z-10">
          <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">
            {isCheckingProfile ? "Checking user profile..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  if (user && profile && profile.role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand/20 rounded-full blur-[100px] animate-blob" />
        <div className="text-center relative z-10">
          <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden p-4">
      {/* Animated Background Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-brand/20 rounded-full blur-[120px] mix-blend-screen animate-blob" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] mix-blend-overlay animate-blob animation-delay-4000" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 md:p-10 animate-fade-in-up">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-white mb-3 tracking-tight">Welcome Back</h1>
            <p className="text-gray-400">Sign in to continue to ThriveUp</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-300 mb-2 ml-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none"
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-300 mb-2 ml-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none"
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand hover:bg-white hover:text-black text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-brand/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Don&apos;t have an account?{" "}
              <a href="/register" className="text-brand hover:text-white font-bold transition-colors ml-1">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}


