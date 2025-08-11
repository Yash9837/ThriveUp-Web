import { EventCard } from "@/components/EventCard";
import type { EventModel } from "@/types/models";

export function EventGrid({ events }: { events: EventModel[] }) {
  if (events.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-gray-400 text-2xl">📅</span>
        </div>
        <p className="text-gray-900 text-lg mb-2">No events found</p>
        <p className="text-gray-600">Check back later for upcoming events!</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => (
        <EventCard
          key={event.eventId}
          id={event.eventId}
          title={event.title}
          date={event.date}
          posterUrl={event.posterUrl ?? event.imageName}
          location={event.location}
          category={event.category}
          attendanceCount={event.attendanceCount}
          time={event.time}
          description={event.description}
        />
      ))}
    </div>
  );
}


