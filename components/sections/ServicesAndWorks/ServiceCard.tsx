"use client";
import type { Service } from "@/types/servicesAndWorks";

interface ServiceCardProps {
  service: Service;
  projectCount: number;
  onClick: () => void;
  disabled?: boolean;
}

export default function ServiceCard({
  service,
  projectCount,
  onClick,
  disabled,
}: ServiceCardProps) {
  const Icon = service.icon;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={`View ${service.name} projects`}
      className="group flex flex-col gap-5 p-6 rounded-3xl bg-neutral-0 dark:bg-neutral-7 border border-neutral-2 dark:border-neutral-6 hover:border-primary-5 hover:shadow-lg hover:shadow-primary-5/10 transition-all duration-200 text-left w-full h-full disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-5 focus-visible:outline-offset-2"
    >
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-full bg-neutral-7 dark:bg-neutral-6 flex items-center justify-center group-hover:bg-primary-5 transition-colors duration-200 shrink-0">
          <Icon className="w-5 h-5 text-neutral-0" />
        </div>
        <span className="text-xs font-medium text-primary-5 bg-primary-1 dark:bg-primary-9/20 border border-primary-2 dark:border-primary-8/30 rounded-full px-2.5 py-1 shrink-0">
          {projectCount} project{projectCount !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <h3 className="text-neutral-7 dark:text-neutral-0 font-semibold text-base leading-snug group-hover:text-primary-5 transition-colors duration-200">
          {service.name}
        </h3>
        <p className="text-neutral-5 dark:text-neutral-4 text-sm leading-relaxed">
          {service.shortDescription}
        </p>
      </div>
      <div className="flex items-center gap-1.5 text-primary-5 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span>View projects</span>
        <span>→</span>
      </div>
    </button>
  );
}
