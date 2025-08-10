import { Timestamp } from "firebase/firestore";

export type UserRole = "user" | "organizer";

export interface Speaker {
  name: string;
  imageURL: string;
}

export interface EventModel {
  eventId: string;              // "04716F37-1ADA-4452-9A01-9CA875EE2F0B"
  title: string;                // "Web 2.0"
  category: string;             // "Tech and Innovation"
  attendanceCount: number;      // 500
  organizerName: string;        // "SQAC Club"
  date: string;                 // "20 Apr 2025" (display string)
  time: string;                 // "20:00" (display string)
  deadlineDate: Timestamp;      // Firestore Timestamp
  location: string;             // "Online"
  locationDetails: string;      // "Online gmeet"
  imageName: string;            // full image URL
  posterUrl?: string;           // poster URL (computed field)
  description: string;
  latitude?: number;
  longitude?: number;
  userId?: string;              // organizer UID
  speakers: Speaker[];          // array of maps in Firestore
  status?: string;              // "accepted" | "accepted"
  tags: string[];               // ["Workshops", "Conferences", ...]
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  contactDetails?: string;
  description?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  profileImageURL?: string;
  techStack?: string;
  role?: UserRole;
  userType?: string; // backend may use 'user' or 'host'
  isApproved?: boolean;
}

export interface RegistrationDoc {
  id: string;
  eventId: string;
  userId: string;
  registeredAt: string; // ISO
}


