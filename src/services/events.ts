"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  Timestamp,
} from "firebase/firestore";
import { getDb, getBucket } from "@/lib/firebase";
import type { EventModel } from "@/types/models";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const COLLECTION = "events";

export async function listPublicEvents(): Promise<EventModel[]> {
  const db = getDb();
  const q = query(collection(db, COLLECTION), orderBy("date", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const raw = d.data() as Record<string, unknown>;
    const posterUrl = (raw["posterUrl"] as string | undefined) ?? (raw["imageName"] as string | undefined) ?? "";
    return { eventId: d.id, ...(raw as object), posterUrl } as unknown as EventModel;
  });
}

export async function getEventById(id: string): Promise<EventModel | null> {
  const db = getDb();
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const raw = snap.data() as Record<string, unknown>;
  const posterUrl = (raw["posterUrl"] as string | undefined) ?? (raw["imageName"] as string | undefined) ?? "";
  return { eventId: snap.id, ...(raw as object), posterUrl } as unknown as EventModel;
}

export interface CreateEventPayload extends Omit<EventModel, "eventId" | "imageName" | "deadlineDate"> {
  organizerUid: string;
  posterFile?: File | null;
  deadlineDate: Date;
}

export async function createEvent(payload: CreateEventPayload): Promise<string> {
  try {
    console.log("Creating event with payload:", payload);
    
    const db = getDb();
    let imageName = "";
    
    if (payload.posterFile) {
      console.log("Uploading poster file:", payload.posterFile.name);
      const storage = getBucket();
      imageName = `${payload.organizerUid}_${Date.now()}_${payload.posterFile.name}`;
      const storageRef = ref(storage, `event_images/${imageName}`);
      await uploadBytes(storageRef, payload.posterFile);
      // Store the download URL in imageName as per backend contract
      imageName = await getDownloadURL(storageRef);
      console.log("Image uploaded successfully, URL:", imageName);
    }
    
    const toSave: Record<string, unknown> = {
      ...payload,
      userId: payload.organizerUid, // Set userId to organizer's UID
      imageName: imageName || "placeholder",
      deadlineDate: Timestamp.fromDate(payload.deadlineDate),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    delete toSave.posterFile;
    console.log("Saving to Firestore:", toSave);
    
    const res = await addDoc(collection(db, COLLECTION), toSave);
    console.log("Event created successfully with ID:", res.id);
    
    // Update the document to include the eventId field
    const eventRef = doc(db, COLLECTION, res.id);
    await updateDoc(eventRef, { eventId: res.id });
    console.log("Event document updated with eventId:", res.id);
    
    return res.id;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}

export async function updateEvent(id: string, patch: Partial<EventModel>) {
  const db = getDb();
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, { ...patch, updatedAt: serverTimestamp() });
}

export async function deleteEvent(id: string) {
  const db = getDb();
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);
}

export async function listEventsByOrganizer(organizerUid: string): Promise<EventModel[]> {
  try {
    console.log("listEventsByOrganizer - Searching for organizer UID:", organizerUid);
    const db = getDb();
    // Temporarily remove orderBy to avoid index requirement
    const q = query(collection(db, COLLECTION), where("userId", "==", organizerUid));
    console.log("listEventsByOrganizer - Query created:", q);
    
    const snap = await getDocs(q);
    console.log("listEventsByOrganizer - Query result count:", snap.docs.length);
    console.log("listEventsByOrganizer - Query result docs:", snap.docs.map(d => ({ id: d.id, data: d.data() })));
    
    const result = snap.docs.map((d) => {
      const raw = d.data() as Record<string, unknown>;
      const posterUrl = (raw["posterUrl"] as string | undefined) ?? (raw["imageName"] as string | undefined) ?? "";
      return { eventId: d.id, ...(raw as object), posterUrl } as unknown as EventModel;
    });
    
    // Sort in memory instead of in database
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    console.log("listEventsByOrganizer - Final result:", result);
    return result;
  } catch (error) {
    console.error("listEventsByOrganizer - Error:", error);
    throw error;
  }
}


