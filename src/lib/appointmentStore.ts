// Client-side appointment store — persisted in localStorage.
// Manual workflow: the clinician updates status, patient tag, meeting link,
// and books a follow-up by hand. No backend yet.
import { useEffect, useState } from "react";

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

const KEY = "jc.appointments.v1";
const listeners = new Set<() => void>();

function read(): AppointmentRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AppointmentRequest[]) : [];
  } catch {
    return [];
  }
}

function write(rows: AppointmentRequest[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(rows));
    listeners.forEach((fn) => fn());
  } catch {
    /* ignore quota */
  }
}

function nextId() {
  const rows = read();
  const nums = rows
    .map((r) => Number(r.id.replace(/^A-/, "")))
    .filter((n) => Number.isFinite(n));
  const max = nums.length ? Math.max(...nums) : 9000;
  return `A-${max + 1}`;
}

export function listAppointments(): AppointmentRequest[] {
  return read().sort((a, b) => (a.date + a.time < b.date + b.time ? 1 : -1));
}

export function getAppointment(id: string): AppointmentRequest | undefined {
  return read().find((r) => r.id === id);
}

export function createAppointment(
  input: Omit<AppointmentRequest, "id" | "createdAt">,
): AppointmentRequest {
  const record: AppointmentRequest = {
    ...input,
    id: nextId(),
    createdAt: new Date().toISOString(),
  };
  write([record, ...read()]);
  return record;
}

export function updateAppointment(
  id: string,
  patch: Partial<Omit<AppointmentRequest, "id" | "createdAt">>,
) {
  write(
    read().map((r) =>
      r.id === id ? { ...r, ...patch, updatedAt: new Date().toISOString() } : r,
    ),
  );
}

export function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  updateAppointment(id, { status });
}

export function bookFollowUp(
  parentId: string,
  input: Pick<
    AppointmentRequest,
    "date" | "time" | "type" | "service" | "format" | "duration"
  > &
    Partial<Pick<AppointmentRequest, "meetingLink" | "notes" | "patientTag">>,
): AppointmentRequest | undefined {
  const parent = getAppointment(parentId);
  if (!parent) return undefined;
  const follow = createAppointment({
    source: "admin",
    date: input.date,
    time: input.time,
    patient: parent.patient,
    patientTag: input.patientTag ?? "Follow-up",
    email: parent.email,
    phone: parent.phone,
    type: input.type,
    service: input.service,
    state: parent.state,
    lang: parent.lang,
    format: input.format,
    duration: input.duration,
    status: "Confirmed",
    pay: "Pending",
    notes: input.notes,
    meetingLink: input.meetingLink,
  });
  updateAppointment(parentId, { followUpId: follow.id });
  return follow;
}

export function useAppointments(): AppointmentRequest[] {
  const [rows, setRows] = useState<AppointmentRequest[]>(() => []);
  useEffect(() => {
    setRows(listAppointments());
    const sync = () => setRows(listAppointments());
    listeners.add(sync);
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) sync();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(sync);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  return rows;
}

export function useAppointment(id: string): AppointmentRequest | undefined {
  const rows = useAppointments();
  return rows.find((r) => r.id === id);
}
