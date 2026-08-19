import { cn } from "@/lib/utils"

/**
 * Minka logomark. Strokes use `currentColor`, so colour comes from the text
 * colour of whatever it sits in — matches how the studio sidebar renders it.
 */
function Logomark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 210 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn("size-full", className)}
    >
      <path d="M105 166.5L105 204" stroke="currentColor" strokeWidth="12" strokeMiterlimit="10" strokeLinecap="round" />
      <path d="M81 177L81 201" stroke="currentColor" strokeWidth="12" strokeMiterlimit="10" strokeLinecap="round" />
      <path d="M129 150L129 201" stroke="currentColor" strokeWidth="12" strokeMiterlimit="10" strokeLinecap="round" />
      <path d="M57 183L57 192" stroke="currentColor" strokeWidth="12" strokeMiterlimit="10" strokeLinecap="round" />
      <path d="M153 124.5L153 192" stroke="currentColor" strokeWidth="12" strokeMiterlimit="10" strokeLinecap="round" />
      <path d="M177 81L177 174" stroke="currentColor" strokeWidth="12" strokeMiterlimit="10" strokeLinecap="round" />
      <path d="M201 75L201 135" stroke="currentColor" strokeWidth="12" strokeMiterlimit="10" strokeLinecap="round" />
      <path d="M105 50.25L105 206.25" stroke="currentColor" strokeWidth="7.5" strokeMiterlimit="10" strokeLinecap="round" />
      <path d="M81 67.5L81 203.25" stroke="currentColor" strokeWidth="7.5" strokeMiterlimit="10" strokeLinecap="round" />
      <path d="M129 39.75L129 203.25" stroke="currentColor" strokeWidth="7.5" strokeMiterlimit="10" strokeLinecap="round" />
      <path d="M57 94.5L57 194.25" stroke="currentColor" strokeWidth="7.5" strokeMiterlimit="10" strokeLinecap="round" />
      <path d="M153 33.75L153 194.25" stroke="currentColor" strokeWidth="7.5" strokeMiterlimit="10" strokeLinecap="round" />
      <path d="M33 147L33 175.5" stroke="currentColor" strokeWidth="7.5" strokeMiterlimit="10" strokeLinecap="round" />
      <path d="M177 35.25L177 174.75" stroke="currentColor" strokeWidth="7.5" strokeMiterlimit="10" strokeLinecap="round" />
      <path d="M105 1.5L105 208.5" stroke="currentColor" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" />
      <path d="M81 6L81 204" stroke="currentColor" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" />
      <path d="M129 6L129 204" stroke="currentColor" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" />
      <path d="M57 15L57 195" stroke="currentColor" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" />
      <path d="M153 15L153 195" stroke="currentColor" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" />
      <path d="M33 34.5L33 175.5" stroke="currentColor" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" />
      <path d="M9 72L9 138" stroke="currentColor" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" />
    </svg>
  )
}

export { Logomark }
