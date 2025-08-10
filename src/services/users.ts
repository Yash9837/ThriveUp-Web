"use client";

import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import type { UserProfile, UserRole } from "@/types/models";

const COLLECTION = "users";



export async function updateRole(uid: string, role: UserRole) {
  const db = getDb();
  const ref = doc(db, COLLECTION, uid);
  await updateDoc(ref, { role, updatedAt: serverTimestamp() });
}

export async function getProfile(uid: string): Promise<UserProfile | null> {
  const db = getDb();
  const ref = doc(db, COLLECTION, uid);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as UserProfile) : null;
}


