"use client";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
  useState,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageViewerProps {
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}

export default function ImageViewer({
  images,
  initialIndex = 0,
  onClose,
}: ImageViewerProps) {
  const [current, setCurrent] = useState(initialIndex);
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);
  const touchStartX = useRef(0);

  useLayoutEffect(() => {
    const root =
      document.getElementById("modal-root") ?? document.body;
    setPortalEl(root);
  }, []);

  const prev = useCallback(
    () => setCurrent((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );
  const next = useCallback(
    () => setCurrent((i) => (i + 1) % images.length),
    [images.length]
  );

  // Lock body scroll while open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);

  const dialog = (
    <div
      className="fixed inset-0 z-50 h-full lg:h-[75%] lg:w-[70%] mx-auto my-auto bg-black/75 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      {/* Step 1: large viewer — absolute insets so it can cover the section title (nearly full viewport) */}
      <div
        className="absolute inset-1 flex min-h-0 px-20 py-10 flex-col gap-5 sm:inset-2 md:inset-3"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const delta = e.changedTouches[0].clientX - touchStartX.current;
          if (delta > 50) prev();
          if (delta < -50) next();
        }}
      >
        <div className="flex w-full absolute right-5 top-5 shrink-0 justify-end">
          <button
            onClick={onClose}
            aria-label="Close image viewer"
            className="text-white/70 hover:text-white transition-colors cursor-pointer p-1 focus-visible:outline-2 focus-visible:outline-white rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative min-h-0  w-full flex-1 overflow-hidden rounded-2xl bg-neutral-8">
          <Image
            key={current}
            src={images[current]}
            alt={`Image ${current + 1} of ${images.length}`}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 100vw"
            priority
          />
        </div>

        {/* Counter dots */}
        {images.length > 1 && (
          <div className="flex shrink-0 items-center justify-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`rounded-full transition-all duration-200 cursor-pointer ${
                  i === current
                    ? "bg-white w-4 h-1.5"
                    : "bg-white/40 hover:bg-white/70 w-1.5 h-1.5"
                }`}
              />
            ))}
          </div>
        )}

        {/* Prev / Next */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-0 top-1/2 -translate-x-0 -translate-y-1/2 cursor-pointer rounded-full bg-black/40 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-black/65 hover:text-white focus-visible:outline-2 focus-visible:outline-white lg:-translate-x-10 md:p-2.5 xl:p-3.5"
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 lg:h-8 lg:w-8" />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-0 top-1/2 translate-x-0 -translate-y-1/2 cursor-pointer rounded-full bg-black/40 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-black/65 hover:text-white focus-visible:outline-2 focus-visible:outline-white lg:translate-x-10 md:p-2.5 xl:p-3.5"
            >
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6 lg:h-8 lg:w-8" />
            </button>
          </>
        )}
      </div>
    </div>
  );

  if (!portalEl) return null;
  return createPortal(dialog, portalEl);
}
