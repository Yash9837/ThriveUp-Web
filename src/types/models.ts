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
  contactDetails: string;
  description: string;
  githubUrl: string;
  linkedinUrl: string;
  profileImageURL: string;
  role: "user" | "organizer" | string;
  userType: "user" | "host" | string;
  techStack?: string | string[] | null;
  updatedAt?: Timestamp;                         // Firestore Timestamp
  isApproved?: boolean;
}

export interface RegistrationDoc {
  id: string;
  eventId: string;
  uid: string; // user's auth UID
  "Name": string;
  "College Email ID": string;
  "Personal Email ID": string;
  "Contact Number": string;
  "Course": string;
  "Department": string;
  "Section": string;
  "Specialization": string;
  "Year of Study": string;
  "FA Number": string;
  "Faculty Advisor": string;
  "Registration No.": string;
  timestamp: Timestamp;
}

export interface Registration {
  uid: string;                    // user's auth UID
  eventId: string;                // link to events/{eventId}
  name: string;
  collegeEmail: string;
  personalEmail: string;
  contactNumber: string;
  course: string;
  department: string;
  section: string;
  specialization: string;
  yearOfStudy: string;
  faNumber: string;
  facultyAdvisor: string;
  qrCode?: string;                // base64 PNG string
  timestamp: Timestamp;           // Firestore Timestamp
}

export interface EventDoc {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  locationDetails?: string;
  category: string;
  tags: string[];
  imageName?: string;
  attendanceCount: number;
  organizerUid: string;
  organizerName: string;
  speakers: Speaker[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}


