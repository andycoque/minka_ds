# Unpublished component pages

Written, reviewed, and deliberately not published. Kept here rather than deleted so
the work is not redone from scratch when the decision changes.

These files are outside `content/` on purpose: an MDX file left in `content/` but
omitted from `meta.json` is only hidden from the sidebar, and still builds a route
anyone can reach by URL. Moving it here removes the route.

To publish one: move it back to `content/ds/` and add its slug to
`content/ds/meta.json`.

| Page | Why it is not published |
| --- | --- |
| `label.mdx` | A bound primitive. It is always paired with a field, so its guidance belongs in the form-control pages rather than on a page of its own. The component is exported and used in ~16 places. |
| `separator.mdx` | Judged not worth a page of its own for now. The component is exported and used in ~17 places, so this is a documentation-scope decision, not a deprecation. |
