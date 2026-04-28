"use client";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import type { Project, Service } from "@/types/servicesAndWorks";

interface MotionCardProps {
  project: Project;
  service: Service;
}

export default function MotionCard({ project, service }: MotionCardProps) {
  const thumbSrc = project.thumbnail ?? project.media;
  const videoHref = project.videoUrl?.trim();

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden bg-neutral-0 dark:bg-neutral-7 border border-neutral-2 dark:border-neutral-6 h-full">
      <div className="relative h-44 w-full bg-neutral-2 dark:bg-neutral-6 shrink-0 overflow-hidden">
        {thumbSrc && (
          <Image
            src={thumbSrc}
            alt={project.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 90vw, (max-width: 1024px) 50vw, 480px"
            loading="lazy"
          />
        )}
        {project.status && (
          <span
            className={`absolute top-3 right-3 text-xs font-semibold rounded-full px-2.5 py-1 ${
              project.status === "live"
                ? "bg-primary-5 text-neutral-0"
                : "bg-neutral-7 dark:bg-neutral-6 text-neutral-2"
            }`}
          >
            {project.status === "live" ? "Live" : "In Progress"}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 p-4 flex-1">
        <div className="flex flex-col gap-1">
          <h3 className="text-neutral-7 dark:text-neutral-0 font-semibold text-base leading-snug">
            {project.name}
          </h3>
          <p className="text-neutral-5 dark:text-neutral-4 text-sm leading-relaxed">
            {project.description}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3 mt-auto pt-2">
          <span className="text-xs font-medium bg-primary-5 text-neutral-0 rounded-full px-3 py-1 shrink min-w-0 truncate">
            {service.name}
          </span>
          {videoHref && (
            <a
              href={videoHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Watch ${project.name} on Google Drive`}
              className="flex items-center gap-1.5 text-sm font-medium text-primary-5 hover:text-primary-6 transition-colors duration-200 px-2 py-2 shrink-0 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-primary-5 focus-visible:outline-offset-2 rounded"
            >
              Watch on Drive
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
