import { createFromSource } from 'fumadocs-core/search/server'
import { source } from '@/lib/source'

// Static search index — the playground is a static build, so the index ships
// with it rather than being computed per request.
export const revalidate = false

export const { staticGET: GET } = createFromSource(source)
