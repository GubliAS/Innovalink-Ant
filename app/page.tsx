"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import IconButton from "../components/button+icon";
import ArrowUpRight from "../components/arrow-up-right.svg";
import Image from "next/image";
import WaitlistModal from "@/components/ui/waitlistModal";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [whoWeAreVisible, setWhoWeAreVisible] = useState(false);
  const [isWaitlistModalOpened, setIsWaitlistModalOpened] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string }>({
    type: "",
    text: "",
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: data.message });
        setEmail("");

        setTimeout(() => {
          setMessage({ type: "", text: "" });
        }, 5000);

        setIsWaitlistModalOpened(true);
      } else {
        setMessage({ type: "error", text: data.message });
        setTimeout(() => {
          setMessage({ type: "", text: "" });
        }, 15000);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) video.pause();
    else video.play();

    setIsPlaying(!isPlaying);
  };

  // Pause and reset video when Who We Are section becomes invisible
  useEffect(() => {
    const video = videoRef.current;
    if (video && !whoWeAreVisible) {
      video.pause();
      video.currentTime = 0;
      setIsPlaying(false);
    }
  }, [whoWeAreVisible]);

  // Keep custom play button state in sync with actual video state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const togglePlayButton = () => setIsPlaying(!video.paused);
    video.addEventListener("play", togglePlayButton);
    video.addEventListener("pause", togglePlayButton);

    return () => {
      video.removeEventListener("play", togglePlayButton);
      video.removeEventListener("pause", togglePlayButton);
    };
  }, []);

  // Main scroll + animation logic
  useEffect(() => {
    // Cinematic scroll timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".sections-container",
        start: "top top",
        end: "+=600",
        scrub: true,
        pin: true,
        onUpdate: (self) => {
          setWhoWeAreVisible(self.progress > 0.1);
        },
      },
    });

    // Animate hero section out
    tl.to(".hero-section", {
      scale: 0.6,
      opacity: 0,
      ease: "power2.inOut",
      duration: 0.5,
    }).fromTo(
      ".who-we-are-section",
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, ease: "power2.inOut", duration: 1 },
      "-=0.5"
    );

    // Infinite rotation for green box
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
        { y: 75, opacity: 0, duration: 1, ease: "power2.out" },
        "-=0.6"
      )
      .from(
        ".hero-paragraph",
        { y: 50, opacity: 0, duration: 1, ease: "power2.out" },
        "-=0.4"
      )
      .from(
        ".hero-input-group",
        { y: 50, opacity: 0, duration: 1, ease: "power2.out" },
        "-=0.6"
      )
      .from(
        ".hero-text-arrow",
        { y: 50, opacity: 0, duration: 1, ease: "power2.out" },
        "-=0.5"
      )
      .to(".hero-text-arrow", {
        y: "+=15",
        repeat: -1,
        yoyo: true,
        duration: 1,
        ease: "easeInOut",
      });

    // Fade out scroll indicator early
    gsap.to(".scroll-to-view-more", {
      opacity: 0,
      scrollTrigger: {
        trigger: ".hero-section",
        start: "bottom 80%",
        end: "bottom 60%",
        scrub: true,
      },
    });

    // Animate "Who We Are" section content
    ScrollTrigger.create({
      trigger: ".hero-section",
      start: "bottom 90%",
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
            "-=0.3"
          )
          .from(
            ".greenline",
            {
              y: 50,
              opacity: 0,
              duration: 0.5,
              ease: "power2.out",
            },
            "-=0.1"
          )
          .from(
            ".video",
            {
              y: 50,
              opacity: 0,
              duration: 0.5,
              ease: "power2.out",
            },
            "-=0.1"
          );
      },
    });

    // Reset video after playback ends
    const video = videoRef.current;
    const handleVideoEnd = () => {
      if (video) {
        video.currentTime = 0;
        setIsPlaying(false);
      }
    };
    video?.addEventListener("ended", handleVideoEnd);

    const handleFullscreenChange = () => {
      const isFullscreen = !!document.fullscreenElement;
      if (isFullscreen) {
        // Temporarily disable ScrollTrigger refresh & pin updates
        ScrollTrigger.config({ ignoreMobileResize: true });
        ScrollTrigger.getAll().forEach((trigger) => trigger.disable(false));
      } else {
        // Re-enable ScrollTrigger after exiting fullscreen
        ScrollTrigger.getAll().forEach((trigger) => trigger.enable(false));
        ScrollTrigger.refresh(true);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      video?.removeEventListener("ended", handleVideoEnd);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    let scrollYBeforeFocus = 0;
    let restoringScroll = false;

    const handleFocus = () => {
      // Save current scroll position so we can restore it after blur
      scrollYBeforeFocus = window.scrollY;

      // Temporarily disable ScrollTrigger updates without unpinning DOM
      ScrollTrigger.config({ ignoreMobileResize: true });
      ScrollTrigger.getAll().forEach((trigger) => {
        trigger.disable(false, false);
      });

      // Let the user scroll freely while typing
      document.body.style.overflow = "auto";
    };

    const handleBlur = () => {
      // Wait a little for the keyboard to close and viewport to settle
      restoringScroll = true;
      setTimeout(() => {
        // Restore scroll position so the viewport doesn't jump
        window.scrollTo(0, scrollYBeforeFocus);

        // Re-enable ScrollTrigger and refresh layout
        ScrollTrigger.getAll().forEach((trigger) => {
          trigger.enable(false, false);
        });
        ScrollTrigger.refresh(true);

        // Restore normal scroll control
        document.body.style.overflow = "";
        restoringScroll = false;
      }, 400); // 300–400ms works well for iOS/Android
    };

    const inputs = document.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      input.addEventListener("focus", handleFocus);
      input.addEventListener("blur", handleBlur);
    });

    return () => {
      inputs.forEach((input) => {
        input.removeEventListener("focus", handleFocus);
        input.removeEventListener("blur", handleBlur);
      });
    };
  }, []);

  return (
    <div
      className={`sections-container relative h-screen overflow-hidden bg-transparent text-white ${
        isWaitlistModalOpened ? "no-pointer-events" : ""
      }`}
    >
      {" "}
      {/* HERO SECTION */}
      <section
        className="hero-section absolute inset-0 flex flex-col items-center pt-36"
        style={{
          zIndex: whoWeAreVisible ? 0 : 20,
          pointerEvents: whoWeAreVisible ? "none" : "auto",
        }}
      >
        <div className="mx-auto flex flex-col px-[15px] md:px-0 items-center gap-4 max-w-[583px] justify-center">
          <div>
            <h3 className="text-primary-6 tracking-[11px] text-center  md:tracking-[22.2px] w-full text-[11px] md:text-xl font-light dark:text-neutral-0 hero-heading">
              INOVALINK WEBSITE
            </h3>
            <h1 className="dark:text-neutral-0 text-neutral-6 items-center flex flex-col text-[40px] md:text-9xl font-bold coming-soon">
              <span className="flex">
                <span>C</span>
                <div
                  className="md:w-[68px] w-5 h-5 place-self-center rotate-45 mx-1 md:mx-5 md:h-[68px]"
                  style={{
                    background:
                      "linear-gradient(257deg, #09C00E 47.19%, #045A07 109.91%)",
                  }}
                ></div>
                <span>MING</span>
                <span className="md:hidden ml-2">SOON</span>
              </span>
              <span className="hidden md:block">SOON</span>
            </h1>

            <p className="dark:text-neutral-4 text-neutral-6 text-[14px] text-center hero-paragraph">
              <span className="text-primary-5 font-bold">
                The wait won't be long.
              </span>{" "}
              We're creating something with heart, a space where innovation
              meets purpose. From software solutions that drive seamless
              business growth, to motion and graphic designs that boost
              engagement and attract clients, to brand development that captures
              the essence of who you are. Everything we create is designed to
              move your business forward. We design. We code. We create. We
              build what inspires businesses, empowers communities, and shapes
              cultures, ideas that spark connection, fuel growth, and leave a
              lasting impact. Something bold, beautiful, and transformative is
              on the horizon.{" "}
              <span className="text-primary-5 font-bold">Stay close.</span>
            </p>
          </div>
          <div className="pt-2.5 hero-input-group space-y-1 w-full">
            <form
              onSubmit={handleSubmit}
              className=" flex flex-col md:flex-row gap-2.5 md:gap-1 "
            >
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
                className={`border rounded-[42px] py-2.5 px-5 bg-neutral-0 dark:bg-neutral-7/30 placeholder:text-sm placeholder:text-neutral-4 text-neutral-4 dark:text-neutral-2 flex-1   ${
                  message.type === "error"
                    ? "border-error-5"
                    : "dark:border-neutral-5 border-neutral-4 "
                }`}
              />
              <IconButton
                type="submit"
                disabled={loading}
                text={loading ? "Joining..." : "Join the Waitlist"}
                icon={!loading && <ArrowUpRight className="w-4 text-white" />}
                className=" text-white max-w-[161px] mx-auto bg-linear-to-r from-[#09C00E] to-[#045A07] "
                style={{
                  boxShadow: "0 1px 2px 0 rgba(10, 13, 18, 0.05)",
                }}
              />
            </form>
            <p
              className={`mt-2 px-6 text-sm min-h-5 ${
                message.text
                  ? message.type === "success"
                    ? "text-green-500"
                    : "text-red-500"
                  : ""
              }`}
            >
              {message.text}
            </p>
          </div>
        </div>
      </section>
      {/* SCROLL INDICATOR */}
      <div
        className="max-w-[81px] flex flex-col items-center text-center gap-1.5 bottom-10 md:bottom-[60px] absolute left-1/2 transform -translate-x-1/2 scroll-to-view-more"
        style={{
          zIndex: whoWeAreVisible ? 0 : 20,
          pointerEvents: whoWeAreVisible ? "none" : "auto",
        }}
      >
        <h3 className="dark:text-neutral-0 leading-tight text-neutral-0 hero-text-arrow">
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
        className="who-we-are-section absolute inset-0 flex flex-col pt-36 px-[15px] text-black opacity-0 scale-75"
        style={{
          zIndex: whoWeAreVisible ? 10 : 0,
          pointerEvents: whoWeAreVisible ? "auto" : "none",
          visibility: whoWeAreVisible ? "visible" : "hidden",
        }}
      >
        <div className="flex flex-col gap-[37px] md:gap-16  h-fit">
          <div className="text-center flex flex-col gap-2.5 mx-auto max-w-[793px]">
            <div className="max-w-[574px] mx-auto">
              <h1 className="dark:text-neutral-0 text-neutral-6 text-2xl md:text-[40px] font-bold">
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

          {/* Line SVG behind the video */}
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <Image
              src="/greenLine.svg"
              alt="Decorative Line"
              width={1920}
              height={1080}
              className="greenline"
            />
          </div>
          <div
            className="max-w-[793px] video mx-auto "
            style={{ filter: "drop-shadow(0 4px 21.9px rgba(0, 0, 0, 0.15))" }}
          >
            <div className="h-[3px]  mx-4   bg-linear-to-r dark:from-black/30 dark:via-primary-5 dark:to-black/30 from-neutral-1/30 via-primary-5 to-neutral-1/30" />
            <div className="relative w-full min-h-60 rounded-[14px] overflow-hidden ">
              <video
                controls
                ref={videoRef}
                src="/InovaLink Promo Video 1_voice over.webm"
                className="w-full cursor-pointer h-full object-cover"
              />
              {!isPlaying && (
                <div className="absolute inset-0 w-full h-full flex items-center justify-center ">
                  <Image
                    className="absolute inset-0 scale-110 w-full h-full object-cover"
                    src="/videoThumbnail.png"
                    width={1920}
                    height={1080}
                    alt="thumbnail"
                  />

                  <button
                    onClick={handlePlay}
                    className="absolute inset-0 flex items-center justify-center group cursor-pointer"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image
                        src="/eclipseLg.svg"
                        alt="Play"
                        width={82}
                        height={82}
                        className="opacity-90 group-hover:scale-110 transition-transform duration-400"
                      />
                      <Image
                        src="/eclipseSm.png"
                        alt="Play"
                        width={54}
                        height={54}
                        className="opacity-90 absolute group-hover:scale-110 transition-transform duration-500"
                      />
                      <Image
                        src="/play.svg"
                        alt="Play"
                        width={16}
                        height={16}
                        className="opacity-90 absolute group-hover:scale-110 transition-transform duration-600"
                      />
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <WaitlistModal
        isOpen={isWaitlistModalOpened}
        onClose={() => setIsWaitlistModalOpened(false)}
      />
    </div>
  );
}
