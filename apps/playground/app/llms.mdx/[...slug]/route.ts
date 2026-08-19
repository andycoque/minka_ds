import { notFound } from 'next/navigation'
import { source } from '@/lib/source'

/**
 * Plain-markdown version of each docs page, at `/llms.mdx/<slug>`.
 *
 * This is the payoff for `includeProcessedMarkdown` in source.config.ts: an
 * agent working in the product repo can fetch the canonical Button docs instead
 * of reading button.tsx and inferring intent from the implementation. The rules
 * in Do / Don't are the part that cannot be recovered from source at all.
 *
 * Lives at the top level rather than under `/docs/[[...slug]]/` because a static
 * segment cannot follow a catch-all in the same route.
 */
export const revalidate = false

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params
  // `/llms.mdx/index` addresses the docs root, which has an empty slug array.
  const pageSlug = slug.length === 1 && slug[0] === 'index' ? [] : slug
  const page = source.getPage(pageSlug)
  if (!page) notFound()

  const text = await page.data.getText('processed')

  return new Response(text, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}

export function generateStaticParams() {
  return source.generateParams().map(({ slug }) => ({
    slug: slug.length === 0 ? ['index'] : slug,
  }))
}
