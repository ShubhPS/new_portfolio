import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import Grain from "@/components/ui/Grain";
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
  title: "Portfolio",
  description: "Personal portfolio.",
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
        {children}
        <Grain />
      </body>
    </html>
  );
}
