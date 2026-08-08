import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import Cursor from "@/components/ui/Cursor";
import Grain from "@/components/ui/Grain";
import Nav from "@/components/ui/Nav";
import "./globals.css";

const clashDisplay = localFont({
  src: "../../public/fonts/ClashDisplay-Variable.woff2",
  variable: "--font-clash",
  weight: "200 700",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shubh Pratap Singh — Agentic AI engineer",
  description:
    "I build agentic AI pipelines — systems that plan their own work, argue with it, and finish it unattended. Selected projects, process and experience.",
  openGraph: {
    title: "Shubh Pratap Singh — Agentic AI engineer",
    description:
      "Agentic AI pipelines, retrieval systems and applied ML. Selected work from Angel One, NSE India and independent projects.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${clashDisplay.variable} ${inter.variable} ${plexMono.variable}`}
    >
      <body>
        <a className="skipLink" href="#work">
          Skip to work
        </a>
        {children}
        <Nav />
        <Grain />
        <Cursor />
      </body>
    </html>
  );
}
