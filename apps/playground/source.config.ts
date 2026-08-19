import { defineConfig, defineDocs, frontmatterSchema } from 'fumadocs-mdx/config'
import { statusSchema, tagsSchema } from './lib/schemas'

export const { docs, meta } = defineDocs({
  dir: 'content',
  docs: {
    postprocess: {
      // Serves an LLM-readable version of each page alongside the HTML, so an
      // agent can fetch the canonical component docs instead of re-reading the
      // component source and guessing at intent.
      includeProcessedMarkdown: true,
    },
    schema: frontmatterSchema.extend({
      tags: tagsSchema,
      status: statusSchema,
    }),
  },
})

export default defineConfig()
