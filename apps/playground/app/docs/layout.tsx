import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { RootProvider } from 'fumadocs-ui/provider/next'
import type { ReactNode } from 'react'
import { baseOptions } from '../layout.config'
import { source } from '@/lib/source'
import './../docs.css'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RootProvider
      // The playground has no theme switcher and the DS semantic layer is
      // authored light-first, so pin light rather than shipping a toggle that
      // would expose half-tested dark specimens.
      theme={{ enabled: false }}
      // `static`, matching the `staticGET` route. The default client POSTs to
      // /api/search, which a staticGET route answers with 405, so search failed
      // on every keystroke. This fetches the prebuilt index and queries it in
      // the browser instead.
      search={{ options: { type: 'static' } }}
    >
      <DocsLayout tree={source.pageTree} {...baseOptions}>
        {children}
      </DocsLayout>
    </RootProvider>
  )
}
