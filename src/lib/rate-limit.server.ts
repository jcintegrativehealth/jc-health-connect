// In-memory sliding-window rate limiter for public server functions.
// Per-instance only (resets on redeploy) — enough to blunt drive-by abuse of
// the public booking/comment/contact endpoints without external state.
import { getRequest } from "@tanstack/react-start/server";

const hits = new Map<string, number[]>();

export function clientIp(): string {
  const headers = getRequest()?.headers;
  const fwd = headers?.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return headers?.get("x-real-ip") || "unknown";
}

/** Throws when `key` exceeded `max` calls within `windowMs`. */
export function assertRateLimit(key: string, max: number, windowMs: number): void {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    throw new Error("Too many requests. Please wait a moment and try again.");
  }
  recent.push(now);
  hits.set(key, recent);

  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= windowMs)) hits.delete(k);
    }
  }
}
