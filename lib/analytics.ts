"use client";

import { useEffect, useRef } from "react";

// ---------------------------------------------------------------------------
// Session ID — persisted per browser tab via sessionStorage
// ---------------------------------------------------------------------------

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  const KEY = "yaffotlv-session-id";
  let id = sessionStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(KEY, id);
  }
  return id;
}

// ---------------------------------------------------------------------------
// Debounce map — prevent the same event from firing more than once per 2 s
// ---------------------------------------------------------------------------

const lastFired = new Map<string, number>();
const DEBOUNCE_MS = 2000;

function shouldFire(event: string): boolean {
  const now = Date.now();
  const prev = lastFired.get(event) ?? 0;
  if (now - prev < DEBOUNCE_MS) return false;
  lastFired.set(event, now);
  return true;
}

// ---------------------------------------------------------------------------
// Core tracking function
// ---------------------------------------------------------------------------

export function track(event: string, metadata?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (!shouldFire(event)) return;

  const sessionId = getSessionId();

  // Fire-and-forget — never block the UI
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, event, metadata }),
    keepalive: true, // ensure the request completes even on page unload
  }).catch(() => {
    // Silently swallow — analytics must never break the app
  });
}

// ---------------------------------------------------------------------------
// React hook: automatic page view tracking
// ---------------------------------------------------------------------------

export function usePageView() {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    track("page_view", {
      page: window.location.pathname,
      referrer: document.referrer || undefined,
    });
  }, []);
}
