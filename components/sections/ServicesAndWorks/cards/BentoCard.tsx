"use client";
import { useState } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import type { Project, Service } from "@/types/servicesAndWorks";
import ImageViewer from "../ImageViewer";
import { WorkServicePill } from "../WorkServicePill";

// 5-cell bento (2 top + 3 bottom), padded inside an aspect-video container
// so it matches the software card image area exactly.
// Empty slots get a neutral placeholder — all cards are the same height.
const MAX_BENTO = 5;

interface BentoCellProps {
  src?: string | null;
  alt?: string;
  className?: string;
  onClick?: () => void;
  overflowCount?: number;
  children?: React.ReactNode;
}

function BentoCell({
  src,
  alt,
  className = "",
  onClick,
  overflowCount = 0,
  children,
}: BentoCellProps) {
  if (!src) {
    return (
      <div
        className={`rounded-xl bg-neutral-2 dark:bg-neutral-5 ${className}`}
      />
    );
  }
  return (
    <button
      onClick={onClick}
      className={`relative rounded-xl overflow-hidden group focus-visible:outline-2 focus-visible:outline-primary-5 ${className}`}
      aria-label={overflowCount > 0 ? "View all images" : "View full image"}
    >
      <Image
        src={src}
        alt={alt ?? ""}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        sizes="(max-width: 768px) 50vw, 260px"
        loading="lazy"
      />
      {overflowCount > 0 ? (
        <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
          <span className="text-white font-semibold text-sm">
            +{overflowCount} more
          </span>
        </div>
      ) : (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
      )}
      {children}
    </button>
  );
}

interface BentoCardProps {
  project: Project;
  service: Service;
}

export default function BentoCard({ project, service }: BentoCardProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const shots = project.screenshots ?? [];
  const overflow = shots.length - MAX_BENTO;
  const s = (i: number) => shots[i] ?? null;
  const open = (i: number) => {
    setViewerIndex(i);
    setViewerOpen(true);
  };

  return (
    <>
      <div className="flex flex-col rounded-2xl overflow-hidden bg-neutral-0 dark:bg-neutral-7 border border-neutral-2 dark:border-neutral-6 h-full">
        {/* Bento: wide → 3-row → wide */}
        <div
          className="grid grid-cols-3 gap-2 bg-neutral-1 dark:bg-neutral-6 p-2 shrink-0"
          style={{ gridTemplateRows: "90px 60px 70px" }}
        >
          {/* Row 1 — full-width wide image */}
          <BentoCell
            src={s(0)}
            alt={project.name}
            className="col-span-3"
            onClick={() => open(0)}
          >
            {project.status && s(0) && (
              <span
                className={`absolute top-2 left-2 text-[10px] font-semibold rounded-full px-2 py-0.5 ${
                  project.status === "live"
                    ? "bg-primary-5 text-neutral-0"
                    : "bg-neutral-7 text-neutral-2"
                }`}
              >
                {project.status === "live" ? "Live" : "In Progress"}
              </span>
            )}
          </BentoCell>

          {/* Row 2 — 3 equal thumbnails */}
          <BentoCell
            src={s(1)}
            alt={`${project.name} 2`}
            onClick={() => open(1)}
          />
          <BentoCell
            src={s(2)}
            alt={`${project.name} 3`}
            onClick={() => open(2)}
          />
          <BentoCell
            src={s(3)}
            alt={`${project.name} 4`}
            onClick={() => open(3)}
          />

          {/* Row 3 — full-width wide image (shows +N more if overflow) */}
          <BentoCell
            src={s(4)}
            alt={`${project.name} 5`}
            className="col-span-3"
            onClick={() => open(overflow > 0 ? MAX_BENTO : 4)}
            overflowCount={overflow > 0 ? overflow : 0}
          />
        </div>

        {/* Card body */}
        <div className="flex flex-col gap-2 p-4 flex-1 min-w-0">
          <WorkServicePill>{service.name}</WorkServicePill>
          <h3 className="text-neutral-7 dark:text-neutral-0 font-semibold text-base leading-snug">
            {project.name}
          </h3>
          <p className="text-neutral-5 dark:text-neutral-4 text-sm leading-relaxed flex-1 min-h-0">
            {project.description}
          </p>
          {project.documentUrl && (
            <div className="flex justify-end mt-auto pt-2">
              <a
                href={project.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${project.name} brand document`}
                className="flex items-center gap-1.5 text-sm font-medium text-primary-5 hover:text-primary-6 transition-colors duration-200 px-2 py-2 shrink-0 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-primary-5 focus-visible:outline-offset-2 rounded"
              >
                View Document
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>

      {viewerOpen && shots.length > 0 && (
        <ImageViewer
          images={shots}
          initialIndex={viewerIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </>
  );
}
