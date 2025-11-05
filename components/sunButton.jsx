import React from "react";
import Image from "next/image";
import { useTheme } from "@/utils/ThemeContext";

export default function SunButton() {
  const { toggleTheme } = useTheme(); // Access the toggleTheme function from the context

  return (
    <button
      onClick={toggleTheme}
      className="p-3.5 cursor-pointer rounded-full border border-neutral-7 bg-neutral-7"
    >
      <Image
        className="w-4.5 h-4.5"
        src="/sun.svg"
        alt="sun"
        width="1920"
        height="1080"
      />
    </button>
  );
}
