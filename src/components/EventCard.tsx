import Link from "next/link";
import { Calendar, MapPin, Users, Clock, Star } from "lucide-react";

export interface EventCardProps {
  id: string;
  title: string;
  date: string;
  posterUrl?: string;
  location?: string;
  category?: string;
  attendanceCount?: number;
  time?: string;
  description?: string;
}

export function EventCard({
  id,
  title,
  date,
  posterUrl,
  location,
  category,
  attendanceCount,
  time,
  description
}: EventCardProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getCategoryColor = (cat?: string) => {
    if (!cat) return "from-gray-500 to-gray-600";

    const colors: { [key: string]: string } = {
      "Tech and Innovation": "from-blue-500 to-purple-600",
      "Workshops": "from-green-500 to-teal-600",
      "Networking": "from-orange-500 to-red-600",
      "Conferences": "from-pink-500 to-rose-600",
      "Seminars": "from-indigo-500 to-blue-600",
      "Hackathons": "from-yellow-500 to-orange-600"
    };

    return colors[cat] || "from-gray-500 to-gray-600";
  };

  return (
    <Link
      href={`/events/${id}`}
      className="group block bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-brand shadow-lg hover:shadow-2xl hover:shadow-brand/20 transition-all duration-300 transform hover:-translate-y-1"
      aria-label={`Open event ${title}`}
    >
      {/* Image Section */}
      <div className="aspect-[16/9] bg-gray-900 relative overflow-hidden">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={`Event poster for ${title}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <Calendar className="w-12 h-12 text-gray-700 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">No image</p>
            </div>
          </div>
        )}

        {/* Category Badge */}
        {category && (
          <div className="absolute top-3 left-3">
            <span className={`inline-block px-3 py-1 text-xs font-bold text-white rounded-full bg-gradient-to-r ${getCategoryColor(category)} shadow-lg border border-white/20`}>
              {category}
            </span>
          </div>
        )}

        {/* Date Badge */}
        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-white/20">
          {formatDate(date)}
        </div>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-brand transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* Event Details */}
        <div className="space-y-3 mb-4">
          {/* Date and Time */}
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="w-4 h-4 text-brand" />
            <span className="text-sm font-medium">{formatDate(date)}</span>
            {time && (
              <>
                <span className="text-gray-600">•</span>
                <Clock className="w-4 h-4 text-brand" />
                <span className="text-sm font-medium">{time}</span>
              </>
            )}
          </div>

          {/* Location */}
          {location && (
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin className="w-4 h-4 text-brand" />
              <span className="text-sm font-medium">{location}</span>
            </div>
          )}

          {/* Attendance */}
          {attendanceCount && (
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-4 h-4 text-brand" />
              <span className="text-sm font-medium">{attendanceCount} attendees</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-brand font-bold text-sm group-hover:translate-x-1 transition-transform duration-300">
            <span>View Details</span>
            <Star className="w-4 h-4" />
          </div>

          {/* Popularity Indicator */}
          {attendanceCount && attendanceCount > 100 && (
            <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold bg-yellow-500/10 px-2 py-1 rounded-lg border border-yellow-500/20">
              <Star className="w-3 h-3 fill-current" />
              <span>Popular</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}


