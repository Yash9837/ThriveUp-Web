"use client";

import { useAuth } from "@/hooks/useAuth";

export function AuthDebug() {
  const { user, profile, loading } = useAuth();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div className="space-y-1">
        <div>Loading: {loading ? 'Yes' : 'No'}</div>
        <div>User: {user ? `Yes (${user.email})` : 'No'}</div>
        <div>Profile: {profile ? `Yes (${profile.role})` : 'No'}</div>
        <div>User ID: {user?.uid || 'None'}</div>
        <div>Profile Role: {profile?.role || 'None'}</div>
        <div>User Type: {profile?.userType || 'None'}</div>
      </div>
    </div>
  );
}
