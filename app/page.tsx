"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import IconButton from "../components/iconButton";
import ArrowUpRight from "../components/arrow-up-right.svg";

export default function Home() {
  useEffect(() => {
    // Rotate the green box infinitely
    gsap.to(".rotate-45", {
      rotation: "+=360",
      repeat: -1,
      duration: 2,
      ease: "linear",
    });
  }, []);

  return (
    <>
      <div className="bg-white dark:bg-black h-screen w-full py-52 ">
        <div className=" mx-auto flex flex-col items-center gap-4 max-w-[583px] justify-center">
          <h3 className="text-primary-6 tracking-[22.2px] text-xl font-light dark:text-neutral-0">
            INOVALINK WEBSITE
          </h3>
          <h1 className="dark:text-neutral-0 text-neutral-6 items-center flex flex-col text-9xl font-bold">
            <span className="flex">
              <span>C</span>
              <div className="w-[68px] place-self-center rotate-45 mx-5  h-[68px] bg-primary-6"></div>
              <span>MING</span>
            </span>
            <span>SOON</span>
          </h1>
          <p className="dark:text-neutral-4 text-neutral-6 text-[14px] text-center ">
            <span className="text-primary-5">The wait won’t be long.</span>{" "}
            We're creating something with heart, a space where innovation meets
            purpose. From software solutions that drive seamless business
            growth, to motion and graphic designs that boost engagement and
            attract clients, to brand development that captures the essence of
            who you are. Everything we create is designed to move your business
            forward. We design. We code. We create. We build what inspires
            businesses, empowers communities, and shapes cultures, ideas that
            spark connection, fuel growth, and leave a lasting impact. Something
            bold, beautiful, and transformative is on the horizon. 
            <span className="text-primary-5">Stay close.</span>
          </p>
          <div className="pt-2.5 flex gap-1">
            <input
              className="border rounded-[42px] py-2.5 px-7 placeholder:text-[13px] text-neutral-4 dark:border-[#3f3f3f] border-neutral-4  w-[292px]"
              placeholder="Enter your email"
              type="email"
              name="email"
            />
            <IconButton
              text="Join the Waitlist"
              icon={<ArrowUpRight className="w-4 text-white" />} // Pass an icon as a React element
              onClick={() => alert("Button clicked!")}
              className="bg-primary-6 text-white"
            />
          </div>
        </div>
      </div>
    </>
  );
}
