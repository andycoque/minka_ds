import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// tailwind-merge treats all `text-*` classes as a single conflict group, so
// `text-label` gets silently dropped when any `text-[color-var]` is on the
// same element (which every button variant has). Registering custom text-*
// utilities in the font-size group keeps both classes alive.
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
          ],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
