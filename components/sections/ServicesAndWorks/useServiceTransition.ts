import { useRef } from "react";
import { gsap } from "gsap";

export function useServiceTransition() {
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const fadeOut = (element: HTMLElement | null, onComplete: () => void) => {
    tlRef.current?.kill();
    if (!element) {
      onComplete();
      return;
    }
    tlRef.current = gsap.timeline({ onComplete });
    tlRef.current.to(element, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      ease: "power2.in",
    });
  };

  const fadeIn = (
    element: HTMLElement | null,
    onComplete?: () => void,
    delay = 50
  ): (() => void) => {
    if (!element) {
      onComplete?.();
      return () => {};
    }
    const timer = setTimeout(() => {
      tlRef.current?.kill();
      gsap.set(element, { opacity: 0, y: -20 });
      tlRef.current = gsap.timeline({ onComplete });
      tlRef.current.to(element, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    }, delay);
    return () => clearTimeout(timer);
  };

  return { fadeOut, fadeIn };
}
