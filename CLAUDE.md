@apps/playground/CLAUDE.md

# Minka Monorepo

## Structure

```
apps/
  playground/   — Next.js doc/demo site (deployed to Vercel)
packages/
  minka-ds/     — Component library (published to npm as "minka-ds")
```

`apps/studio` is a **separate git repo** (`minka-studio`) and is not part of this monorepo on remote, even though it lives under `apps/` locally.

## Vercel Deployment

**What deploys:** `apps/playground` (the design system demo site).

**Why it used to fail:** Turbo v2 requires a `packageManager` field in the root `package.json` to resolve workspaces. Without it, `turbo build` exits with `Could not resolve workspaces. → Missing 'packageManager' field`.

**Fix (both files must stay in sync):**

- `package.json` — has `"packageManager": "npm@11.8.0"`
- `vercel.json` — scopes build to playground only:
  ```json
  {
    "buildCommand": "turbo build --filter=minka-product-ui",
    "outputDirectory": "apps/playground/.next",
    "framework": "nextjs",
    "installCommand": "npm install"
  }
  ```

If you upgrade npm locally (`npm install -g npm@latest`), update the `packageManager` version in `package.json` to match, or Vercel may warn about a version mismatch.

## Publishing minka-ds to npm

Run from `packages/minka-ds/`:

```bash
npm publish
```

**Push order matters** — studio resolves `minka-ds` from npm, not the local workspace:

1. Bump version in `packages/minka-ds/package.json`
2. `npm publish` from `packages/minka-ds/`
3. Push this monorepo to GitHub (triggers Vercel playground rebuild)
4. Update `minka-ds` version in `apps/studio/package.json` + `npm install`
5. Push the studio repo
