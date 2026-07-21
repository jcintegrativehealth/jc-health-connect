// Client-side appointment request store — persisted in localStorage.
// Bridges the public /book flow, the admin /admin/appointments/new flow,
// and the admin appointments list. No backend yet.
import { useEffect, useState } from "react";

export type AppointmentRequest = {
  id: string;
  createdAt: string;
  source: "public" | "admin";
  date: string;
  time: string;
  patient: string;
  email?: string;
  phone?: string;
  type: string;
  service: string;
  state: string;
  lang: string;
  format: "In-person" | "Telehealth";
  duration: number;
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed";
  pay: "Pending" | "Paid" | "Partial" | "Overdue";
  notes?: string;
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

export function updateAppointmentStatus(
  id: string,
  status: AppointmentRequest["status"],
) {
  write(read().map((r) => (r.id === id ? { ...r, status } : r)));
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
