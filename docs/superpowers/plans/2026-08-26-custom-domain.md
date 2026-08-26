# Custom Domain Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish Molinari STUDIOS at `https://molinaristudios.com` through GitHub Pages and Cloudflare DNS.

**Architecture:** Keep the existing GitHub Actions static export, but make its base path conditional on whether `CUSTOM_DOMAIN` is present. Configure the approved domain in the workflow, then connect Cloudflare DNS and GitHub Pages using their signed-in dashboards.

**Tech Stack:** Next.js static export, Node.js test runner, GitHub Actions/Pages, Cloudflare DNS

**Spec:** `docs/superpowers/specs/2026-08-26-custom-domain.md`

## Global Constraints

- The primary production URL is exactly `https://molinaristudios.com`.
- `www.molinaristudios.com` must resolve through GitHub Pages.
- Repository-subpath exports must continue to work when `CUSTOM_DOMAIN` is absent.
- Cloudflare records for GitHub Pages remain DNS-only.
- Preserve the current site design, content, and social-preview image.

---

### Task 1: Custom-domain static export

**Files:**
- Modify: `tests/site.test.mjs`
- Modify: `next.config.ts`
- Modify: `.github/workflows/pages.yml`

**Interfaces:**
- Consumes: `GITHUB_PAGES`, `GITHUB_REPOSITORY`, `CUSTOM_DOMAIN`, and `SITE_URL` build environment variables.
- Produces: a root-relative static export when `CUSTOM_DOMAIN` is set and the existing repository-relative export otherwise.

- [x] **Step 1: Write the failing custom-domain export test**

Add a build test that supplies `CUSTOM_DOMAIN=molinaristudios.com` and `SITE_URL=https://molinaristudios.com`, then asserts that exported script, logo, favicon, and social-image URLs are rooted at `/` and contain no `/molinari-studios` prefix.

- [x] **Step 2: Run the focused test and verify the failure**

Run: `node --test --test-name-pattern='custom domain root' tests/site.test.mjs`

Expected: FAIL because the current Pages build always exports with `/molinari-studios` as its base path.

- [x] **Step 3: Implement conditional base-path behavior**

Change `next.config.ts` so `basePath` is the repository path only when `GITHUB_PAGES=true` and `CUSTOM_DOMAIN` is empty. Keep `output: 'export'` and `trailingSlash: true` for all Pages builds.

- [x] **Step 4: Configure the production workflow environment**

Set `CUSTOM_DOMAIN: molinaristudios.com` and `SITE_URL: https://molinaristudios.com` on the GitHub Pages build step.

- [x] **Step 5: Run tests and builds**

Run: `pnpm test && CUSTOM_DOMAIN=molinaristudios.com SITE_URL=https://molinaristudios.com pnpm build:pages && pnpm build`

Expected: five existing tests plus the custom-domain test pass; both the Pages and Sites-compatible builds exit successfully.

- [ ] **Step 6: Commit the tested source**

Run: `git add tests/site.test.mjs next.config.ts .github/workflows/deploy-pages.yml docs/superpowers && git commit -m "feat: configure custom domain build"`

Expected: one commit containing the domain build behavior, its regression test, workflow configuration, specification, and plan.

### Task 2: GitHub Pages and Cloudflare connection

**Files:**
- No repository files; this task updates the GitHub and Cloudflare dashboards.

**Interfaces:**
- Consumes: GitHub's account-verification TXT value and documented Pages DNS targets.
- Produces: verified apex and `www` DNS resolution, a configured GitHub Pages custom domain, and an issued HTTPS certificate.

- [ ] **Step 1: Push the verified source to `main`**

Merge the custom-domain commit into the local `main` branch and push `main` to `origin`, then confirm the GitHub Pages deployment succeeds.

- [ ] **Step 2: Verify domain ownership in GitHub**

Request GitHub's TXT record for `molinaristudios.com`, add the exact TXT name and value to Cloudflare, and wait until GitHub reports the domain verified.

- [ ] **Step 3: Configure Cloudflare DNS**

Create DNS-only `A` records for `@` pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153`. Create a DNS-only `CNAME` for `www` pointing to `JefersonMolinari.github.io`.

- [ ] **Step 4: Configure the Pages custom domain**

Set `molinaristudios.com` in the repository's Pages settings, wait for the DNS check and certificate to complete, then enable **Enforce HTTPS**.

- [ ] **Step 5: Verify public routing**

Run: `dig +short A molinaristudios.com; dig +short CNAME www.molinaristudios.com; curl -I https://molinaristudios.com; curl -I https://www.molinaristudios.com`

Expected: the apex returns all four GitHub Pages IPv4 addresses, `www` resolves through the configured CNAME, and both HTTPS URLs reach the site with the expected canonical redirect behavior.
