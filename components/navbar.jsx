"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import SunButton from "./sunButton";
import Button from "./button";
import { useState } from "react";
import { useTheme } from "@/utils/ThemeContext";
import ContactModal from "./ui/contactModal";
import { gsap } from "gsap";

export default function Navbar() {
  const { theme } = useTheme(); // Access the theme from the context
    const [isContactModalOpened, setIsContactModalOpened] = useState(false);


  return (
    <>
      <nav className="fixed bg-transparent px-4 w-full z-10 top-0">
        <div className="flex w-full max-w-7xl place-self-center justify-between">
          <img
            className="w-24 h-24"
            src={
              theme === "dark"
                ? "/INOVALINK_LOGO_ON_WHITE.png"
                : "/INOVALINK_LOGO_ON_BLACK.png"
            }
            alt="Logo"
            width="1920"
            height="1080"
          />
          <div className="flex gap-5 items-center">
            <SunButton/>
            <Button
              onClick={() => setIsContactModalOpened(true)}
              text="Contact"
              className=" bg-primary-5  hover:bg-primary-6 focus:bg-primary-4.1 text-foundation-white  dark:text-foundation-black dark:bg-neutral-0 dark:hover:bg-neutral-2 dark:focus:bg-neutral-2"
            />
          </div>
          <ContactModal
            isOpen={isContactModalOpened}
            onClose={() => setIsContactModalOpened(false)}
          />
        </div>
      </nav>
    </>
  );
}
 