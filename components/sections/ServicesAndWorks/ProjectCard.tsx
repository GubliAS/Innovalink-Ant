"use client";
import type { Project, Service } from "@/types/servicesAndWorks";
import SoftwareCard from "./cards/SoftwareCard";
import MotionCard from "./cards/MotionCard";
import BentoCard from "./cards/BentoCard";

interface ProjectCardProps {
  project: Project;
  service: Service;
}

export default function ProjectCard({ project, service }: ProjectCardProps) {
  switch (project.serviceId) {
    case "software":
      return <SoftwareCard project={project} service={service} />;
    case "motion":
      return <MotionCard project={project} service={service} />;
    case "product":
    case "brand":
      return <BentoCard project={project} service={service} />;
  }
}
