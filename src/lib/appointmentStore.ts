// Appointment store — same exported contract as the original localStorage
// version (HANDOFF §3), now backed by Supabase through the server functions in
// src/lib/appointments.functions.ts. Function names and types are locked; the
// storage-facing functions became async because they now cross the network.
import { useEffect, useState } from "react";
import {
  bookFollowUpFn,
  createAppointmentFn,
  getAppointmentFn,
  listAppointmentsFn,
  updateAppointmentFn,
} from "@/lib/appointments.functions";

export const APPOINTMENT_STATUSES = [
  "Pending",
  "Confirmed",
  "Checked In",
  "In Progress",
  "Completed",
  "Cancelled",
  "No Show",
  "Rescheduled",
] as const;
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export const PATIENT_TAGS = [
  "New patient",
  "Returning patient",
  "Follow-up",
  "Prospective",
  "Past patient",
  "VIP",
  "Cancelled",
] as const;
export type PatientTag = (typeof PATIENT_TAGS)[number];

export const PAYMENT_STATUSES = [
  "Pending",
  "Paid",
  "Partial",
  "Overdue",
  "Refunded",
  "Waived",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export type AppointmentRequest = {
  id: string;
  createdAt: string;
  updatedAt?: string;
  source: "public" | "admin";
  date: string;
  time: string;
  patient: string;
  patientTag?: PatientTag;
  email?: string;
  phone?: string;
  type: string;
  service: string;
  state: string;
  lang: string;
  format: "In-person" | "Telehealth";
  duration: number;
  status: AppointmentStatus;
  pay: PaymentStatus;
  notes?: string;
  meetingLink?: string;
  followUpId?: string;
};

// Client-side cache so the hooks keep their synchronous "rows" shape.
let cache: AppointmentRequest[] = [];
let cacheReady = false;
let cacheError: string | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

async function refresh(): Promise<void> {
  try {
    cache = await listAppointmentsFn();
    cacheReady = true;
    cacheError = null;
  } catch (err) {
    cacheReady = true;
    cacheError = err instanceof Error ? err.message : "Could not load appointments.";
  }
  notify();
}

function refreshSilently() {
  refresh().catch(() => {});
}

export async function listAppointments(): Promise<AppointmentRequest[]> {
  await refresh();
  if (cacheError) throw new Error(cacheError);
  return cache;
}

export async function getAppointment(id: string): Promise<AppointmentRequest | undefined> {
  const row = await getAppointmentFn({ data: { id } });
  return row ?? undefined;
}

export async function createAppointment(
  input: Omit<AppointmentRequest, "id" | "createdAt">,
): Promise<AppointmentRequest> {
  const record = await createAppointmentFn({ data: input });
  refreshSilently();
  return record;
}

export async function updateAppointment(
  id: string,
  patch: Partial<Omit<AppointmentRequest, "id" | "createdAt">>,
): Promise<AppointmentRequest> {
  // Explicit `undefined` means "clear this field" in the old localStorage
  // semantics; over the wire that becomes null.
  const wirePatch: Record<string, unknown> = {};
  for (const key of Object.keys(patch) as Array<keyof typeof patch>) {
    wirePatch[key] = patch[key] === undefined ? null : patch[key];
  }
  const updated = await updateAppointmentFn({ data: { id, patch: wirePatch } });
  refreshSilently();
  return updated;
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
): Promise<AppointmentRequest> {
  return updateAppointment(id, { status });
}

export async function bookFollowUp(
  parentId: string,
  input: Pick<
    AppointmentRequest,
    "date" | "time" | "type" | "service" | "format" | "duration"
  > &
    Partial<Pick<AppointmentRequest, "meetingLink" | "notes" | "patientTag">>,
): Promise<AppointmentRequest | undefined> {
  const created = await bookFollowUpFn({
    data: {
      parentId,
      date: input.date,
      time: input.time,
      type: input.type,
      service: input.service,
      format: input.format,
      duration: input.duration,
      meetingLink: input.meetingLink,
      notes: input.notes,
      patientTag: input.patientTag,
    },
  });
  refreshSilently();
  return created ?? undefined;
}

export function useAppointments(): AppointmentRequest[] {
  const [rows, setRows] = useState<AppointmentRequest[]>(() => cache);
  useEffect(() => {
    const sync = () => setRows(cache);
    listeners.add(sync);
    sync();
    refreshSilently();
    return () => {
      listeners.delete(sync);
    };
  }, []);
  return rows;
}

export function useAppointment(id: string): AppointmentRequest | undefined {
  const rows = useAppointments();
  return rows.find((r) => r.id === id);
}

/** Loading/error state for screens that need to tell "empty" from "loading". */
export function useAppointmentsStatus(): { ready: boolean; error: string | null } {
  const [state, setState] = useState(() => ({ ready: cacheReady, error: cacheError }));
  useEffect(() => {
    const sync = () => setState({ ready: cacheReady, error: cacheError });
    listeners.add(sync);
    sync();
    return () => {
      listeners.delete(sync);
    };
  }, []);
  return state;
}
