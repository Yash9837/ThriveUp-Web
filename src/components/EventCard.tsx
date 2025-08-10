import Link from "next/link";

export interface EventCardProps {
  id: string;
  title: string;
  date: string;
  posterUrl?: string;
  location?: string;
}

export function EventCard({ id, title, date, posterUrl, location }: EventCardProps) {
  return (
    <Link href={`/events/${id}`} className="group block rounded-2xl border bg-white overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#FF5900] shadow-[0_6px_20px_rgba(0,0,0,0.06)]" aria-label={`Open event ${title}`}>
      <div className="aspect-[16/9] bg-white relative">
        {posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={posterUrl} alt="Event poster" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-black/60">No image</div>
        )}
        <div className="absolute bottom-2 left-2 bg-white/90 text-black text-xs px-2 py-0.5 rounded-full border">{new Date(date).toLocaleDateString()}</div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 line-clamp-1">{title}</h3>
        {location && (
          <div className="flex items-center gap-2 text-[#FF5900] text-sm">
            <span className="i-lucide-map-pin" aria-hidden />
            <span className="text-black">{location}</span>
          </div>
        )}
      </div>
    </Link>
  );
}


