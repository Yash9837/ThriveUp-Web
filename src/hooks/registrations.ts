"use client";

import { useQuery } from "@tanstack/react-query";
import { listByUser, listForEvent } from "@/services/registrations";
import { getEventById } from "@/services/events";
import type { RegistrationDoc } from "@/types/models";

type ExtendedRegistration = RegistrationDoc & { eventTitle?: string };

export function useMyRegistrations(userId: string | undefined) {
  const q = useQuery({
    queryKey: ["registrations", userId],
    queryFn: () => (userId ? listByUser(userId) : Promise.resolve([])),
    enabled: !!userId,
  });
  const withTitles = useQuery<ExtendedRegistration[]>({
    queryKey: ["registrations-with-events", userId],
    enabled: !!userId && !!q.data,
    queryFn: async () => {
      const res = await Promise.all(
        (q.data ?? []).map(async (r) => ({ r, ev: await getEventById(r.eventId) }))
      );
      return res.map(({ r, ev }) => ({ ...(r as RegistrationDoc), eventTitle: ev?.title ?? r.eventId }));
    },
  });
  return { ...withTitles, registrations: withTitles.data ?? [] };
}

export function useEventRegistrations(eventId: string | undefined) {
  const q = useQuery({
    queryKey: ["event-registrations", eventId],
    queryFn: () => (eventId ? listForEvent(eventId) : Promise.resolve([])),
    enabled: !!eventId,
  });
  return { ...q, registrations: q.data ?? [] };
}

import { getProfile } from "@/services/users";
import type { UserProfile } from "@/types/models";

export interface Attendee extends RegistrationDoc {
  profile?: UserProfile | null;
}

export function useEventAttendees(eventId: string | undefined) {
  const { registrations, isLoading: isLoadingRegs } = useEventRegistrations(eventId);

  const q = useQuery({
    queryKey: ["event-attendees-profiles", eventId, registrations.length],
    enabled: !!eventId && registrations.length > 0,
    queryFn: async () => {
      // Fetch profiles for all unique UIDs
      const uids = Array.from(new Set(registrations.map(r => r.uid)));
      const profiles = await Promise.all(uids.map(uid => getProfile(uid).catch(() => null)));
      const profileMap = new Map(uids.map((uid, i) => [uid, profiles[i]]));

      // Merge
      return registrations.map(r => ({
        ...r,
        profile: profileMap.get(r.uid) || null
      })) as Attendee[];
    },
    staleTime: 1000 * 60 * 5,
  });

  return {
    attendees: q.data ?? [],
    isLoading: isLoadingRegs || (registrations.length > 0 && q.isLoading)
  };
}


