import type { ComponentType } from "react";

export type ServiceId = "software" | "product" | "motion" | "brand";

export type Project = {
  id: string;
  name: string;
  description: string;
  serviceId: ServiceId;
  status?: "live" | "in-progress";
  // software — single screenshot + live link
  media?: string;
  liveUrl?: string;
  // motion — poster thumbnail + full video on Google Drive (or any URL)
  thumbnail?: string;
  videoUrl?: string;
  // product & brand — bento grid of screenshots
  screenshots?: string[];
  // brand only — link to brand document (opens in new tab)
  documentUrl?: string;
};

export type Service = {
  id: ServiceId;
  name: string;
  shortDescription: string;
  icon: ComponentType<{ className?: string }>;
};

export type ServicesAndWorksData = {
  services: Service[];
  projects: Project[];
};
