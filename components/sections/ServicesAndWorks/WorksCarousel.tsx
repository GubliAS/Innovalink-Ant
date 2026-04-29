"use client";
import {
  forwardRef,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Project, Service, ServiceId } from "@/types/servicesAndWorks";
import ProjectCard from "./ProjectCard";
import BackButton from "./BackButton";

interface WorksCarouselProps {
  selectedServiceId: ServiceId;
  projects: Project[];
  services: Service[];
  onBack: () => void;
  disabled?: boolean;
}

const WorksCarousel = forwardRef<HTMLDivElement, WorksCarouselProps>(
  ({ selectedServiceId, projects, services, onBack, disabled }, ref) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [hasOverflow, setHasOverflow] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const filteredProjects = projects.filter(
      (p) => p.serviceId === selectedServiceId
    );
    const selectedService = services.find((s) => s.id === selectedServiceId)!;

    const getCardWidth = useCallback(() => {
      const track = trackRef.current;
      if (!track || track.children.length === 0) return 0;
      const card = track.children[0] as HTMLElement;
      return card.offsetWidth + 16; // card width + gap-4 (1rem = 16px)
    }, []);

    const scrollToIndex = (index: number) => {
      const track = trackRef.current;
      if (!track) return;
      const card = track.children[index] as HTMLElement;
      if (!card) return;
      track.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
    };

    const scrollByOne = (direction: "left" | "right") => {
      const track = trackRef.current;
      if (!track) return;
      const cardWidth = getCardWidth();
      if (cardWidth === 0) return;
      track.scrollBy({
        left: direction === "right" ? cardWidth : -cardWidth,
        behavior: "smooth",
      });
    };

    const EPS = 3;

    const syncTrackState = useCallback(() => {
      const track = trackRef.current;
      if (!track || track.children.length === 0) {
        setHasOverflow(false);
        setCanScrollLeft(false);
        setCanScrollRight(false);
        return;
      }
      const { scrollLeft, clientWidth, scrollWidth } = track;
      const overflow = scrollWidth > clientWidth + EPS;
      setHasOverflow(overflow);
      setCanScrollLeft(overflow && scrollLeft > EPS);
      setCanScrollRight(
        overflow && scrollLeft + clientWidth < scrollWidth - EPS
      );

      const cardWidth = getCardWidth();
      if (cardWidth > 0) {
        const index = Math.round(scrollLeft / cardWidth);
        setActiveIndex(
          Math.max(0, Math.min(index, filteredProjects.length - 1))
        );
      }
    }, [filteredProjects.length, getCardWidth]);

    useEffect(() => {
      const track = trackRef.current;
      if (!track) return;
      let rafId: number;
      const onScroll = () => {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(syncTrackState);
      };
      track.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        track.removeEventListener("scroll", onScroll);
        cancelAnimationFrame(rafId);
      };
    }, [syncTrackState]);

    // Reset position when service changes
    useEffect(() => {
      setActiveIndex(0);
      if (trackRef.current) trackRef.current.scrollLeft = 0;
    }, [selectedServiceId]);

    // Overflow + scroll extents (for hiding per-direction arrow buttons).
    useEffect(() => {
      const el = trackRef.current;
      if (!el || filteredProjects.length <= 1) {
        setHasOverflow(false);
        setCanScrollLeft(false);
        setCanScrollRight(false);
        return;
      }
      syncTrackState();
      const ro = new ResizeObserver(() => syncTrackState());
      ro.observe(el);
      window.addEventListener("resize", syncTrackState);
      return () => {
        ro.disconnect();
        window.removeEventListener("resize", syncTrackState);
      };
    }, [filteredProjects.length, selectedServiceId, syncTrackState]);

    const isEmpty = filteredProjects.length === 0;

    return (
      <div ref={ref}>
        <BackButton
          serviceName={selectedService.name}
          projectCount={filteredProjects.length}
          onClick={onBack}
          disabled={disabled}
        />

        {isEmpty ? (
          <div className="flex items-center justify-center min-h-[300px] rounded-3xl border border-neutral-2 dark:border-neutral-6 bg-neutral-0 dark:bg-neutral-7">
            <p className="text-neutral-5 dark:text-neutral-4 text-base text-center px-6 max-w-sm">
              No projects in this category yet.{" "}
              <a
                href="#contact"
                className="text-primary-5 font-semibold hover:underline"
              >
                Reach out
              </a>{" "}
              to be part of the next batch.
            </p>
          </div>
        ) : (
          <div
            role="region"
            aria-label={`${selectedService.name} projects carousel`}
            className="relative"
          >
            {/* Desktop arrows — only when overflow exists, each side only if more content that way */}
            {canScrollLeft && (
              <button
                onClick={() => scrollByOne("left")}
                aria-label="Previous project"
                className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-10 h-10 rounded-full bg-neutral-0 dark:bg-neutral-7 border border-neutral-2 dark:border-neutral-6 items-center justify-center hover:border-primary-5 hover:text-primary-5 transition-all duration-200 shadow-sm text-neutral-7 dark:text-neutral-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-5"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {canScrollRight && (
              <button
                onClick={() => scrollByOne("right")}
                aria-label="Next project"
                className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-10 h-10 rounded-full bg-neutral-0 dark:bg-neutral-7 border border-neutral-2 dark:border-neutral-6 items-center justify-center hover:border-primary-5 hover:text-primary-5 transition-all duration-200 shadow-sm text-neutral-7 dark:text-neutral-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-5"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Carousel track */}
            <div
              ref={trackRef}
              className="flex gap-4 overflow-x-auto pb-2 "
              style={{ scrollSnapType: "x mandatory", scrollBehavior: "smooth" }}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") scrollByOne("left");
                if (e.key === "ArrowRight") scrollByOne("right");
              }}
              aria-label="Scroll through projects"
            >
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex-none w-[85vw] sm:w-[60vw] md:w-[45vw] lg:w-[clamp(280px,38vw,460px)]"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <ProjectCard project={project} service={selectedService} />
                </div>
              ))}
            </div>

            {/* Dots indicator — only when overflow (same as arrow affordance) */}
            {hasOverflow && filteredProjects.length > 1 && (
              <div
                className="flex items-center justify-center gap-2 mt-5"
                role="tablist"
                aria-label="Carousel navigation"
              >
                {filteredProjects.map((_, i) => (
                  <button
                    key={i}
                    role="tab"
                    aria-selected={i === activeIndex}
                    aria-label={`Go to project ${i + 1}`}
                    onClick={() => scrollToIndex(i)}
                    className={`rounded-full transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-5 ${
                      i === activeIndex
                        ? "bg-primary-5 w-6 h-2"
                        : "bg-neutral-3 dark:bg-neutral-5 w-2 h-2 hover:bg-primary-3"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

WorksCarousel.displayName = "WorksCarousel";

export default WorksCarousel;
