import localFont from "next/font/local"
import "@/app/globals.css"

const ppNeueMontreal = localFont({
  src: [
    { path: "../../public/fonts/PPNeueMontreal-Book.woff2",         weight: "400", style: "normal" },
    { path: "../../public/fonts/PPNeueMontreal-Medium.woff2",       weight: "500", style: "normal" },
    { path: "../../public/fonts/PPNeueMontreal-SemiBold.woff2",     weight: "600", style: "normal" },
  ],
  variable: "--font-pp-neue-montreal",
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={ppNeueMontreal.variable}>
      <body>{children}</body>
    </html>
  )
}
