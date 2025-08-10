"use client";

import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import type { RegistrationDoc } from "@/types/models";

const COLLECTION = "registrations";

export async function registerForEvent(params: { eventId: string; userId: string }): Promise<string | null> {
  const db = getDb();
  // idempotent: check existing
  const q = query(
    collection(db, COLLECTION),
    where("eventId", "==", params.eventId),
    where("userId", "==", params.userId)
  );
  const existing = await getDocs(q);
  if (!existing.empty) {
    return existing.docs[0]!.id;
  }
  const docRef = await addDoc(collection(db, COLLECTION), {
    eventId: params.eventId,
    userId: params.userId,
    registeredAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function listByUser(userId: string): Promise<RegistrationDoc[]> {
  const db = getDb();
  const q = query(collection(db, COLLECTION), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) } as RegistrationDoc));
}

export async function listForEvent(eventId: string): Promise<RegistrationDoc[]> {
  const db = getDb();
  const q = query(collection(db, COLLECTION), where("eventId", "==", eventId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) } as RegistrationDoc));
}


