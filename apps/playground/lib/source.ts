import { createElement } from 'react'
import { loader } from 'fumadocs-core/source'
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server'
import { icons } from 'lucide-react'
import { docs, meta } from '@/.source/server'

// `defineDocs` yields two separate collections, so they are joined here rather
// than via the `.toFumadocsSource()` method that only exists on a combined
// `docs()` collection.
export const source = loader({
  baseUrl: '/docs',
  source: toFumadocsSource(docs, meta),
  /**
   * `icon` in frontmatter and meta.json is a Lucide name. Fumadocs carries the string
   * through but does not resolve it, so the mapping happens here — this is the only
   * place that knows an icon name is a Lucide export.
   *
   * An unknown name renders nothing rather than throwing: a typo should cost an icon,
   * not the whole docs tree.
   */
  icon(name) {
    if (!name) return
    const Icon = icons[name as keyof typeof icons]
    if (!Icon) return
    return createElement(Icon, { className: 'size-4 shrink-0' })
  },
})
