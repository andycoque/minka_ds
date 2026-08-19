import { loader } from 'fumadocs-core/source'
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server'
import { docs, meta } from '@/.source/server'

// `defineDocs` yields two separate collections, so they are joined here rather
// than via the `.toFumadocsSource()` method that only exists on a combined
// `docs()` collection.
export const source = loader({
  baseUrl: '/docs',
  source: toFumadocsSource(docs, meta),
})
