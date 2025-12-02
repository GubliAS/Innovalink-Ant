import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { ThemeProvider } from "@/utils/ThemeContext";
import { ToastContainer } from "@/components/ui/toast";
import BackgroundAnimations from "@/components/backgroundAnimations";

const mona_Sans = Mona_Sans({
  variable: "--font-mono_sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inovalink Solutions | Software Development, AI & IT Services",
  description: "Inovalink Solutions provides innovative software development, AI, and IT solutions. Explore cutting-edge technology, automation tools, and consulting services.",
  keywords: [
    "Software Development",
    "Artificial Intelligence",
    "AI Solutions",
    "IT Consulting",
    "Machine Learning",
    "Automation Tools",
    "Tech Services",
    "Software Engineering",
    "Business Technology",
  ],
  authors: [{ name: "Inovalink Solutions" }],
  metadataBase: new URL("https://www.inovalinksolutions.com"),
  openGraph: {
    title: "Inovalink Solutions | Software Development, AI & IT Services",
    description:
      "Discover Inovalink Solutions — your trusted partner for software development, AI solutions, and IT consulting.",
    url: "https://www.inovalinksolutions.com",
    siteName: "Inovalink Solutions",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/heroSection.png",
        width: 1200,
        height: 627,
        alt: "Inovalink Solutions hero banner",
      },
    ],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/inovalinkIcon.png",
  },
  alternates: {
    canonical: "https://www.inovalinksolutions.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          {/* 🔵 LinkedIn / Google Schema */}
          <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Inovalink Solutions",
              url: "https://www.inovalinksolutions.com",
              logo: "https://www.inovalinksolutions.com/inovalinkIcon.png",
              sameAs: [
                "https://www.linkedin.com/company/inovalink-solution/",
              ],
              description:
                "Inovalink Solutions provides software development, AI solutions, and IT consulting services.",
            }),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
          (function() {
            const userPreference = localStorage.getItem("theme");
            let theme = "light";

            if (userPreference) {
              theme = userPreference;
            } else {
              const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
              theme = systemPrefersDark ? "dark" : "light";
            }

            document.documentElement.classList.toggle("dark", theme === "dark");
          })();
        `,
          }}
        />
      
      </head>
      <body className={`${mona_Sans.className} antialiased`}>
        <ThemeProvider>
          {/* Background Videos */}
          {/* <BackgroundVideos /> */}
          <BackgroundAnimations />
          <Navbar />
          <ToastContainer />
          {children}
          <div id="modal-root"></div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
