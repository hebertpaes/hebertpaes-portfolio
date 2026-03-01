"use client";

import { useEffect } from "react";

type VitalName = "LCP" | "CLS" | "INP" | "FCP";

type VitalPayload = {
  name: VitalName;
  value: number;
  id: string;
  path: string;
  rating: "good" | "needs-improvement" | "poor";
};

function classify(name: VitalName, value: number): VitalPayload["rating"] {
  if (name === "CLS") {
    if (value <= 0.1) return "good";
    if (value <= 0.25) return "needs-improvement";
    return "poor";
  }

  if (name === "INP") {
    if (value <= 200) return "good";
    if (value <= 500) return "needs-improvement";
    return "poor";
  }

  if (name === "LCP") {
    if (value <= 2500) return "good";
    if (value <= 4000) return "needs-improvement";
    return "poor";
  }

  if (value <= 1800) return "good";
  if (value <= 3000) return "needs-improvement";
  return "poor";
}

function send(payload: VitalPayload) {
  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/telemetry/web-vitals", body);
    return;
  }

  fetch("/api/telemetry/web-vitals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => null);
}

export default function WebVitals() {
  useEffect(() => {
    if (typeof window === "undefined" || !("PerformanceObserver" in window)) return;

    const pagePath = window.location.pathname;
    let cls = 0;

    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const entry = entries[entries.length - 1] as PerformanceEntry & { startTime: number; id?: string };
      send({
        name: "LCP",
        value: Math.round(entry.startTime),
        id: entry.id || crypto.randomUUID(),
        path: pagePath,
        rating: classify("LCP", entry.startTime),
      });
    });

    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries() as Array<PerformanceEntry & { value?: number; hadRecentInput?: boolean }>) {
        if (!entry.hadRecentInput) cls += entry.value || 0;
      }

      send({
        name: "CLS",
        value: Number(cls.toFixed(4)),
        id: crypto.randomUUID(),
        path: pagePath,
        rating: classify("CLS", cls),
      });
    });

    const inpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries() as Array<PerformanceEntry & { duration?: number; interactionId?: number }>;
      const entry = entries[entries.length - 1];
      const duration = entry?.duration || 0;

      send({
        name: "INP",
        value: Math.round(duration),
        id: String(entry?.interactionId || crypto.randomUUID()),
        path: pagePath,
        rating: classify("INP", duration),
      });
    });

    const fcpObserver = new PerformanceObserver((entryList) => {
      const entry = entryList.getEntries()[0] as PerformanceEntry & { startTime: number; id?: string };
      if (!entry) return;
      send({
        name: "FCP",
        value: Math.round(entry.startTime),
        id: entry.id || crypto.randomUUID(),
        path: pagePath,
        rating: classify("FCP", entry.startTime),
      });
    });

    try {
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
      clsObserver.observe({ type: "layout-shift", buffered: true });
      inpObserver.observe({ type: "event", buffered: true });
      fcpObserver.observe({ type: "paint", buffered: true });
    } catch {
      // Browser not fully supporting all observer types.
    }

    return () => {
      lcpObserver.disconnect();
      clsObserver.disconnect();
      inpObserver.disconnect();
      fcpObserver.disconnect();
    };
  }, []);

  return null;
}
