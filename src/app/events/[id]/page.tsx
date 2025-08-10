"use client";

import Navbar from "@/components/Navbar";
import { useEvent } from "@/hooks/events";
import { useAuth } from "@/hooks/useAuth";
import { useRegister } from "@/hooks/events";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function EventDetailsPage() {
  const params = useParams<{ id: string }>();
  const eventId = params?.id as string;
  const { event, isLoading } = useEvent(eventId);
  const { user, profile } = useAuth();
  const router = useRouter();
  const registerMutation = useRegister(eventId, user?.uid);

  const handleRegister = async () => {
    if (!user) {
      router.push(`/login?next=/events/${eventId}`);
      return;
    }
    if (profile?.role !== "user") return;
    try {
      await registerMutation.mutateAsync();
      toast.success("Registered successfully");
    } catch {
      toast.error("Registration failed");
    }
  };

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-6">
        {isLoading && <p>Loading...</p>}
        {!isLoading && event && (
          <article>
            {Boolean(event?.imageName) && (
              <img src={event!.imageName} alt="Poster" className="rounded-lg w-full h-64 object-cover" />
            )}
            <h1 className="text-3xl font-bold mt-4 text-black">{event.title}</h1>
            <p className="text-black mt-2">{new Date(event.date).toLocaleString()}</p>
            <p className="mt-4 whitespace-pre-wrap">{event.description}</p>
            <div className="mt-6 flex items-center gap-3">
              {profile?.role !== "organizer" && (
                <button
                  onClick={handleRegister}
                  className="px-4 py-2 rounded-md bg-[#FF5900] text-white disabled:opacity-60"
                  disabled={registerMutation.isPending || profile?.role !== "user"}
                >
                  {user ? "Register" : "Login to Register"}
                </button>
              )}
            </div>
          </article>
        )}
      </main>
    </div>
  );
}


