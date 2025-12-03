"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import IconButton from "../components/button+icon";
import ArrowUpRight from "../components/arrow-up-right.svg";
import Image from "next/image";
import WaitlistModal from "@/components/ui/successWaitlistModal";
import { showToast } from "@/components/ui/toast";
import { CircleAlert } from "lucide-react";
import { useTheme } from "@/utils/ThemeContext";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function Home() {
  const { theme } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [whoWeAreVisible, setWhoWeAreVisible] = useState(false);
  const [isWaitlistModalOpened, setIsWaitlistModalOpened] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState("");
  const errorRef = useRef<HTMLDivElement | null>(null);

  const dummyImages = [
    "https://i.pinimg.com/1200x/b9/af/d2/b9afd2925b48ae6891138f8b4de78413.jpg",
    "https://i.pinimg.com/736x/7e/83/0e/7e830e9c49dee63d546ba2b376523d30.jpg",
    "https://i.pinimg.com/736x/ff/6c/e3/ff6ce308bb9e5d2cc514116aa1d33815.jpg",
    "https://i.pinimg.com/736x/2d/11/01/2d1101af52ac9ef6a7be4cd0acf5fdf3.jpg",
    "https://i.pinimg.com/736x/5f/d4/bb/5fd4bbf49dbf74fe45c019567f348a0b.jpg",
  ];

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;
    if (errorRef.current && !errorRef.current.contains(target)) {
      setFieldError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFieldError("");

    if (!email.trim()) {
      setFieldError("Email is required");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setEmail("");
        setIsWaitlistModalOpened(true);
      } else {
        if (
          data.message.includes("valid email") ||
          data.message.includes("email provider") ||
          data.message.includes("Email already registered")
        ) {
          setFieldError(data.message);
          setTimeout(() => {
            setFieldError("");
          }, 10000);
        } else {
          showToast(data.message, "error");
        }
      }
    } catch (error) {
      showToast("Something went wrong. Please try again.", "error");
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

  useEffect(() => {
    const video = videoRef.current;
    if (video && !whoWeAreVisible) {
      video.pause();
      video.currentTime = 0;
      setIsPlaying(false);
    }
  }, [whoWeAreVisible]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const togglePlayButton = () => setIsPlaying(!video.paused);
    video.addEventListener("play", togglePlayButton);
    video.addEventListener("pause", togglePlayButton);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      video.removeEventListener("play", togglePlayButton);
      video.removeEventListener("pause", togglePlayButton);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    if (!theme) return;

    const animationTimeout = setTimeout(() => {
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

      tl.to(".hero-section", {
        scale: 0.6,
        opacity: 0,
        ease: "power2.inOut",
        duration: 0.5,
      })
        // fade the CTA out at the same time
        .to(
          ".scroll-to-view-more",
          { autoAlpha: 0, y: 20, duration: 0.4, ease: "power2.out" },
          "<" // sync with previous tween
        )
        .fromTo(
          ".who-we-are-section",
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, ease: "power2.inOut", duration: 1 },
          "-=0.5"
        );

      gsap.to(".rotate-45", {
        rotation: "+=360",
        repeat: -1,
        duration: 12,
        ease: "linear",
      });

      gsap.set(
        [
          ".hero-heading",
          ".coming-soon",
          ".hero-paragraph",
          ".hero-input-group",
          ".hero-text-arrow",
        ],
        {
          opacity: 0,
          y: 75,
        }
      );

      const introTl = gsap.timeline({ delay: 0.1 });
      introTl
        .to(".hero-heading", {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
        })
        .to(
          ".coming-soon",
          { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
          "-=0.6"
        )
        .to(
          ".hero-paragraph",
          { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
          "-=0.4"
        )
        .to(
          ".hero-input-group",
          { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
          "-=0.6"
        )
        .to(
          ".hero-text-arrow",
          { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
          "-=0.5"
        )
        .to(".hero-text-arrow", {
          y: "+=15",
          repeat: -1,
          yoyo: true,
          duration: 1,
          ease: "easeInOut",
        });
    }, 50);

    return () => {
      clearTimeout(animationTimeout);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [theme]);

  useEffect(() => {
    let scrollYBeforeFocus = 0;
    let restoringScroll = false;

    const handleFocus = () => {
      scrollYBeforeFocus = window.scrollY;

      ScrollTrigger.config({ ignoreMobileResize: true });
      ScrollTrigger.getAll().forEach((trigger) => {
        trigger.disable(false, false);
      });

      document.body.style.overflow = "auto";
    };

    const handleBlur = () => {
      restoringScroll = true;
      setTimeout(() => {
        window.scrollTo(0, scrollYBeforeFocus);

        ScrollTrigger.getAll().forEach((trigger) => {
          trigger.enable(false, false);
        });
        ScrollTrigger.refresh(true);

        document.body.style.overflow = "";
        restoringScroll = false;
      }, 400);
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

  const scrollToWhoWeAre = () => {
    gsap.to(window, {
      duration: 1.5,
      scrollTo: {
        y: 600,
        autoKill: false,
      },
      ease: "power2.inOut",
    });
  };

  return (
    <div
      className={`sections-container relative h-dvh  overflow-hidden! bg-transparent text-white ${
        isWaitlistModalOpened ? "no-pointer-events" : ""
      }`}
    >
      <section
        className="hero-section absolute inset-0 flex flex-col items-center pt-52 md:pt-40 lg:pt-32 xl:pt-36"
        style={{
          zIndex: whoWeAreVisible ? 0 : 20,
          pointerEvents: whoWeAreVisible ? "none" : "auto",
        }}
      >
        <div className="mx-auto flex flex-col px-4 md:px-0 items-center gap-[25px] max-w-[583px] w-full justify-center">
          <div className="w-full flex flex-col gap-[15px] md:gap-0">
            <div className="w-full flex flex-col  items-center">
              <h3 className="text-primary-6 tracking-[11px] leading-[15px] text-center w-fit -mr-[11px] md:-mr-3.5 lg:-mr-[22.2px]  md:tracking-[14px] lg:tracking-[22.2px]  text-[12px] text-sm md:text-lg lg:text-xl font-light dark:text-neutral-0 hero-heading">
                INOVALINK WEBSITE
              </h3>
              <h1 className="md:hidden dark:text-neutral-0 text-neutral-6 w-full items-center flex flex-col text-hero-clamp font-bold coming-soon">
                <span className="flex leading-[92.188%] ">
                  <span className="dark:bg-clip-text dark:text-transparent dark:bg-linear-to-b from-white via-white via-75% to-[#999]">
                    C
                  </span>
                  <div
                    className="md:w-[68px] w-5 h-5 sm:w-7 sm:h-7 place-self-center rotate-45 mx-1 sm:mx-2 md:mx-4 md:h-[68px]"
                    style={{
                      background:
                        "linear-gradient(257deg, #09C00E 47.19%, #045A07 109.91%)",
                    }}
                  ></div>
                  <span className="dark:bg-clip-text dark:text-transparent dark:bg-linear-to-b from-white via-white via-75% to-[#999]">
                    MING
                  </span>
                  <span className="md:hidden ml-2 dark:bg-clip-text dark:text-transparent dark:bg-linear-to-b from-white via-white via-75% to-black">
                    SOON
                  </span>
                </span>
                <span className="hidden md:block dark:bg-clip-text dark:text-transparent dark:bg-linear-to-b from-white via-white via-70% to-black">
                  SOON
                </span>
              </h1>

              <h1 className="dark:text-neutral-0 text-neutral-6 w-full items-center hidden md:flex flex-col md:text-8xl lg:text-9xl font-bold coming-soon">
                <span className="flex leading-[92.188%] ">
                  <span className="dark:bg-clip-text dark:text-transparent dark:bg-linear-to-b from-white via-white via-75% to-[#999]">
                    C
                  </span>
                  <div
                    className="md:w-[50px] md:h-[50px] lg:w-[68px] lg:h-[68px] w-4 h-4 sm:w-8 sm:h-8 place-self-center rotate-45 mx-1 sm:mx-2 md:mx-4 "
                    style={{
                      background:
                        "linear-gradient(257deg, #09C00E 47.19%, #045A07 109.91%)",
                    }}
                  ></div>
                  <span className="dark:bg-clip-text dark:text-transparent dark:bg-linear-to-b from-white via-white via-75% to-[#999]">
                    MING
                  </span>
                  <span className="md:hidden ml-2 dark:bg-clip-text dark:text-transparent dark:bg-linear-to-b from-white via-white via-75% to-black">
                    SOON
                  </span>
                </span>
                <span className="hidden md:block dark:bg-clip-text dark:text-transparent dark:bg-linear-to-b from-white via-white via-70% to-black">
                  SOON
                </span>
              </h1>
            </div>

            <p className="dark:text-neutral-4 text-neutral-5 text-[14px] px-2.5 leading-4 max-w-[374px] sm:max-w-[450px] mx-auto text-center hero-paragraph">
              <span className="text-primary-5 font-semibold">
                The wait won’t be long.
              </span>{" "}
              We’re crafting a space where innovation meets purpose — from
              seamless software to bold design and branding that move your
              business forward. Something bold, beautiful, and transformative is
              on the horizon.
              <span className="text-primary-5 font-semibold">Stay close!</span>
            </p>
          </div>
          <div className=" hero-input-group flex flex-col gap-6 items-center justify-center  w-full">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center md:items-start md:flex-row gap-2.5 md:gap-[5px] w-full max-w-[400px] md:max-w-[480px] lg:max-w-[583px]"
            >
              <div
                ref={errorRef}
                className="relative flex flex-col items-start justify-start space-y-1 md:flex-1 w-full"
              >
                <input
                  type="text"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldError("");
                  }}
                  placeholder="Enter your email"
                  disabled={loading}
                  className={`w-full border focus:outline-none rounded-[42px] py-2.5 px-4 bg-neutral-0 dark:bg-neutral-7/30 placeholder:text-sm placeholder:text-neutral-4 text-neutral-5 dark:text-neutral-2  ${
                    fieldError
                      ? "border-error-5 border-2"
                      : "dark:border-[#3f3f3f] border-neutral-4 focus:border-primary-5 dark:focus:border-neutral-0 focus:border-2"
                  }`}
                />
                {fieldError && (
                  <div>
                    <p className="mt-1.5 text-sm px-2 text-error-5">
                      {fieldError}
                    </p>
                    <div className="absolute top-3 right-3">
                      <CircleAlert className="w-5 h-5 text-error-4" />
                    </div>
                  </div>
                )}
              </div>
              <IconButton
                type="submit"
                disabled={loading}
                text={loading ? "Joining..." : "Join the Waitlist"}
                icon={!loading && <ArrowUpRight className="w-4 text-white" />}
                className=" h-fit text-white  mx-auto bg-linear-to-r from-[#09C00E] to-[#045A07] hover:opacity-80 md:shrink-0"
                style={{
                  boxShadow: "0 1px 2px 0 rgba(10, 13, 18, 0.05)",
                }}
              />
            </form>
            <div>
              <div className="flex -space-x-2 justify-center items-center">
                {dummyImages.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={src}
                    className="object-cover object-top w-6 h-6 rounded-full border border-neutral-4 dark:border-neutral-2 "
                  />
                ))}
              </div>
              <p className="mt-1 text-neutral-4 text-sm text-center dark:text-neutral-0">
                <span className="text-green-500 font-semibold">100+</span>{" "}
                people have joined!
              </p>
            </div>
          </div>
        </div>
      </section>
      <div
        className="max-w-[81px] flex flex-col items-center text-center gap-1.5 bottom-10 md:bottom-[60px] absolute left-1/2 transform -translate-x-1/2 scroll-to-view-more "
        style={{
          zIndex: whoWeAreVisible ? 0 : 20,
          pointerEvents: whoWeAreVisible ? "none" : "auto",
        }}
      >
        <h3 className="dark:text-neutral-0 leading-tight text-neutral-0 hero-text-arrow">
          Scroll to view more
        </h3>
        <button
          onClick={scrollToWhoWeAre}
          className="w-6 h-12 cursor-pointer bg-neutral-7 rounded-[37px] items-center hero-text-arrow flex justify-center hover:bg-neutral-6 transition-colors duration-200"
        >
          <Image
            className="w-[11.4px] h-[20.3px]"
            src="/arrowdown.svg"
            width="1920"
            height="1080"
            alt="down"
          />
        </button>
      </div>
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
              <h1 className="dark:text-transparent dark:bg-clip-text dark:bg-linear-to-r from-0% from-black/84 via-white  to-black/84 text-neutral-6 text-2xl md:text-[40px] font-bold">
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
          <div className="absolute inset-0 scale-250 -mt-24 md:-mt-16 md:scale-120 lg:mt-10  flex items-center justify-center z-0">
            <Image
              src="/svg/green-line.svg"
              alt="Decorative Line"
              width={1920}
              height={1080}
              className="greenline w-[1920px] h-[1080px] object-contain md:object-cover lg:object-contain "
            />
          </div>
          <div
            className="max-w-[793px] video mx-auto "
            style={{ filter: "drop-shadow(0 4px 21.9px rgba(0, 0, 0, 0.15))" }}
          >
            <div className="h-[3px]  mx-4   bg-linear-to-r dark:from-black/30 dark:via-primary-5 dark:to-black/30 from-neutral-1/30 via-primary-5 to-neutral-1/30" />
            <div className="relative w-full  rounded-[14px] overflow-hidden ">
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
