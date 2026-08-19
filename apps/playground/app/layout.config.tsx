import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import { Logomark } from '@/components/docs/logomark'

/**
 * Shared chrome for the docs site. Kept in its own file (same convention as
 * docs.minka.io) so the nav is declared once and every layout reads it.
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <span className="inline-flex items-center gap-2">
        <span className="size-6 shrink-0 text-[var(--color-text-default)]">
          <Logomark />
        </span>
        {/* The wordmark stays: the logomark alone does not say which Minka site
            this is, and docs.minka.io would look identical in a tab strip. */}
        <span className="text-label text-[var(--color-text-default)]">Design System</span>
      </span>
    ),
    url: '/docs',
  },
  // The DS semantic layer is authored light-first and the dark specimens are
  // half-tested, so `RootProvider` pins the theme. Fumadocs still renders the
  // toggle unless it is turned off here, which left a visible control that
  // provably did nothing.
  themeSwitch: { enabled: false },
  githubUrl: 'https://github.com/andycoque/minka_ds',
  links: [
    {
      text: 'Playground',
      url: '/design-system',
      // The legacy specimen page. Stays reachable until the migration finishes.
      active: 'none',
    },
  ],
}
