"use client";
import { forwardRef } from "react";
import type { Service, ServiceId } from "@/types/servicesAndWorks";
import ServiceCard from "./ServiceCard";

interface ServicesGridProps {
  services: Service[];
  getProjectCount: (id: ServiceId) => number;
  onServiceSelect: (id: ServiceId) => void;
  disabled?: boolean;
}

const ServicesGrid = forwardRef<HTMLDivElement, ServicesGridProps>(
  ({ services, getProjectCount, onServiceSelect, disabled }, ref) => {
    return (
      <div
        ref={ref}
        role="list"
        aria-label="Our services"
        className="flex gap-4 overflow-x-auto pb-2 lg:grid pr-5 lg:grid-cols-4 lg:overflow-visible"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {services.map((service) => (
          <div
            key={service.id}
            role="listitem"
            className="flex-none w-[80%] sm:w-[60%] md:w-[45%] lg:w-auto"
            style={{ scrollSnapAlign: "start" }}
          >
            <ServiceCard
              service={service}
              projectCount={getProjectCount(service.id)}
              onClick={() => onServiceSelect(service.id)}
              disabled={disabled}
            />
          </div>
        ))}
      </div>
    );
  }
);

ServicesGrid.displayName = "ServicesGrid";

export default ServicesGrid;
