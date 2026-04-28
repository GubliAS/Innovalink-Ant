"use client";
import { useEffect, useRef, useCallback, useState } from "react";
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
  const touchStartX = useRef(0);

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      <div
        className="relative flex flex-col items-center w-full max-w-lg mx-4 gap-3"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const delta = e.changedTouches[0].clientX - touchStartX.current;
          if (delta > 50) prev();
          if (delta < -50) next();
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close image viewer"
          className="self-end text-white/70 hover:text-white transition-colors cursor-pointer p-1 focus-visible:outline-2 focus-visible:outline-white rounded"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image — compact, rounded */}
        <div className="relative w-full h-[40vh] max-h-[320px] rounded-2xl overflow-hidden bg-neutral-8">
          <Image
            key={current}
            src={images[current]}
            alt={`Image ${current + 1} of ${images.length}`}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 100vw, 512px"
            priority
          />
        </div>

        {/* Counter dots */}
        {images.length > 1 && (
          <div className="flex items-center gap-2">
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
              className="absolute left-0 top-[calc(50%-1.5rem)] -translate-x-1 md:-translate-x-10 text-white hover:text-white transition-colors cursor-pointer p-1.5 bg-black/40 hover:bg-black/65 backdrop-blur-sm rounded-full focus-visible:outline-2 focus-visible:outline-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-0 top-[calc(50%-1.5rem)] translate-x-1 md:translate-x-10 text-white hover:text-white transition-colors cursor-pointer p-1.5 bg-black/40 hover:bg-black/65 backdrop-blur-sm rounded-full focus-visible:outline-2 focus-visible:outline-white"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
