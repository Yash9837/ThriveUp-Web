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


