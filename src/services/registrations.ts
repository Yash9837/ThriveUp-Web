"use client";

import { addDoc, collection, getDocs, query, serverTimestamp, where, doc, getDoc } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import type { RegistrationDoc, Registration } from "@/types/models";

const COLLECTION = "registrations";

// New interface for the database schema with spaces in keys
interface RegistrationDataRaw {
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
}

export async function registerForEvent(registrationData: RegistrationDataRaw, eventId: string, uid: string): Promise<string | null> {
  console.log("registerForEvent called with:", { registrationData, eventId, uid });
  
  const db = getDb();
  console.log("Database instance obtained");
  
  // Check if user is already registered for this event
  const q = query(
    collection(db, COLLECTION),
    where("eventId", "==", eventId),
    where("uid", "==", uid)
  );
  console.log("Query created for existing registration check");
  
  const existing = await getDocs(q);
  console.log("Existing registrations found:", existing.size);
  
  if (!existing.empty) {
    console.log("User already registered, returning existing ID:", existing.docs[0]!.id);
    return existing.docs[0]!.id;
  }

  console.log("No existing registration found, creating new one");
  console.log("Data to be stored:", {
    ...registrationData,
    uid,
    eventId,
    timestamp: "serverTimestamp()"
  });

  try {
    // Create new registration document
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...registrationData,
      uid,
      eventId,
      timestamp: serverTimestamp(),
    });
    
    console.log("Document created successfully with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating document:", error);
    throw error;
  }
}

export async function listByUser(userId: string): Promise<RegistrationDoc[]> {
  const db = getDb();
  const q = query(collection(db, COLLECTION), where("uid", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) } as RegistrationDoc));
}

export async function listForEvent(eventId: string): Promise<RegistrationDoc[]> {
  const db = getDb();
  const q = query(collection(db, COLLECTION), where("eventId", "==", eventId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) } as RegistrationDoc));
}

export async function getRegistration(registrationId: string): Promise<Registration | null> {
  const db = getDb();
  const docRef = doc(db, COLLECTION, registrationId);
  const snap = await getDoc(docRef);
  return snap.exists() ? (snap.data() as Registration) : null;
}


