"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import IconButton from "../components/button+icon";
import ArrowUpRight from "../components/arrow-up-right.svg";
import Image from "next/image";
import WaitlistModal from "@/components/ui/successWaitlistModal";
import { showToast } from "@/components/ui/toast";
import { CircleAlert } from "lucide-react";
import { useTheme } from "@/utils/ThemeContext";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const { theme } = useTheme();
  const rootRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const whoWeAreSectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWaitlistModalOpened, setIsWaitlistModalOpened] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState("");
  const errorRef = useRef<HTMLDivElement | null>(null);
  /** True while the Who We Are reveal is showing; cleared when the section scrolls mostly out of view so it can replay. */
  const whoRevealShownRef = useRef(false);
  /** Previous frame’s `getBoundingClientRect().top` for the Who We Are section (scroll direction). */
  const prevWhoSectionTopRef = useRef<number | null>(null);

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

  // Autoplay muted promo when the video block is in view; pause when it leaves.
  useEffect(() => {
    const video = videoRef.current;
    const container = videoContainerRef.current;
    if (!video || !container) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: [0, 0.15, 0.3, 0.5, 0.75, 1], rootMargin: "0px" }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

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

  // "Scroll to view more" fades out as the user scrolls through the hero.
  useEffect(() => {
    const hero = heroSectionRef.current;
    const hint = scrollHintRef.current;
    if (!hero || !hint) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.to(hint, {
        opacity: 0,
        y: 20,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: () => `+=${Math.max(120, Math.round(hero.offsetHeight * 0.42))}`,
          scrub: 0.55,
          invalidateOnRefresh: true,
        },
      });
    }, hero);

    return () => ctx.revert();
  }, []);

  // Who we are: hide lines, then stagger in when ~40% of the section is visible.
  useLayoutEffect(() => {
    const section = whoWeAreSectionRef.current;
    if (!section) return;

    const items = section.querySelectorAll<HTMLElement>(".who-reveal-el");
    if (!items.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(items, { opacity: 1, y: 0, clearProps: "opacity,transform" });
    } else {
      gsap.set(items, { opacity: 0, y: 44 });
    }
  }, []);

  useEffect(() => {
    const section = whoWeAreSectionRef.current;
    if (!section) return;

    const items = section.querySelectorAll<HTMLElement>(".who-reveal-el");
    if (!items.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const EXIT_FRAC = 0.12;
    const ENTER_FRAC = 0.4;

    const playReveal = () => {
      gsap.killTweensOf(items);
      gsap.fromTo(
        items,
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 0.72,
          stagger: 0.14,
          ease: "power2.out",
        }
      );
    };

    const syncReveal = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const visible = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
      const frac =
        rect.height > 0 ? Math.max(0, visible) / rect.height : 0;

      const prevTop = prevWhoSectionTopRef.current;
      prevWhoSectionTopRef.current = rect.top;

      if (frac < EXIT_FRAC) {
        if (whoRevealShownRef.current) {
          gsap.killTweensOf(items);
          gsap.set(items, { opacity: 0, y: 44 });
          whoRevealShownRef.current = false;
        }
        prevWhoSectionTopRef.current = null;
        return;
      }

      if (frac >= ENTER_FRAC && !whoRevealShownRef.current) {
        whoRevealShownRef.current = true;

        const enteringFromBelow =
          prevTop !== null && rect.top > prevTop + 2;

        if (enteringFromBelow) {
          gsap.killTweensOf(items);
          gsap.set(items, { opacity: 1, y: 0 });
        } else {
          playReveal();
        }
      }
    };

    const triggerInstance = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onEnter: syncReveal,
      onLeave: syncReveal,
      onEnterBack: syncReveal,
      onLeaveBack: syncReveal,
      onUpdate: syncReveal,
    });

    requestAnimationFrame(() => {
      syncReveal();
      ScrollTrigger.refresh();
    });

    return () => {
      triggerInstance.kill();
    };
  }, []);

  // Hero intro (load) — no pin/scrub; normal page scroll below.
  useEffect(() => {
    if (!theme) return;
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    const ctx = gsap.context(() => {
      const spinTargets = root.querySelectorAll(".rotate-45");
      if (spinTargets.length) {
        gsap.to(spinTargets, {
          rotation: "+=360",
          repeat: -1,
          duration: 12,
          ease: "linear",
        });
      }

      const introSelectors = [
        ".hero-heading",
        ".coming-soon",
        ".hero-paragraph",
        ".hero-text-arrow",
      ];
      const inputGroup = root.querySelector(".hero-input-group");
      if (inputGroup) introSelectors.push(".hero-input-group");

      if (reduced) {
        gsap.set(introSelectors, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(introSelectors, { opacity: 0, y: 75 });

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
        );

      if (inputGroup) {
        introTl.to(
          ".hero-input-group",
          { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
          "-=0.6"
        );
      }

      introTl
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
    }, root);

    return () => ctx.revert();
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
    whoWeAreSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div
      ref={rootRef}
      className={`sections-container relative w-full bg-transparent text-white ${
        isWaitlistModalOpened ? "no-pointer-events" : ""
      }`}
    >
      <section
        ref={heroSectionRef}
        className="hero-section relative flex min-h-[100svh] flex-col items-center overflow-hidden pt-28 pb-16 md:pb-20 md:pt-24 lg:pt-20 xl:pt-24"
      >
        <div className="mx-auto flex w-full max-w-[583px] flex-1 flex-col justify-center px-4 md:px-0">
          <div className="flex w-full flex-col gap-[15px] md:gap-0">
            <div className="w-full flex flex-col  items-center">
              <h1 className="text-primary-6 tracking-[11px] leading-[15px] mb-4 text-center w-fit -mr-[11px] md:-mr-3.5 lg:-mr-[22.2px]  md:tracking-[14px] lg:tracking-[22.2px]  text-[12px] text-sm md:text-lg lg:text-xl font-light dark:text-neutral-0 hero-heading">
                INOVALINK WEBSITE
              </h1>
              <h2 className="md:hidden dark:text-neutral-0 text-neutral-6 w-full items-center flex flex-col text-hero-clamp font-bold coming-soon">
                <span className="flex leading-[92.188%] ">
                  <span className="dark:bg-clip-text dark:text-transparent dark:bg-linear-to-b from-white via-white via-75% to-[#999]">
                    WH
                  </span>
                  <div
                    className="md:w-[80px] w-6 h-6 sm:w-8 sm:h-8 place-self-center rotate-45 mx-1 sm:mx-2 md:mx-4 md:h-[80px]"
                    style={{
                      background:
                        "linear-gradient(257deg, #09C00E 47.19%, #045A07 109.91%)",
                    }}
                  ></div>
                  <span className="dark:bg-clip-text dark:text-transparent dark:bg-linear-to-b from-white via-white via-75% to-[#999]">
                    
                  </span>
                  <span className="md:hidden ml-3 dark:bg-clip-text dark:text-transparent dark:bg-linear-to-b from-white via-white via-75% to-black">
                    WE ARE
                  </span>
                </span>
                <span className="hidden md:block dark:bg-clip-text dark:text-transparent dark:bg-linear-to-b from-white via-white via-70% to-black">
                  WE ARE
                </span>
              </h2>

              <h2 className="dark:text-neutral-0 text-neutral-6 w-full items-center hidden md:flex flex-col md:text-8xl lg:text-9xl font-bold coming-soon">
                <span className="flex leading-[92.188%] ">
                  <span className="dark:bg-clip-text dark:text-transparent dark:bg-linear-to-b from-white via-white via-75% to-[#999]">
                    WH
                  </span>
                  <div
                    className="md:w-[54px] md:h-[54px] lg:w-[72px] lg:h-[72px] w-4 h-4 sm:w-8 sm:h-8 place-self-center rotate-45 mx-1 sm:mx-2 md:mx-4 "
                    style={{
                      background:
                        "linear-gradient(257deg, #09C00E 47.19%, #045A07 109.91%)",
                    }}
                  ></div>
                  <span className="dark:bg-clip-text dark:text-transparent dark:bg-linear-to-b from-white via-white via-75% to-[#999]">
                     
                  </span>
                  <span className="md:hidden ml-2 dark:bg-clip-text dark:text-transparent dark:bg-linear-to-b from-white via-white via-75% to-black">
                    WE ARE
                  </span>
                </span>
                <span className="hidden md:block dark:bg-clip-text dark:text-transparent dark:bg-linear-to-b from-white via-white via-70% to-black">
                  WE ARE
                </span>
              </h2>
            </div>

            <p className="dark:text-neutral-4 text-neutral-5 text-[14px] px-2.5 leading-4 max-w-[374px] sm:max-w-[450px] mx-auto text-center hero-paragraph">
              <span className="text-primary-5 font-semibold">
              We build what inspires us — with you in mind.
              </span>{" "}
              From <span className="text-primary-5 ">innovative software</span> and <span className="text-primary-5 ">motion design</span> to <span className="text-primary-5 ">product design</span> and <span className="text-primary-5 ">brand development</span>, we craft experiences that empower people, elevate businesses, and bridge the digital divide across Ghana, Africa, and beyond.
              <span className="text-primary-5 font-semibold">Your business deserves better.</span>
            </p>
          </div>
          {/* <div className=" hero-input-group flex flex-col gap-6 items-center justify-center  w-full">
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
          </div> */}
        </div>

        <div
          ref={scrollHintRef}
          className="scroll-to-view-more mt-10 flex max-w-[81px] shrink-0 flex-col items-center gap-1.5 pb-10 text-center md:mt-12 md:pb-14"
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
      </section>

      <section
        ref={whoWeAreSectionRef}
        id="who-we-are"
        aria-label="Who we are"
        className="who-we-are-section relative z-0 mt-16 flex scroll-mt-28 flex-col overflow-hidden px-[15px] pb-24 pt-8 text-black md:mt-24 md:pb-32 md:pt-12"
      >
        <div className="relative flex flex-col gap-[37px] md:gap-16">
          <div className="who-reveal-el mx-auto max-w-[793px] text-center">
            {/* <h2 className="dark:text-transparent dark:bg-clip-text dark:bg-linear-to-r from-0% from-black/24 via-white to-black/24 text-2xl font-bold text-neutral-6 md:text-[40px]">
              Who We Are
            </h2> */}
          </div>

          <div className="who-reveal-el mx-auto max-w-[574px] text-center">
            <p className="text-[14px] text-neutral-5 dark:text-neutral-4">
              We are{" "}
              <span className="font-bold text-primary-5">intentional</span>{" "}
              with designs. We build with{" "}
              <span className="font-bold text-primary-5">precision</span> and
              move ideas forward with{" "}
              <span className="font-bold text-primary-5">innovation</span>.
              This below is a short video that captures our vision and what we
              offer. Hit play and discover what makes InovaLink different.
            </p>
          </div>

          <div className="who-reveal-el pointer-events-none absolute inset-0 -z-10 flex scale-250 items-center justify-center md:-mt-16 md:scale-120 lg:mt-10">
            <Image
              src="/svg/green-line.svg"
              alt=""
              width={1920}
              height={1080}
              className="greenline h-[1080px] w-[1920px] object-contain md:object-cover lg:object-contain"
            />
          </div>

          <div
            ref={videoContainerRef}
            className="who-reveal-el video relative z-1 mx-auto w-full max-w-[793px]"
            style={{
              filter: "drop-shadow(0 4px 21.9px rgba(0, 0, 0, 0.15))",
            }}
          >
            <div className="h-[3px]  mx-4   bg-linear-to-r dark:from-black/30 dark:via-primary-5 dark:to-black/30 from-neutral-1/30 via-primary-5 to-neutral-1/30" />
            <div className="relative w-full  rounded-[14px] overflow-hidden ">
              <video
                controls
                muted
                playsInline
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
