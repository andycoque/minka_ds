import type { Metadata } from "next";
import localFont from "next/font/local";
import { Instrument_Serif } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AgentationWidget } from "./agentation-widget";
import "./globals.css";

const ppNeueMontreal = localFont({
  src: [
    { path: "../public/fonts/PPNeueMontreal-Book.woff2",         weight: "400", style: "normal" },
    { path: "../public/fonts/PPNeueMontreal-BookItalic.woff2",   weight: "400", style: "italic" },
    { path: "../public/fonts/PPNeueMontreal-Medium.woff2",       weight: "500", style: "normal" },
    { path: "../public/fonts/PPNeueMontreal-MediumItalic.woff2", weight: "500", style: "italic" },
    { path: "../public/fonts/PPNeueMontreal-SemiBold.woff2",     weight: "600", style: "normal" },
    { path: "../public/fonts/PPNeueMontreal-SemiBolditalic.woff2", weight: "600", style: "italic" },
    { path: "../public/fonts/PPNeueMontreal-Bold.woff2",         weight: "700", style: "normal" },
    { path: "../public/fonts/PPNeueMontreal-BoldItalic.woff2",   weight: "700", style: "italic" },
  ],
  variable: "--font-pp-neue-montreal",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  title: "Minka Design System",
  description: "minka-product-ui component library",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ppNeueMontreal.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><TooltipProvider>{children}</TooltipProvider><AgentationWidget /></body>
    </html>
  );
}
