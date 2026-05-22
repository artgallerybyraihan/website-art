"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Send one analytics event to the backend (fire-and-forget)
export function trackEvent(type, payload = {}) {
  if (typeof window === "undefined") return;
  try {
    const body = JSON.stringify({ type, payload });
    // Use sendBeacon if available (works during page unload), else fetch
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {}
}

// Hook: tracks pageview + time-on-page + exit-page automatically
export function useAnalytics() {
  const pathname = usePathname();
  const enteredAt = useRef(Date.now());

  useEffect(() => {
    // Small delay to ensure component is fully mounted
    const timer = setTimeout(() => {
      trackEvent("pageview", {
        page: pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        country: "",
      });
    }, 100);

    enteredAt.current = Date.now();

    return () => {
      clearTimeout(timer);
      const seconds = Math.round((Date.now() - enteredAt.current) / 1000);
      if (seconds > 1) {
        trackEvent("time_on_page", { page: pathname, seconds });
        trackEvent("exit_page", { page: pathname });
      }
    };
  }, [pathname]);
}
