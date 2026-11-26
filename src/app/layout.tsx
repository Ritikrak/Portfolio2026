import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import MotionToggle from "@/components/motion-toggle/MotionToggle";
import SmoothScroll from "@/components/smooth-scroll/SmoothScroll";
import { portfolioData } from "@/data/portfolio";
import MotionProvider from "@/providers/MotionProvider";
import "./globals.scss";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${portfolioData.profile.name} — Creative Portfolio`,
    template: `%s — ${portfolioData.profile.name}`,
  },
  description: portfolioData.profile.description,
  applicationName: `${portfolioData.profile.name} Portfolio`,
  openGraph: {
    title: `${portfolioData.profile.name} — Creative Portfolio`,
    description: portfolioData.profile.description,
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${jetBrainsMono.variable}`}
    >
      <body>
        <MotionProvider>
          <SmoothScroll />
          {children}
          <MotionToggle />
        </MotionProvider>
      </body>
    </html>
  );
}
