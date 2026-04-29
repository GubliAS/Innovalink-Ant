"use client";
import Image from "next/image";
import { ExternalLink, Play } from "lucide-react";
import type { Project, Service } from "@/types/servicesAndWorks";
import { WorkServicePill } from "../WorkServicePill";

interface MotionCardProps {
  project: Project;
  service: Service;
}

export default function MotionCard({ project, service }: MotionCardProps) {
  const thumbSrc = project.thumbnail ?? project.media;
  const videoHref = project.videoUrl?.trim();

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden bg-neutral-0 dark:bg-neutral-7 border border-neutral-2 dark:border-neutral-6 h-full">
      <div className="relative h-44 w-full bg-neutral-2 dark:bg-neutral-6 shrink-0 overflow-hidden group/thumb">
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
        {videoHref && (
          <a
            href={videoHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Watch ${project.name} on Google Drive`}
            className="absolute inset-0 z-5 flex items-center justify-center bg-black/0 hover:bg-black/25 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-primary-5 focus-visible:outline-offset-2"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/55 text-white shadow-md backdrop-blur-sm ring-1 ring-white/20 scale-100 group-hover/thumb:bg-black/65 group-hover/thumb:scale-105 transition-all duration-200">
              <Play
                className="w-5 h-5 ml-0.5 shrink-0"
                fill="currentColor"
                aria-hidden
              />
            </span>
          </a>
        )}
        {project.status && (
          <span
            className={`absolute top-3 right-3 z-10 text-xs font-semibold rounded-full px-2.5 py-1 ${
              project.status === "live"
                ? "bg-primary-5 text-neutral-0"
                : "bg-neutral-7 dark:bg-neutral-6 text-neutral-2"
            }`}
          >
            {project.status === "live" ? "Live" : "In Progress"}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 p-4 flex-1 min-w-0">
        <WorkServicePill>{service.name}</WorkServicePill>
        <h3 className="text-neutral-7 dark:text-neutral-0 font-semibold text-base leading-snug">
          {project.name}
        </h3>
        <p className="text-neutral-5 dark:text-neutral-4 text-sm leading-relaxed flex-1 min-h-0">
          {project.description}
        </p>
        {videoHref && (
          <div className="flex justify-end mt-auto pt-2">
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
          </div>
        )}
      </div>
    </div>
  );
}
