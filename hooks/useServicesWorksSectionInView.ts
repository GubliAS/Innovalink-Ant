"use client";

import { useSyncExternalStore } from "react";
import {
  getServicesWorksSectionInViewSnapshot,
  subscribeServicesWorksSectionInView,
} from "./servicesWorksSectionInViewStore";

/** True while the Services & Works section intersects the viewport (native IntersectionObserver). */
export function useServicesWorksSectionInView() {
  return useSyncExternalStore(
    subscribeServicesWorksSectionInView,
    getServicesWorksSectionInViewSnapshot,
    () => false
  );
}
