"use client";

import { useSyncExternalStore } from "react";

const THRESHOLD_PX = 8;

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("scroll", onStoreChange, { passive: true });
  return () => window.removeEventListener("scroll", onStoreChange);
}

function getSnapshot() {
  if (typeof window === "undefined") return false;
  const y = window.scrollY || document.documentElement.scrollTop;
  return y > THRESHOLD_PX;
}

function getServerSnapshot() {
  return false;
}

/** True when the document has been scrolled past a small threshold (native window scroll). */
export function useDocumentScrolled() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
