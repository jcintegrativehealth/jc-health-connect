// Front-end only admin gate. Credentials are hardcoded for now — replace
// with Lovable Cloud auth when the backend is wired.
import { useEffect, useState } from "react";

const KEY = "jc.admin.session.v1";
const ADMIN_EMAIL = "jcintegrativehealth3@gmail.com";
const ADMIN_PASSWORD = "JCclinic2026//";

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((fn) => fn());
}

export function signInAdmin(email: string, password: string): boolean {
  const ok =
    email.trim().toLowerCase() === ADMIN_EMAIL &&
    password === ADMIN_PASSWORD;
  if (ok && typeof window !== "undefined") {
    window.localStorage.setItem(
      KEY,
      JSON.stringify({ email: ADMIN_EMAIL, at: Date.now() }),
    );
    emit();
  }
  return ok;
}

export function signOutAdmin() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  emit();
}

export function isAdminAuthed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return Boolean(window.localStorage.getItem(KEY));
  } catch {
    return false;
  }
}

export function useAdminAuth() {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setAuthed(isAdminAuthed());
    setReady(true);
    const sync = () => setAuthed(isAdminAuthed());
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
  return { authed, ready };
}
