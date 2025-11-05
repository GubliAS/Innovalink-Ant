"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import IconButton from "../components/button+icon";
import ArrowUpRight from "../components/arrow-up-right.svg";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const whoWeAreSectionRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [whoWeAreVisible, setWhoWeAreVisible] = useState(false);

  const handlePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) video.pause();
    else video.play();
    setIsPlaying(!isPlaying);
  };

  // Pause and reset video whenever Who We Are section becomes invisible
useEffect(() => {
  const video = videoRef.current;
  if (!video) return;

  if (!whoWeAreVisible) {
    video.pause();
    video.currentTime = 0;
    setIsPlaying(false);
  }
}, [whoWeAreVisible]);


  useEffect(() => {
    // Main cinematic timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".sections-container",
        start: "top top",
        end: "+=600", // how long the "scroll" lasts
        scrub: true,
        pin: true, // keeps the container fixed
        onUpdate: (self) => {
          // When we're past 40% of the scroll, show Who We Are section
          if (self.progress > 0.1) {
            setWhoWeAreVisible(true);
          } else {
            setWhoWeAreVisible(false);
          }
        },
      },
    });

    // Animate hero section scaling out
    tl.to(".hero-section", {
      scale: 0.6,
      opacity: 0,
      ease: "power2.inOut",
      duration: 0.5,
    })
      // Then bring in the "Who We Are" section
      .fromTo(
        ".who-we-are-section",
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, ease: "power2.inOut", duration: 1 },
        "-=0.5"
      );

    // Rotate green box infinitely
    gsap.to(".rotate-45", {
      rotation: "+=360",
      repeat: -1,
      duration: 6,
      ease: "linear",
    });

    // Intro animations (on mount)
    const introTl = gsap.timeline();
    introTl
      .from(".hero-heading", {
        y: 75,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      })
      .from(
        ".coming-soon",
        {
          y: 75,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.6"
      )
      .from(
        ".hero-paragraph",
        {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.4"
      )
      .from(
        ".hero-input-group",
        {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.6"
      )
      .from(
        ".hero-text-arrow",
        {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.5"
      )
      .to(".hero-text-arrow", {
        y: "+=15",
        repeat: -1,
        yoyo: true,
        duration: 1,
        ease: "easeInOut",
      });

    // Animate the scroll-to-view-more button to fade out earlier
    gsap.to(".scroll-to-view-more", {
      opacity: 0,
      scrollTrigger: {
        trigger: ".hero-section",
        start: "bottom 80%", // Adjusted to fade out earlier
        end: "bottom 60%",
        scrub: true,
      },
    });

    
    // Animate elements in the Who We Are section when the hero section is almost out of view
    ScrollTrigger.create({
      trigger: ".hero-section",
      start: "bottom 90%", // Trigger when the bottom of the hero section is 90% in view
      onEnter: () => {
        const whoWeAreTl = gsap.timeline();
        whoWeAreTl
          .from(".who-we-are-section h1", {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power2.out",
          })
          .from(
            ".who-we-are-section p",
            {
              y: 50,
              opacity: 0,
              duration: 0.5,
              ease: "power2.out",
            },
            "-=0.3" // Delay after the heading animation
          )
          .from(
            ".video",
            {
              y: 50,
              opacity: 0,
              duration: 0.5,
              ease: "power2.out",
            },
            "-=0.1" // Delay after the paragraph animation
          );
      },
    });

    // Reset video to the start when it finishes playing
    const video = videoRef.current;
    if (video) {
      video.addEventListener("ended", () => {
        video.currentTime = 0;
        setIsPlaying(false);
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      if (video) {
        video.removeEventListener("ended", () => {
          video.currentTime = 0;
          setIsPlaying(false);
        });
      }
    };
  }, []);

  return (
    <div className="sections-container relative h-screen overflow-hidden dark:bg-black  text-white">
      {/* HERO SECTION */}
      <section
        ref={heroSectionRef}
        className="hero-section absolute inset-0 flex flex-col items-center  pt-36"
        style={{
          zIndex: whoWeAreVisible ? 0 : 20,
          pointerEvents: whoWeAreVisible ? "none" : "auto",
        }}
      >
        <div className="mx-auto flex flex-col items-center gap-4 max-w-[583px] justify-center">
          <h3 className="text-primary-6 tracking-[22.2px] text-xl font-light dark:text-neutral-0 hero-heading">
            INOVALINK WEBSITE
          </h3>
          <h1 className="dark:text-neutral-0 text-neutral-6 items-center flex flex-col text-9xl font-bold coming-soon">
            <span className="flex">
              <span>C</span>
              <div
                className="w-[68px] place-self-center rotate-45 mx-5 h-[68px]"
                style={{
                  background:
                    "linear-gradient(257deg, #09C00E 47.19%, #045A07 109.91%)",
                }}
              ></div>
              <span>MING</span>
            </span>
            <span>SOON</span>
          </h1>
          <p className="dark:text-neutral-4 text-neutral-6 text-[14px] text-center hero-paragraph">
            <span className="text-primary-5 font-bold">
              The wait won't be long.
            </span>{" "}
            We're creating something with heart, a space where innovation meets
            purpose. From software solutions that drive seamless business
            growth, to motion and graphic designs that boost engagement and
            attract clients, to brand development that captures the essence of
            who you are. Everything we create is designed to move your business
            forward. We design. We code. We create. We build what inspires
            businesses, empowers communities, and shapes cultures, ideas that
            spark connection, fuel growth, and leave a lasting impact. Something
            bold, beautiful, and transformative is on the horizon.{" "}
            <span className="text-primary-5 font-bold">Stay close.</span>
          </p>
          <div className="pt-2.5 flex gap-1 hero-input-group">
            <input
              className="border rounded-[42px] py-2.5 px-7 placeholder:text-[13px] text-neutral-4 dark:border-[#3f3f3f] border-neutral-4 w-[292px]"
              placeholder="Enter your email"
              type="email"
              name="email"
            />
            <IconButton
              text="Join the Waitlist"
              icon={<ArrowUpRight className="w-4 text-white" />}
              onClick={() => alert("Button clicked!")}
              className="bg-primary-6 text-white"
              style={{
                background: "linear-gradient(90deg, #09C00E 0%, #045A07 100%)",
                boxShadow: "0 1px 2px 0 rgba(10, 13, 18, 0.05)",
              }}
            />
          </div>
        </div>
      </section>
      <div
        className="max-w-[81px] flex flex-col items-center text-center gap-1.5 bottom-[60px] absolute place-self-center scroll-to-view-more"
        style={{
          zIndex: whoWeAreVisible ? 0 : 20,
          pointerEvents: whoWeAreVisible ? "none" : "auto",
        }}
      >
        <h3 className="dark:text-neutral-0 text-primary-0 hero-text-arrow">
          Scroll to view more
        </h3>
        <div className="w-6 h-12 bg-neutral-7 rounded-[37px] items-center hero-text-arrow flex justify-center">
          <Image
            className="w-[11.4px] h-[20.3px]"
            src="/arrowdown.svg"
            width="1920"
            height="1080"
            alt="down"
          />
        </div>
      </div>

      {/* WHO WE ARE SECTION */}
      <section
        ref={whoWeAreSectionRef}
        className="who-we-are-section absolute inset-0 flex flex-col pt-36  text-black opacity-0 scale-75"
        style={{
          zIndex: whoWeAreVisible ? 10 : 0,
          pointerEvents: whoWeAreVisible ? "auto" : "none",
          visibility: whoWeAreVisible ? "visible" : "hidden",
        }}
      >
        <div className="flex flex-col gap-16 h-fit">
          <div className="text-center flex flex-col gap-2.5 mx-auto max-w-[793px]">
            <div className="max-w-[574px] mx-auto">
              <h1 className="dark:text-neutral-0 text-neutral-6  text-[40px] font-bold">
                Who We Are
              </h1>
              <p className="dark:text-neutral-4 text-neutral-5 text-[14px]">
                We are{" "}
                <span className="text-primary-5 font-bold">intentional</span>{" "}
                with designs. We build with{" "}
                <span className="text-primary-5 font-bold">precision</span> and
                move ideas forward with{" "}
                <span className="text-primary-5 font-bold">innovation</span>.
                This below is a short video that captures our vision and what we
                offer. Hit play and discover what makes InovaLink different.
              </p>
            </div>
          </div>

          <div
            className="max-w-[793px] video mx-auto"
            style={{ filter: "drop-shadow(0 4px 21.9px rgba(0, 0, 0, 0.15))" }}
          >
            <div className="h-[3px] max-w-[1000px] mx-auto bg-linear-to-r dark:from-black dark:via-primary-5 dark:to-black from-neutral-1 via-primary-5 to-neutral-1" />
            <div className="relative w-full max-w-[800px] mx-auto">
              <video
                ref={videoRef}
                src="/InovaLink Promo Video 1_voice over.webm"
                className="w-full cursor-pointer rounded-[14px]"
                onClick={handlePlay}
              />

              {!isPlaying && (
                <button
                  onClick={handlePlay}
                  className="absolute inset-0 playButton flex items-center h-fit my-auto justify-center group cursor-pointer"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src="/eclipseLg.svg"
                      alt="Play"
                      width={80}
                      height={80}
                      className="opacity-90 group-hover:scale-110 w-[82px] h-[82px] transition-transform duration-400"
                    />
                    <Image
                      src="/eclipseSm.png"
                      alt="Play"
                      width={80}
                      height={80}
                      className="opacity-90 absolute group-hover:scale-110 w-[54.3px] h-[54.3px] transition-transform duration-500"
                    />
                    <Image
                      src="/play.svg"
                      alt="Play"
                      width={80}
                      height={80}
                      className="opacity-90 absolute group-hover:scale-110 w-4 h-4 transition-transform duration-600"
                    />
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
