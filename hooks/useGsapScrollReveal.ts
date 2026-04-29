"use client";

import { RefObject, useEffect, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Options = {
  y?: number;
  duration?: number;
  start?: string;
  once?: boolean;
  triggerRef?: RefObject<HTMLElement | null>;
};

/**
 * Fade/slide in when the trigger scrolls into view (normal document scroll).
 */
export function useGsapScrollReveal<T extends HTMLElement>(
  ref: RefObject<T | null>,
  options: Options = {}
) {
  const {
    y = 48,
    duration = 0.75,
    start = "top 85%",
    once = true,
    triggerRef,
  } = options;

  useLayoutEffect(() => {
    const animEl = ref.current;
    if (!animEl) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(animEl, { opacity: 1, y: 0, clearProps: "opacity,transform" });
      return;
    }

    gsap.set(animEl, { opacity: 0, y });
  }, [ref, y]);

  useEffect(() => {
    const animEl = ref.current;
    const triggerEl = triggerRef?.current ?? animEl;
    if (!animEl || !triggerEl) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.to(animEl, {
        opacity: 1,
        y: 0,
        duration,
        ease: "power2.out",
        scrollTrigger: {
          trigger: triggerEl,
          start,
          once,
          invalidateOnRefresh: true,
        },
      });
    }, triggerEl);

    const refresh = () => ScrollTrigger.refresh();
    requestAnimationFrame(refresh);

    return () => ctx.revert();
  }, [ref, triggerRef, y, duration, start, once]);
}
