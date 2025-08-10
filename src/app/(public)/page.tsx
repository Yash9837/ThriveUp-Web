import Navbar from "@/components/Navbar";
import { EventGrid } from "@/components/EventGrid";
import { useEvents } from "@/hooks/events";

export default function HomePage() {
  const { events, isLoading, error } = useEvents();
  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <section className="mb-8">
          <h1 className="text-3xl font-extrabold mb-2">Discover</h1>
          <p className="text-[#555]">Find and register for upcoming events</p>
        </section>
        {isLoading && <p>Loading events...</p>}
        {error && <p className="text-red-600">Failed to load events.</p>}
        {!isLoading && !error && <EventGrid events={events} />}
      </main>
    </div>
  );
}


