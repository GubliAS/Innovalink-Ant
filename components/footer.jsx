"use client";
import Link from "next/link";
import { useDocumentScrolled } from "@/hooks/useDocumentScrolled";

export default function footer() {
  const scrolled = useDocumentScrolled();

  return (
    <>
      <footer
        aria-hidden={scrolled}
        className={`footer fixed bg-transparent max-w-[1300px] place-self-center px-5 sm:px-7 md:px-8 w-full block bottom-10 md:bottom-[60px] transition-[opacity,transform,visibility] duration-300 ease-out ${
          scrolled
            ? "opacity-0 pointer-events-none translate-y-3 invisible"
            : "opacity-100 translate-y-0 visible"
        }`}
      >
        <div className="  w-full max-w-7xl place-self-center items-end md:items-center flex justify-between">
          <div className="flex flex-row gap-1 items-center dark:text-neutral-0 text-neutral-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M4.71333 5.16833C4.7425 4.97583 4.80667 4.80667 4.88833 4.66083C4.97 4.515 5.08667 4.3925 5.2325 4.29917C5.3725 4.21167 5.5475 4.17083 5.76333 4.165C5.8975 4.17083 6.02 4.19417 6.13083 4.24083C6.2475 4.29333 6.3525 4.36333 6.43417 4.45083C6.51583 4.53833 6.58 4.64333 6.6325 4.76C6.685 4.87667 6.70833 5.005 6.71417 5.13333H7.75833C7.74667 4.85917 7.69417 4.60833 7.595 4.38083C7.49583 4.15333 7.36167 3.955 7.18667 3.79167C7.01167 3.62833 6.80167 3.5 6.55667 3.40667C6.31167 3.31333 6.04333 3.2725 5.74583 3.2725C5.36667 3.2725 5.03417 3.33667 4.75417 3.47083C4.47417 3.605 4.24083 3.78 4.05417 4.0075C3.8675 4.235 3.7275 4.4975 3.64 4.80083C3.5525 5.10417 3.5 5.41917 3.5 5.7575V5.915C3.5 6.25333 3.54667 6.56833 3.63417 6.87167C3.72167 7.175 3.86167 7.4375 4.04833 7.65917C4.235 7.88083 4.46833 8.06167 4.74833 8.19C5.02833 8.31833 5.36083 8.38833 5.74 8.38833C6.01417 8.38833 6.27083 8.34167 6.51 8.25417C6.74917 8.16667 6.95917 8.04417 7.14 7.88667C7.32083 7.72917 7.46667 7.54833 7.57167 7.33833C7.67667 7.12833 7.74083 6.90667 7.74667 6.6675H6.7025C6.69667 6.79 6.6675 6.90083 6.615 7.00583C6.5625 7.11083 6.4925 7.19833 6.405 7.27417C6.3175 7.35 6.21833 7.40833 6.10167 7.44917C5.99083 7.49 5.87417 7.50167 5.75167 7.5075C5.54167 7.50167 5.36667 7.46083 5.2325 7.37333C5.08667 7.28 4.97 7.1575 4.88833 7.01167C4.80667 6.86583 4.7425 6.69083 4.71333 6.49833C4.68417 6.30583 4.66667 6.1075 4.66667 5.915V5.7575C4.66667 5.55333 4.68417 5.36083 4.71333 5.16833ZM5.83333 0C2.61333 0 0 2.61333 0 5.83333C0 9.05333 2.61333 11.6667 5.83333 11.6667C9.05333 11.6667 11.6667 9.05333 11.6667 5.83333C11.6667 2.61333 9.05333 0 5.83333 0ZM5.83333 10.5C3.26083 10.5 1.16667 8.40583 1.16667 5.83333C1.16667 3.26083 3.26083 1.16667 5.83333 1.16667C8.40583 1.16667 10.5 3.26083 10.5 5.83333C10.5 8.40583 8.40583 10.5 5.83333 10.5Z"
                fill="currentColor"
              />
            </svg>
            <p className="dark:text-neutral-0 text-neutral-5  ">2025</p>
            <div className="w-[48.5px] dark:bg-primary-0 h-[0.5px] bg-neutral-5 animate-pulse transition  " />
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <Link href="mailto:inovalink.net.tech@gmail.com">
              <div className="w-7  h-7 items-center flex justify-center cursor-pointer group hover:bg-neutral-4 hover:scale-125 hover:border-neutral-4 transition-all duration-300 rounded-full border border-neutral-7 bg-neutral-7">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="10"
                  viewBox="0 0 12 10"
                  fill="none"
                  className=" text-neutral-4 group-hover:text-neutral-7 transition-all duration-300"
                >
                  <path
                    d="M1.16667 9.33333C0.845833 9.33333 0.571278 9.21919 0.343 8.99092C0.114722 8.76264 0.000388889 8.48789 0 8.16667V1.16667C0 0.845833 0.114333 0.571278 0.343 0.343C0.571667 0.114722 0.846222 0.000388889 1.16667 0H10.5C10.8208 0 11.0956 0.114333 11.3242 0.343C11.5529 0.571667 11.6671 0.846222 11.6667 1.16667V8.16667C11.6667 8.4875 11.5525 8.76225 11.3242 8.99092C11.096 9.21958 10.8212 9.33372 10.5 9.33333H1.16667ZM5.83333 5.25L1.16667 2.33333V8.16667H10.5V2.33333L5.83333 5.25ZM5.83333 4.08333L10.5 1.16667H1.16667L5.83333 4.08333ZM1.16667 2.33333V1.16667V8.16667V2.33333Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </Link>
            <Link
              target="_blank"
              href="https://www.linkedin.com/posts/inovalink-solution_inovalink-solution-linkedin-activity-7393027418736807937-p7F5?utm_source=share&utm_medium=member_ios&rcm=ACoAADgBfCYB9dPnS2rkSe1TxtxnFBc6FH4rlgg"
            >
              <div className="w-7  h-7 items-center flex justify-center cursor-pointer group hover:bg-neutral-4 hover:scale-125 hover:border-neutral-4 transition-all duration-300 rounded-full border border-neutral-7 bg-neutral-7">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className=" text-neutral-4 group-hover:text-neutral-7 transition-all duration-300"
                >
                  <path
                    d="M3.23874 2.33334C3.23861 2.58087 3.14016 2.81822 2.96504 2.99317C2.78992 3.16811 2.55247 3.26633 2.30494 3.2662C2.0574 3.26608 1.82005 3.16763 1.64511 2.99251C1.47016 2.81738 1.37195 2.57994 1.37207 2.3324C1.37219 2.08487 1.47065 1.84752 1.64577 1.67257C1.82089 1.49763 2.05834 1.39941 2.30587 1.39954C2.55341 1.39966 2.79075 1.49811 2.9657 1.67323C3.14065 1.84835 3.23886 2.0858 3.23874 2.33334ZM3.26674 3.95733H1.40007V9.8H3.26674V3.95733ZM6.21607 3.95733H4.35874V9.8H6.1974V6.734C6.1974 5.026 8.4234 4.86733 8.4234 6.734V9.8H10.2667V6.09933C10.2667 3.22 6.97207 3.32734 6.1974 4.74133L6.21607 3.95733Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
