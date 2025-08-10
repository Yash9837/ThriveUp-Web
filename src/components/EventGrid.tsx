import { EventCard } from "@/components/EventCard";
import type { EventModel } from "@/types/models";

export function EventGrid({ events }: { events: EventModel[] }) {
  if (events.length === 0) {
    return <p className="text-center text-black">No events yet.</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {events.map((e) => (
        <EventCard
          key={e.eventId}
          id={e.eventId}
          title={e.title}
          date={e.date}
          posterUrl={e.posterUrl ?? e.imageName}
          location={e.location}
        />
      ))}
    </div>
  );
}


