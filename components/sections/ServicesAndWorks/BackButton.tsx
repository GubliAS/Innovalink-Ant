"use client";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  serviceName: string;
  projectCount: number;
  onClick: () => void;
  disabled?: boolean;
}

export default function BackButton({
  serviceName,
  projectCount,
  onClick,
  disabled,
}: BackButtonProps) {
  return (
    <div className="flex items-center justify-between pr-5 gap-3 flex-wrap mb-6">
      <button
        onClick={onClick}
        disabled={disabled}
        aria-label="Back to services"
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-2 dark:border-neutral-6 bg-neutral-0 dark:bg-neutral-7 text-neutral-7 dark:text-neutral-0 text-sm font-medium hover:border-primary-5 hover:text-primary-5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-h-[44px]"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to services
      </button>
      <span className="text-neutral-5 dark:text-neutral-4 text-sm">
        <span className="font-semibold text-neutral-7 dark:text-neutral-0">
          {serviceName}
        </span>
        {" — "}
        {projectCount} project{projectCount !== 1 ? "s" : ""}
      </span>
    </div>
  );
}
