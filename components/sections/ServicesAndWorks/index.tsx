"use client";
import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import { gsap } from "gsap";
import { servicesAndWorksData } from "@/data/servicesAndWorks";
import type { ServiceId } from "@/types/servicesAndWorks";
import ServicesGrid from "./ServicesGrid";
import WorksCarousel from "./WorksCarousel";
import { useServiceTransition } from "./useServiceTransition";
import { setServicesWorksSectionInView } from "@/hooks/servicesWorksSectionInViewStore";
import { useGsapScrollReveal } from "@/hooks/useGsapScrollReveal";

export default function ServicesAndWorks() {
  const { services, projects } = servicesAndWorksData;

  const [selectedServiceId, setSelectedServiceId] =
    useState<ServiceId | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const worksRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useGsapScrollReveal(sectionRef, {
    y: 40,
    duration: 0.8,
    start: "top 88%",
  });

  // Track whether a transition triggered this render (skip on initial mount)
  const pendingFadeIn = useRef(false);

  const { fadeOut, fadeIn } = useServiceTransition();

  const getProjectCount = useCallback(
    (id: ServiceId) => projects.filter((p) => p.serviceId === id).length,
    [projects]
  );

  // Section header entry animation via IntersectionObserver
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    gsap.set(header, { opacity: 0, y: 40 });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(header, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" });
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  // Content area entry animation
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    gsap.set(content, { opacity: 0, y: 24 });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(content, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            delay: 0.15,
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  const handleServiceSelect = (id: ServiceId) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    fadeOut(servicesRef.current, () => {
      pendingFadeIn.current = true;
      setSelectedServiceId(id);
    });
  };

  const handleBack = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    fadeOut(worksRef.current, () => {
      pendingFadeIn.current = true;
      setSelectedServiceId(null);
    });
  };

  // After selectedServiceId changes: set new element invisible before paint,
  // then animate it in after commit.
  useLayoutEffect(() => {
    if (!pendingFadeIn.current) return;

    if (selectedServiceId !== null && worksRef.current) {
      // WorksCarousel just mounted — worksRef has style opacity:0 but also set via GSAP
      gsap.set(worksRef.current, { opacity: 0, y: -20 });
    } else if (selectedServiceId === null && servicesRef.current) {
      // ServicesGrid came back into relative flow — set invisible before paint
      gsap.set(servicesRef.current, { opacity: 0, y: -20 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedServiceId]);

  useEffect(() => {
    if (!pendingFadeIn.current) return;
    pendingFadeIn.current = false;

    const target =
      selectedServiceId !== null ? worksRef.current : servicesRef.current;
    const cleanup = fadeIn(target, () => setIsTransitioning(false), 30);
    return cleanup;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedServiceId]);

  // Drive navbar translucency only while this section is in view (native intersection, not animated scroll).
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setServicesWorksSectionInView(entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: "-64px 0px 0px 0px",
      }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      setServicesWorksSectionInView(false);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services-and-works"
      className="w-full min-h-dvh scroll-mt-20 bg-neutral-0 dark:bg-neutral-7 flex flex-col justify-center pt-24 pb-30 md:pb-8 px-4 md:px-8 lg:px-16 overflow-hidden"
      aria-label="Services and works"
    >
      <div className="max-w-6xl w-full mx-auto">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-8">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary-5 bg-primary-1 dark:bg-primary-9/20 border border-primary-2 dark:border-primary-8/30 rounded-full px-4 py-1.5 mb-4">
            Our Work
          </span>
          <h2 className="text-neutral-7 dark:text-neutral-0 text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            Services <span className="text-primary-5">&amp;</span> Works
          </h2>
          <p className="mt-4 text-neutral-5 dark:text-neutral-4 text-base max-w-xl mx-auto">
            From software to brand — explore what we build and see our work in
            action.
          </p>
        </div>

        {/* Content area — relative + min-height keeps section stable during transitions */}
        <div ref={contentRef} className=" relative min-h-[360px]">
          {/*
           * ServicesGrid is always in the DOM.
           * When works view is active it goes position:absolute so it doesn't
           * affect layout; ServicesGrid height defines the min-height baseline.
           */}
          <div
            ref={servicesRef}
            className={
              selectedServiceId !== null
                ? "absolute w-full  pointer-events-none invisible"
                : ""
            }
          >
            <ServicesGrid
              services={services}
              getProjectCount={getProjectCount}
              onServiceSelect={handleServiceSelect}
              disabled={isTransitioning}
            />
          </div>

          {/* WorksCarousel conditionally rendered; starts invisible via style */}
          {selectedServiceId !== null && (
            <div className="" ref={worksRef} style={{ opacity: 0 }}>
              <WorksCarousel
                selectedServiceId={selectedServiceId}
                projects={projects}
                services={services}
                onBack={handleBack}
                disabled={isTransitioning}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
