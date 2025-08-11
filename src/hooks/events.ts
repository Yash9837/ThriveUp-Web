"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listPublicEvents, getEventById, createEvent, updateEvent, deleteEvent, listEventsByOrganizer, type CreateEventPayload } from "@/services/events";
import { registerForEvent } from "@/services/registrations";

// Import the type from registrations service
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

export function useEvents() {
  const query = useQuery({ queryKey: ["events"], queryFn: listPublicEvents });
  return { ...query, events: query.data ?? [] };
}

export function useEvent(eventId: string | undefined) {
  const query = useQuery({
    queryKey: ["events", eventId],
    queryFn: () => (eventId ? getEventById(eventId) : Promise.resolve(null)),
    enabled: !!eventId,
  });
  return { ...query, event: query.data };
}

export function useRegister(eventId: string, userId?: string) {
  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: (registrationData: RegistrationDataRaw) => registerForEvent(registrationData, eventId, userId!),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["registrations", userId] });
    },
  });
  return mutation;
}

export function useCreateEvent() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEventPayload) => createEvent(payload),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["events"] });
      client.invalidateQueries({ queryKey: ["my-events"] });
    },
  });
}

export function useMyEvents(organizerUid: string | undefined) {
  console.log("useMyEvents - Organizer UID:", organizerUid);
  const q = useQuery({
    queryKey: ["my-events", organizerUid],
    queryFn: () => (organizerUid ? listEventsByOrganizer(organizerUid) : Promise.resolve([])),
    enabled: !!organizerUid,
  });
  console.log("useMyEvents - Query result:", q.data);
  console.log("useMyEvents - Query error:", q.error);
  return { ...q, events: q.data ?? [] };
}

export function useDeleteEvent() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEvent(id),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["events"] });
      client.invalidateQueries({ queryKey: ["my-events"] });
    },
  });
}

export function useUpdateEvent() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Record<string, unknown> }) => updateEvent(id, patch),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["events"] });
      client.invalidateQueries({ queryKey: ["my-events"] });
    },
  });
}


