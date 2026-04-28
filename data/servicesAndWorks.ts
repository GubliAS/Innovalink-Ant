import SoftwareIcon from "@/components/icons/services/SoftwareIcon";
import ProductIcon from "@/components/icons/services/ProductIcon";
import MotionIcon from "@/components/icons/services/MotionIcon";
import BrandIcon from "@/components/icons/services/BrandIcon";
import type { ServicesAndWorksData } from "@/types/servicesAndWorks";

export const servicesAndWorksData: ServicesAndWorksData = {
  services: [
    {
      id: "software",
      name: "Innovative Software Solutions",
      shortDescription:
        "Custom development for your unique business requirements. We do it clean, fast and scalable.",
      icon: SoftwareIcon,
    },
    {
      id: "product",
      name: "Product Designs",
      shortDescription:
        "User-centric designs that feel effortless, are simple to use, easy to love, and made to grow with your business.",
      icon: ProductIcon,
    },
    {
      id: "motion",
      name: "Motion Designs",
      shortDescription:
        "Stories told through motion. Animations that capture attention and communicate effectively.",
      icon: MotionIcon,
    },
    {
      id: "brand",
      name: "Brand Development",
      shortDescription:
        "Your brand should stand out and stay consistent everywhere. We help you define your voice, look, and presence.",
      icon: BrandIcon,
    },
  ],
  projects: [
    // ── Software ──────────────────────────────────────────────────────────────
    {
      id: "project-1",
      name: "MASZ AFRICA Website",
      description: "Corporate website for a pan-African mining and industrial services company, showcasing services, partners, and achievements through a polished, animation-rich brand experience.",
      serviceId: "software",
      status: "live",
      media: "/img/works/MASZsoftware.png",
      liveUrl: "https://masz-africa-website.vercel.app",
    },
    {
      id: "project-2",
      name: "RONAN COLLECTIONS",
      description: "Editorial-style exhibition and e-commerce site for a curated art/collections brand, blending gallery aesthetics with a commerce-ready storefront.",
      serviceId: "software",
      status: "live",
      media: "/img/works/ronancollectionssoftware.png",
      liveUrl: "https://www.ronancollections.com/",
    },
    {
      id: "project-9",
      name: "SilverPalm Resort",
      description: "Immersive resort website showcasing world-class accommodations, dining, and experiences, designed to inspire bookings through cinematic visuals and effortless reservation flows.",
      serviceId: "software",
      status: "live",
      media: "/img/works/silverpalmresortsoftware.jpeg",
      liveUrl: "https://silverpalmresort.vercel.app/",
    },
    {
      id: "project-10",
      name: "SikaFlow POS",
      description: " Modern point-of-sale platform for managing sales, inventory, customers, and reporting, with role-based access for managers and cashiers in a fast, mobile-friendly interface.",
      serviceId: "software",
      status: "live",
      media: "/img/works/sikaflowsoftware.jpeg",
      liveUrl: "https://sikaflow-pos.vercel.app/login?callbackUrl=%2Fmanager",
    },
    {
      id: "project-11",
      name: "Ceenat Foundation ",
      description: "Nonprofit website for a Ghana-based humanitarian foundation, highlighting feeding programs, child welfare, and community outreach initiatives with integrated donation and volunteer flows.",
      serviceId: "software",
      status: "live",
      media: "/img/works/ceenatsoftware.png",
      liveUrl: "https://ceenat-foundation.vercel.app",
    },
    
    // ── Product Design ────────────────────────────────────────────────────────
    {
      id: "project-3",
      name: "UI/UX Design for business web app",
      description: "",
      serviceId: "product",
      status: "live",
      screenshots: [
        "/img/MASZ/Thumbnail.png",
        "/img/MASZ/Image-2.png",
        "/img/MASZ/Image-1.png",
        "/img/MASZ/Image-3.png",
        "/img/MASZ/Image-4.png",
        "/img/MASZ/Image-5.png",
        "/img/MASZ/Image-6.png",
        "/img/MASZ/Image-7.png",
        "/img/MASZ/Image-8.png",
      ],
    },
    {
      id: "project-4",
      name: "UX Redesign Project for children's educational app",
      description: "",
      serviceId: "product",
      status: "live",
      screenshots: [
        "/img/COMEPLAY/Image-7.png",
        "/img/COMEPLAY/Image-1.png",
        "/img/COMEPLAY/Image-2.png",
        "/img/COMEPLAY/Image-3.png",
        "/img/COMEPLAY/Image-4.png",
        "/img/COMEPLAY/Image-5.png",
        "/img/COMEPLAY/Image-6.png",
        "/img/COMEPLAY/Image-7.png",
      ],
    },
    {
      id: "project-12",
      name: "UI/UX design for modern freelance marketplace",
      description: "",
      serviceId: "product",
      status: "live",
      screenshots: [
        "/img/CREATECONNECT/Thumbnail.png",
        "/img/CREATECONNECT/Image-1.png",
        "/img/CREATECONNECT/Image-2.png",
        "/img/CREATECONNECT/Image-3.png",
        "/img/CREATECONNECT/Image-4.png",
        "/img/CREATECONNECT/Image-5.png",
        "/img/CREATECONNECT/Image-6.png",
        "/img/CREATECONNECT/Image-7.png",
        "/img/CREATECONNECT/Image-8.png",
        "/img/CREATECONNECT/Image-9.png",
      ],
    },
    {
      id: "project-13",
      name: "UI/UX design for curated art marketplace",
      description: "",
      serviceId: "product",
      status: "live",
      screenshots: [
        "/img/RONAN/Image-7.png",
        "/img/RONAN/Image-2.png",
        "/img/RONAN/Image-3.png",
        "/img/RONAN/Image-4.png",
        "/img/RONAN/Image-1.png",
        "/img/RONAN/Image-6.png",
        "/img/RONAN/Image-5.png",
        "/img/RONAN/Image-8.png",
      ],
    },
    // ── Motion Design ─────────────────────────────────────────────────────────
    {
      id: "project-5",
      name: "Technical Consultancy Web",
      description: "Motion piece for technical consultancy positioning and web presence.",
      serviceId: "motion",
      status: "live",
      thumbnail: "/motiondesign/technicalThumbnail.png",
      videoUrl:
        "https://drive.google.com/file/d/10NZqRINt_NijezOc5lsmGdTD50iEqINA/view?usp=sharing",
    },
    {
      id: "project-6",
      name: "MASZ brand identity",
      description: "Brand identity motion for MASZ AFRICA, built for clarity at 1080p.",
      serviceId: "motion",
      status: "live",
      thumbnail: "/motiondesign/maszThumbnail.png",
      videoUrl:
        "https://drive.google.com/file/d/14nUAkpoNTX6gAOXubEcRLzCEAsEqk51e/view?usp=sharing",
    },
    {
      id: "project-14",
      name: "Inovalink promo",
      description: "Promotional motion with voice-over for the Inovalink brand.",
      serviceId: "motion",
      status: "live",
      thumbnail: "/motiondesign/inovalinkThumbnail.png",
      videoUrl:
        "https://drive.google.com/file/d/1tj609iwRVbPD1SKjJQbiIKcMSr5L7Qu-/view?usp=sharing",
    },
    {
      id: "project-15",
      name: "GlowUp",
      description: "Energetic motion piece under the GlowUp concept.",
      serviceId: "motion",
      status: "live",
      thumbnail: "/motiondesign/glowupThumbnail.png",
      videoUrl:
        "https://drive.google.com/file/d/1L8DqdQbuH7wLcI-5oa5x6z9ePphb_3e1/view?usp=sharing",
    },
    {
      id: "project-16",
      name: "GEMINI",
      description: "Motion study and branding moment for the GEMINI piece.",
      serviceId: "motion",
      status: "live",
      thumbnail: "/motiondesign/geminiThumbnail.png",
      videoUrl:
        "https://drive.google.com/file/d/1uV95sJkLyf9C1TeGCJuDdIaTEppN85NI/view?usp=sharing",
    },
    {
      id: "project-17",
      name: "Crusher Seals Web",
      description: "Web-focused motion for Crusher Seals.",
      serviceId: "motion",
      status: "live",
      thumbnail: "/motiondesign/crusherThumbnail.png",
      videoUrl:
        "https://drive.google.com/file/d/1PmeyIKZ2I0CQUL9IFSPa1MjLvn6LTOuK/view?usp=sharing",
    },
    {
      id: "project-18",
      name: "AFEN logo animation",
      description: "Logo animation bringing the AFEN mark to life.",
      serviceId: "motion",
      status: "live",
      thumbnail: "/img/AFENbrand/Image-1.jpeg",
      videoUrl:
        "https://drive.google.com/file/d/1MeQ3a6-1XUBsxF8jZ0RjbDSY5VHmBhM7/view?usp=sharing",
    },
    // ── Brand Development ─────────────────────────────────────────────────────
    {
      id: "project-7",
      name: "Brand Identity Package for MASZ AFRICA",
      description: "Comprehensive brand identity system defining the visual language, logo, and design standards for a pan-African mining and industrial services company.",
      serviceId: "brand",
      screenshots: [
        "/img/MASZbrand/Image-5.png",
        "/img/MASZbrand/Image-2.png",
        "/img/MASZbrand/Image-3.png",
        "/img/MASZbrand/Image-4.png",
        "/img/MASZbrand/Image-1.png",
        "/img/MASZbrand/Image-6.png",
        "/img/MASZbrand/Image-5.png",
        "/img/MASZbrand/Image-8.png",
      ],
      documentUrl: "https://drive.google.com/file/d/11DX9uzyttrlI6tEqnSJycRlFPfxoehiv/view?usp=sharing",
    },
    {
      id: "project-8",
      name: "Brand Identity Package for AFEN",
      description: "Comprehensive brand identity system defining the visual language, logo, and design standards for a company.",
      serviceId: "brand",
      screenshots: [
        "/img/AFENbrand/Image-1.jpeg",
        "/img/AFENbrand/Image-2.jpeg",
        "/img/AFENbrand/Image-3.png",
        "/img/AFENbrand/Image-4.png",
        "/img/AFENbrand/Image-5.png",
        "/img/AFENbrand/Image-6.png",
       
      ],
      documentUrl: "https://drive.google.com/file/d/13BtBiQGCR7HoErTWxvf7at-R7d5t4xYl/view?usp=sharing",

    },
  ],
};
