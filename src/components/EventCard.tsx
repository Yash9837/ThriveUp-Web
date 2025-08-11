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
      className="group block bg-white rounded-2xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#FF5900] shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1" 
      aria-label={`Open event ${title}`}
    >
      {/* Image Section */}
      <div className="aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        {posterUrl ? (
          <img 
            src={posterUrl} 
            alt={`Event poster for ${title}`} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No image</p>
            </div>
          </div>
        )}
        
        {/* Category Badge */}
        {category && (
          <div className="absolute top-3 left-3">
            <span className={`inline-block px-3 py-1 text-xs font-semibold text-white rounded-full bg-gradient-to-r ${getCategoryColor(category)} shadow-lg`}>
              {category}
            </span>
          </div>
        )}
        
        {/* Date Badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border border-gray-200">
          {formatDate(date)}
        </div>
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* Content Section */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#FF5900] transition-colors duration-300">
          {title}
        </h3>
        
        {/* Description */}
        {description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
        
        {/* Event Details */}
        <div className="space-y-3 mb-4">
          {/* Date and Time */}
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4 text-[#FF5900]" />
            <span className="text-sm font-medium">{formatDate(date)}</span>
            {time && (
              <>
                <span className="text-gray-400">•</span>
                <Clock className="w-4 h-4 text-[#FF5900]" />
                <span className="text-sm font-medium">{time}</span>
              </>
            )}
          </div>
          
          {/* Location */}
          {location && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4 text-[#FF5900]" />
              <span className="text-sm font-medium">{location}</span>
            </div>
          )}
          
          {/* Attendance */}
          {attendanceCount && (
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4 text-[#FF5900]" />
              <span className="text-sm font-medium">{attendanceCount} attendees</span>
            </div>
          )}
        </div>
        
        {/* Action Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[#FF5900] font-semibold text-sm group-hover:translate-x-1 transition-transform duration-300">
            <span>View Details</span>
            <Star className="w-4 h-4" />
          </div>
          
          {/* Popularity Indicator */}
          {attendanceCount && attendanceCount > 100 && (
            <div className="flex items-center gap-1 text-orange-600 text-xs font-medium">
              <Star className="w-3 h-3 fill-current" />
              <span>Popular</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}


