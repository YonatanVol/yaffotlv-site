"use client";

import { useEffect, useRef } from "react";
import { track, usePageView } from "@/lib/analytics";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const sessionTracked = useRef(false);

  // Track the initial page view
  usePageView();

  // Track session start (once per mount)
  useEffect(() => {
    if (sessionTracked.current) return;
    sessionTracked.current = true;

    track("session_start", {
      page: window.location.pathname,
      locale: document.documentElement.lang || "en",
      screen: `${window.screen.width}x${window.screen.height}`,
    });
  }, []);

  return <>{children}</>;
}
