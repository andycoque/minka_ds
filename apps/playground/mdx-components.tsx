import defaultMdxComponents from 'fumadocs-ui/mdx'
import type { MDXComponents } from 'mdx/types'
import { Anatomy, Part } from '@/components/docs/anatomy'
import { Code } from '@/components/docs/code'
import { Do, DoDont, Dont, Rule } from '@/components/docs/do-dont'
import { MotionSpec } from '@/components/docs/motion-spec'
import { Playground } from '@/components/docs/playground'
import { Prop, PropsTable } from '@/components/docs/props-table'
import { Specimen, SpecimenRow } from '@/components/docs/specimen'

/**
 * Components available in every MDX page without an import.
 *
 * The docs components live here because they are the page template — a
 * component page is expected to use Specimen, Anatomy, DoDont, MotionSpec and
 * PropsTable, so making them ambient keeps the frontmatter-to-content distance
 * short and stops each page inventing its own imports.
 *
 * DS components are NOT ambient. Pages import them from `minka-ds` explicitly,
 * so the import in the doc is the same import a reader would copy into product
 * code.
 */
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Specimen,
    SpecimenRow,
    Anatomy,
    Part,
    Code,
    DoDont,
    Rule,
    Do,
    Dont,
    MotionSpec,
    Playground,
    PropsTable,
    Prop,
    ...components,
  }
}
