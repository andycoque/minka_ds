import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// tailwind-merge treats all `text-*` classes as a single conflict group, so
// `text-label` gets silently dropped when any `text-[color-var]` is on the
// same element (which every button variant has). Registering custom text-*
// utilities in the font-size group keeps both classes alive.
//
// Keep this list in sync with apps/playground/lib/utils.ts. The two drifted
// once already: the serif variants were registered here but not there, so a
// serif class survived `cn()` in a DS component and was silently dropped in the
// playground, rendering in the UI face with no error anywhere.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "heading-1", "heading-2", "heading-3", "heading-4",
            "paragraph-lg", "paragraph", "paragraph-sm",
            "body-lg", "body", "body-sm",
            "body-lg-light", "body-light", "body-sm-light",
            "label", "label-sm",
            "caption", "caption-sm",
            "caption-light", "caption-sm-light",
            "overline",
            "code",
            "display-serif",
            "heading-1-serif", "heading-2-serif", "heading-3-serif", "heading-4-serif",
            "heading-1-lg-serif", "heading-2-lg-serif", "heading-3-lg-serif", "heading-4-lg-serif",
            "body-xl-serif", "body-lg-serif", "body-serif", "body-sm-serif", "body-sm-lg-serif",
            "caption-lg-serif", "caption-serif", "caption-sm-lg-serif", "caption-sm-serif",
          ],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
