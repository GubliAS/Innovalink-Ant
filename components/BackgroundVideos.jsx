"use client";

import { useTheme } from "@/utils/ThemeContext";

export default function BackgroundVideos() {
  const { theme } = useTheme();

  return (
    <>
     
      <video
        id="background-video"
        autoPlay
        loop
        muted
   playsInline // ✅ prevents iOS from opening the player
        preload="auto"
        src={
            theme === "dark"
              ? "/Darkmode%20Bg%202k.webm"
              : "/Lightmode%20Bg%202k.webm"
          }
        className={`fixed inset-0 w-full h-screen object-cover lg:object-fill z-[-1]`}
       />
        
    </>
  );
}
