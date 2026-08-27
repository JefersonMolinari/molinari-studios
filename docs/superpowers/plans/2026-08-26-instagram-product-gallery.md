# Instagram Product Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage's generic Work section with eight real products and one custom-order example sourced from `@molinaristudios`, with local images and Instagram DM actions.

**Architecture:** Keep catalog records and shared Instagram URLs in a typed static module, render them through one server component, and store optimized WebP media under `public/products/`. The homepage remains a statically exported, single-route Next.js site with no client state or runtime Instagram dependency.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS, Node test runner, Vite SSR test loader, Python Pillow for one-time image conversion, GitHub Pages, OpenAI Sites.

**Spec:** `docs/superpowers/specs/2026-08-26-instagram-product-gallery-design.md`

## Global Constraints

- Use exactly eight normal product posts and the one medals post listed in the spec; ignore the three logo posts and all reels.
- Primary action text is “DM on Instagram”; no prices, cart, checkout, inventory, Etsy integration, or product-detail routes.
- Prefer `https://ig.me/m/molinaristudios`; use `https://www.instagram.com/molinaristudios/` only if the direct route cannot be validated.
- Store all nine selected images locally as WebP, maximum 1,600-pixel longest edge, target 300 KB per image, maximum 2.7 MB total.
- Preserve the current green, cream, and brass design system and the one-page static-export architecture.
- Do not alter `public/og.png`, logo assets, hero artwork, contact behavior, or `.openai/hosting.json`.
- Preserve both GitHub Pages export modes: repository subpath and custom-domain root.

## File Structure

- Create `app/products/catalog.ts`: typed catalog records plus shared Instagram DM/profile constants.
- Create `app/products/product-gallery.tsx`: reusable product card, gallery, custom-order feature, and safe external actions.
- Create `scripts/optimize_product_images.py`: reproducible WebP conversion and size enforcement.
- Create `tests/products.test.mjs`: catalog contract and product-asset checks.
- Create `public/products/*.webp`: nine locally hosted product images.
- Modify `app/page.tsx`: navigation wording, hero link, and replacement of the Work section with the gallery component.
- Modify `app/globals.css`: replace abstract Work illustrations with the product-gallery, action, and custom-order styles.
- Modify `tests/site.test.mjs`: homepage integration, accessibility attributes, and both export-path assertions.

---

### Task 1: Define the Static Catalog Contract

**Files:**
- Create: `app/products/catalog.ts`
- Create: `tests/products.test.mjs`

**Interfaces:**
- Produces: `CatalogItem`, `CatalogKind`, `catalogItems`, `products`, `customOrder`, `preferredInstagramDmUrl`, `instagramProfileUrl`, and `instagramDmUrl`.
- Consumes: no application code; source URLs and copy come from the approved spec.

- [ ] **Step 1: Write the failing catalog test**

Create `tests/products.test.mjs`:

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import react from '@vitejs/plugin-react';
import { createServer } from 'vite';

async function loadCatalog() {
  const server = await createServer({
    appType: 'custom',
    configFile: false,
    plugins: [react()],
    server: { middlewareMode: true },
  });

  try {
    return await server.ssrLoadModule('/app/products/catalog.ts');
  } finally {
    await server.close();
  }
}

test('defines the approved Instagram catalog and one shared DM target', async () => {
  const catalog = await loadCatalog();

  assert.equal(catalog.products.length, 8);
  assert.equal(catalog.customOrder.kind, 'custom-order');
  assert.equal(catalog.customOrder.title, 'Custom Event Medals');
  assert.deepEqual(
    catalog.products.map((item) => item.title),
    [
      'Personalized Collectible',
      'Custom Team Crest',
      'Rattan-Style Tray',
      'Tissue Box Cover',
      'Key Tray',
      'Climber Wall Hooks',
      'Tent Lamp',
      'Martial Arts Display',
    ],
  );
  assert.equal(new Set(catalog.catalogItems.map((item) => item.slug)).size, 9);
  assert.ok(
    [catalog.preferredInstagramDmUrl, catalog.instagramProfileUrl].includes(
      catalog.instagramDmUrl,
    ),
  );

  for (const item of catalog.catalogItems) {
    assert.match(item.image, /^\/products\/[a-z0-9-]+\.webp$/);
    assert.match(item.sourceUrl, /^https:\/\/www\.instagram\.com\/molinaristudios\/p\/[A-Za-z0-9_-]+\/$/);
    assert.ok(item.alt.length >= 20, `${item.slug} needs meaningful alt text`);
    assert.ok(item.description.length >= 40, `${item.slug} needs useful copy`);
  }
});
```

- [ ] **Step 2: Run the catalog test and verify it fails**

Run:

```bash
node --test tests/products.test.mjs
```

Expected: FAIL because `/app/products/catalog.ts` does not exist.

- [ ] **Step 3: Implement the typed catalog module**

Create `app/products/catalog.ts`:

```ts
export type CatalogKind = 'product' | 'custom-order';

export type CatalogItem = {
  slug: string;
  title: string;
  description: string;
  note?: string;
  image: string;
  alt: string;
  sourceUrl: string;
  imagePosition?: string;
  kind: CatalogKind;
};

export const preferredInstagramDmUrl = 'https://ig.me/m/molinaristudios';
export const instagramProfileUrl = 'https://www.instagram.com/molinaristudios/';

// Change this one value to instagramProfileUrl if the direct route fails validation.
export const instagramDmUrl = preferredInstagramDmUrl;

export const catalogItems: CatalogItem[] = [
  {
    slug: 'personalized-collectible',
    title: 'Personalized Collectible',
    description: 'A custom figure created from your photo—a personal gift or keepsake made just for you.',
    note: 'Made from your photo',
    image: '/products/personalized-collectible.webp',
    alt: 'Personalized 3D-printed collectible figure displayed for a customer gift',
    sourceUrl: 'https://www.instagram.com/molinaristudios/p/Dcgypi5tJ8F/',
    kind: 'product',
  },
  {
    slug: 'custom-team-crest',
    title: 'Custom Team Crest',
    description: 'A dimensional club display made around the team, colors, and story you want to bring into your space.',
    note: 'Choose your team and colors',
    image: '/products/custom-team-crest.webp',
    alt: 'Black and white Vasco da Gama team crest displayed on a small stand',
    sourceUrl: 'https://www.instagram.com/molinaristudios/p/DcgvmWONpdh/',
    kind: 'product',
  },
  {
    slug: 'rattan-style-tray',
    title: 'Rattan-Style Tray',
    description: 'A textured decorative tray that adds warmth and useful organization to tables, vanities, and shelves.',
    note: 'Made to order',
    image: '/products/rattan-style-tray.webp',
    alt: 'Textured rattan-style decorative tray arranged on a styled surface',
    sourceUrl: 'https://www.instagram.com/molinaristudios/p/DcgfqB4NyvF/',
    kind: 'product',
  },
  {
    slug: 'tissue-box-cover',
    title: 'Tissue Box Cover',
    description: 'A considered cover that turns an everyday tissue box into a clean accent for home or office.',
    note: 'Custom colors available',
    image: '/products/tissue-box-cover.webp',
    alt: 'Decorative tissue box cover shown in a coordinated interior setting',
    sourceUrl: 'https://www.instagram.com/molinaristudios/p/DceJvo4NS9A/',
    kind: 'product',
  },
  {
    slug: 'key-tray',
    title: 'Key Tray',
    description: 'A compact place for keys, coins, and the small essentials you reach for every day.',
    note: 'Choose your color',
    image: '/products/key-tray.webp',
    alt: 'Saddle-stitched style key tray holding small everyday essentials',
    sourceUrl: 'https://www.instagram.com/molinaristudios/p/DceIeXztRbn/',
    kind: 'product',
  },
  {
    slug: 'climber-wall-hooks',
    title: 'Climber Wall Hooks',
    description: 'Playful climbing figures that work as wall hooks for keys, bags, purses, and accessories.',
    note: 'Choose your colors',
    image: '/products/climber-wall-hooks.webp',
    alt: 'Colorful climbing-figure wall hooks holding bags and accessories',
    sourceUrl: 'https://www.instagram.com/molinaristudios/p/Dcdz8izNIXj/',
    kind: 'product',
  },
  {
    slug: 'tent-lamp',
    title: 'Tent Lamp',
    description: 'Camping-inspired decor with a warm glow for a desk, nightstand, bedroom, or cozy corner.',
    note: 'Customizable',
    image: '/products/tent-lamp.webp',
    alt: 'Tent-shaped decorative lamp glowing warmly in a cozy room',
    sourceUrl: 'https://www.instagram.com/molinaristudios/p/DcdxT1LNLwR/',
    kind: 'product',
  },
  {
    slug: 'martial-arts-display',
    title: 'Martial Arts Display',
    description: 'A personalized presentation piece that celebrates the gi, belts, and progress behind the practice.',
    note: 'Personalized name and belts',
    image: '/products/martial-arts-display.webp',
    alt: 'White martial-arts gi and colored belts on a personalized display stand',
    sourceUrl: 'https://www.instagram.com/molinaristudios/p/DcbKA_Dm1f3/',
    imagePosition: 'center 45%',
    kind: 'product',
  },
  {
    slug: 'custom-event-medals',
    title: 'Custom Event Medals',
    description: 'A tailored medal set created for the Vancouver Beach Tennis Open—an example of custom work for tournaments, teams, and events.',
    note: 'Custom order example',
    image: '/products/custom-event-medals.webp',
    alt: 'Custom first- and second-place medals made for the Vancouver Beach Tennis Open',
    sourceUrl: 'https://www.instagram.com/molinaristudios/p/DcbJhquG96x/',
    kind: 'custom-order',
  },
];

export const products = catalogItems.filter((item) => item.kind === 'product');
export const customOrder = catalogItems[catalogItems.length - 1];
```

- [ ] **Step 4: Run the catalog test and verify it passes**

Run:

```bash
node --test tests/products.test.mjs
```

Expected: PASS with one catalog test.

- [ ] **Step 5: Commit the catalog contract**

```bash
git add app/products/catalog.ts tests/products.test.mjs
git commit -m "feat: define Instagram product catalog"
```

---

### Task 2: Acquire and Optimize the Nine Approved Images

**Files:**
- Create: `scripts/optimize_product_images.py`
- Create: `public/products/personalized-collectible.webp`
- Create: `public/products/custom-team-crest.webp`
- Create: `public/products/rattan-style-tray.webp`
- Create: `public/products/tissue-box-cover.webp`
- Create: `public/products/key-tray.webp`
- Create: `public/products/climber-wall-hooks.webp`
- Create: `public/products/tent-lamp.webp`
- Create: `public/products/martial-arts-display.webp`
- Create: `public/products/custom-event-medals.webp`
- Modify: `tests/products.test.mjs`

**Interfaces:**
- Consumes: `catalogItems: CatalogItem[]` from `app/products/catalog.ts`.
- Produces: nine valid WebP files matching every `CatalogItem.image` path.

- [ ] **Step 1: Add the failing asset-integrity test**

Append to `tests/products.test.mjs` and add the imports shown:

```js
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

test('ships optimized local WebP media for every catalog item', async () => {
  const { catalogItems } = await loadCatalog();
  let totalBytes = 0;

  for (const item of catalogItems) {
    const filePath = path.join('public', item.image.slice(1));
    const bytes = await readFile(filePath);
    const info = await stat(filePath);

    assert.equal(bytes.subarray(0, 4).toString('ascii'), 'RIFF');
    assert.equal(bytes.subarray(8, 12).toString('ascii'), 'WEBP');
    assert.ok(info.size <= 300 * 1024, `${item.slug} exceeds 300 KB`);
    totalBytes += info.size;
  }

  assert.ok(totalBytes <= 2.7 * 1024 * 1024, 'catalog media exceeds 2.7 MB');
});
```

- [ ] **Step 2: Run the asset test and verify it fails**

Run:

```bash
node --test --test-name-pattern="ships optimized local WebP media" tests/products.test.mjs
```

Expected: FAIL with `ENOENT` for `public/products/personalized-collectible.webp`.

- [ ] **Step 3: Create the reproducible optimizer**

Create `scripts/optimize_product_images.py`:

```python
from pathlib import Path
import sys
from PIL import Image, ImageOps

SLUGS = [
    "personalized-collectible",
    "custom-team-crest",
    "rattan-style-tray",
    "tissue-box-cover",
    "key-tray",
    "climber-wall-hooks",
    "tent-lamp",
    "martial-arts-display",
    "custom-event-medals",
]
MAX_EDGE = 1600
MAX_BYTES = 300 * 1024
MAX_TOTAL_BYTES = int(2.7 * 1024 * 1024)


def source_for(directory: Path, slug: str) -> Path:
    matches = [path for path in directory.glob(f"{slug}.*") if path.suffix.lower() != ".webp"]
    if len(matches) != 1:
        raise SystemExit(f"expected one source image for {slug}, found {len(matches)}")
    return matches[0]


def save_webp(image: Image.Image, target: Path) -> int:
    quality = 82
    while quality >= 64:
        image.save(target, "WEBP", quality=quality, method=6)
        if target.stat().st_size <= MAX_BYTES:
            return target.stat().st_size
        quality -= 3
    raise SystemExit(f"could not reduce {target.name} below 300 KB without dropping below quality 64")


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("usage: optimize_product_images.py SOURCE_DIR OUTPUT_DIR")

    source_dir = Path(sys.argv[1])
    output_dir = Path(sys.argv[2])
    output_dir.mkdir(parents=True, exist_ok=True)
    total = 0

    for slug in SLUGS:
        with Image.open(source_for(source_dir, slug)) as opened:
            image = ImageOps.exif_transpose(opened).convert("RGB")
            image.thumbnail((MAX_EDGE, MAX_EDGE), Image.Resampling.LANCZOS)
            total += save_webp(image, output_dir / f"{slug}.webp")

    if total > MAX_TOTAL_BYTES:
        raise SystemExit(f"catalog media is {total} bytes; limit is {MAX_TOTAL_BYTES}")

    print(f"wrote {len(SLUGS)} images totaling {total} bytes")


if __name__ == "__main__":
    main()
```

- [ ] **Step 4: Collect the exact source media from Instagram**

Use the in-app browser skill and the authenticated `@molinaristudios` tab. For each post URL from `catalog.ts`:

1. Navigate to the post.
2. Ensure the approved product photo is visibly selected; for the martial-arts and medals carousels, choose the frame that shows the full product most clearly.
3. Read the tab's `pageAssets` capability documentation, call `list()` after the image is visible, and bundle the image asset associated with the displayed post image.
4. Copy the bundled image into one temporary source directory using the corresponding catalog slug plus its original extension.

Do not download the three logo posts or any reel media. Do not hotlink or retain Instagram CDN URLs in the application.

- [ ] **Step 5: Convert the downloaded media**

Call `load_workspace_dependencies` to obtain the bundled Python runtime with Pillow. Set `TASK_IMAGE_PYTHON` to the exact Python path returned by that tool and `TASK_IMAGE_SOURCE_DIR` to the explicit temporary directory created in Step 4, then run:

```bash
"$TASK_IMAGE_PYTHON" scripts/optimize_product_images.py "$TASK_IMAGE_SOURCE_DIR" public/products
```

The script must report nine files and a total at or below 2.7 MB.

- [ ] **Step 6: Run the catalog and asset tests**

```bash
node --test tests/products.test.mjs
```

Expected: both tests PASS.

- [ ] **Step 7: Commit the optimized media and reproducible script**

```bash
git add scripts/optimize_product_images.py public/products tests/products.test.mjs
git commit -m "feat: add optimized product photography"
```

---

### Task 3: Render the Product Gallery and Custom-Order Feature

**Files:**
- Create: `app/products/product-gallery.tsx`
- Modify: `app/page.tsx:1-166`
- Modify: `app/globals.css:676-728,754-800`
- Modify: `tests/site.test.mjs:35-54`

**Interfaces:**
- Consumes: `CatalogItem`, `products`, `customOrder`, and `instagramDmUrl` from `app/products/catalog.ts`.
- Produces: `ProductGallery({ items, customOrder }: ProductGalleryProps): JSX.Element` and homepage section `#products`.

- [ ] **Step 1: Write the failing homepage integration test**

Add this test to `tests/site.test.mjs` and update the existing section-flow test from `id="work"` to `id="products"`:

```js
test('renders the approved product catalog and Instagram actions', async () => {
  const html = await renderHomePage();

  assert.match(html, /id="products"/);
  assert.doesNotMatch(html, /id="work"/);
  assert.equal((html.match(/data-catalog-kind="product"/g) ?? []).length, 8);
  assert.equal((html.match(/data-catalog-kind="custom-order"/g) ?? []).length, 1);
  assert.match(html, /Personalized Collectible/);
  assert.match(html, /Custom Event Medals/);
  assert.equal((html.match(/>DM on Instagram</g) ?? []).length, 9);
  assert.equal((html.match(/>View original post</g) ?? []).length, 9);
  assert.equal((html.match(/target="_blank"/g) ?? []).length, 18);
  assert.equal((html.match(/rel="noreferrer"/g) ?? []).length, 18);
  assert.match(html, /href="#products"[^>]*>Products</);
  assert.match(html, /href="#products"[^>]*>Explore products/);
});
```

- [ ] **Step 2: Run the integration test and verify it fails**

```bash
node --test --test-name-pattern="renders the approved product catalog" tests/site.test.mjs
```

Expected: FAIL because `#products` and the catalog cards do not exist.

- [ ] **Step 3: Implement the server-rendered gallery component**

Create `app/products/product-gallery.tsx`:

```tsx
import type { CatalogItem } from './catalog';
import { instagramDmUrl } from './catalog';

const assetPath = (path: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path}`;

type ProductGalleryProps = {
  items: CatalogItem[];
  customOrder: CatalogItem;
};

function ProductActions({ item }: { item: CatalogItem }) {
  return (
    <div className="product-actions">
      <a
        className="product-action product-action-primary"
        href={instagramDmUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`DM Molinari Studios on Instagram about ${item.title}`}
      >
        DM on Instagram <span aria-hidden="true">↗</span>
      </a>
      <a
        className="product-action product-action-secondary"
        href={item.sourceUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`View the original Instagram post for ${item.title}`}
      >
        View original post
      </a>
    </div>
  );
}

function ProductCard({ item, index }: { item: CatalogItem; index: number }) {
  return (
    <article className="product-card" data-catalog-kind="product">
      <div className="product-image-frame">
        <img
          className="product-image"
          src={assetPath(item.image)}
          alt={item.alt}
          loading="lazy"
          style={{ objectPosition: item.imagePosition ?? 'center' }}
        />
        <span className="product-number">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="product-copy">
        {item.note && <p className="product-note">{item.note}</p>}
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <ProductActions item={item} />
      </div>
    </article>
  );
}

export function ProductGallery({ items, customOrder }: ProductGalleryProps) {
  return (
    <section className="products-section section" id="products">
      <div className="shell">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Made by Molinari Studios</p>
            <h2>Objects made to <em>feel personal.</em></h2>
          </div>
          <p className="section-lede">
            Useful details, expressive decor, and one-of-a-kind gifts—made to order and shaped around the people who will use them.
          </p>
        </div>

        <div className="products-grid">
          {items.map((item, index) => (
            <ProductCard key={item.slug} item={item} index={index} />
          ))}
        </div>

        <article className="custom-order-card" data-catalog-kind="custom-order">
          <div className="custom-order-image-frame">
            <img
              className="product-image"
              src={assetPath(customOrder.image)}
              alt={customOrder.alt}
              loading="lazy"
              style={{ objectPosition: customOrder.imagePosition ?? 'center' }}
            />
          </div>
          <div className="custom-order-copy">
            <p className="product-note">Custom order example</p>
            <h3>{customOrder.title}</h3>
            <p>{customOrder.description}</p>
            <ProductActions item={customOrder} />
          </div>
        </article>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Replace the Work section and update navigation**

At the top of `app/page.tsx`, add:

```tsx
import { customOrder, products } from './products/catalog';
import { ProductGallery } from './products/product-gallery';
```

Change the primary navigation and hero link:

```tsx
<a href="#products">Products</a>
```

```tsx
<a className="text-link" href="#products">Explore products <span>↓</span></a>
```

Replace the complete `<section className="work-section section" id="work">…</section>` block with:

```tsx
<ProductGallery items={products} customOrder={customOrder} />
```

- [ ] **Step 5: Replace the abstract Work CSS with the catalog styles**

Remove `.work-grid`, `.work-card`, `.work-card-wide`, `.work-visual`, `.functional-visual`, `.part*`, `.detail-*`, `.display-*`, and `.work-meta*` rules. Add:

```css
.products-section { background: var(--cream-soft); }

.products-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 32px;
}

.product-card {
  overflow: hidden;
  border: 1px solid #d6cbbb;
  background: #f4ecdf;
}

.product-image-frame,
.custom-order-image-frame {
  position: relative;
  overflow: hidden;
  background: #d9cdbb;
}

.product-image-frame { aspect-ratio: 4 / 5; }

.product-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: transform .35s ease;
}

.product-card:hover .product-image,
.custom-order-card:hover .product-image { transform: scale(1.025); }

.product-number {
  position: absolute;
  right: 18px;
  bottom: 18px;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  background: var(--green);
  color: var(--cream);
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 13px;
}

.product-copy { padding: 30px; }
.product-note { margin: 0; color: #927031; font-size: 9px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }
.product-copy h3,
.custom-order-copy h3 { margin: 10px 0 14px; color: var(--green); font-family: Georgia, 'Times New Roman', serif; font-size: clamp(27px, 3vw, 38px); font-weight: 400; }
.product-copy > p:not(.product-note),
.custom-order-copy > p:not(.product-note) { margin: 0; color: #69736e; font-size: 14px; line-height: 1.7; }

.product-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 14px 22px; margin-top: 24px; }
.product-action { font-size: 10px; font-weight: 800; letter-spacing: .11em; text-transform: uppercase; }
.product-action-primary { padding: 13px 16px; background: var(--green); color: var(--cream); }
.product-action-primary:hover { background: var(--brass); }
.product-action-secondary { padding-block: 9px; border-bottom: 1px solid #a99679; color: var(--green); }
.product-action:focus-visible { outline: 3px solid #d4b067; outline-offset: 4px; }

.custom-order-card {
  margin-top: 72px;
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(320px, .75fr);
  border: 1px solid #d6cbbb;
  background: var(--green);
  color: var(--cream);
}

.custom-order-image-frame { min-height: 520px; }
.custom-order-copy { align-self: center; padding: clamp(36px, 6vw, 80px); }
.custom-order-copy h3 { color: var(--cream); font-size: clamp(38px, 4vw, 58px); }
.custom-order-copy > p:not(.product-note) { color: rgba(243,235,221,.72); }
.custom-order-copy .product-action-primary { background: var(--brass); }
.custom-order-copy .product-action-primary:hover { background: #c49a48; }
.custom-order-copy .product-action-secondary { border-color: rgba(243,235,221,.45); color: var(--cream); }

@media (max-width: 800px) {
  .products-grid { grid-template-columns: 1fr; }
  .custom-order-card { grid-template-columns: 1fr; }
  .custom-order-image-frame { min-height: 440px; }
}

@media (max-width: 560px) {
  .product-copy { padding: 24px; }
  .product-actions { align-items: stretch; flex-direction: column; }
  .product-action { text-align: center; }
  .custom-order-card { margin-top: 48px; }
  .custom-order-image-frame { min-height: 350px; }
  .custom-order-copy { padding: 30px 24px; }
}

@media (prefers-reduced-motion: reduce) {
  .product-image { transition: none; }
}
```

Remove the obsolete `.work-*` responsive overrides from the existing media queries so they do not refer to deleted classes.

- [ ] **Step 6: Run the focused integration test**

```bash
node --test --test-name-pattern="renders the approved product catalog" tests/site.test.mjs
```

Expected: PASS.

- [ ] **Step 7: Show the first meaningful local preview**

Start `pnpm dev` in a retained session. Use the exact Local URL printed by the development server and make one lightweight request:

```bash
curl -I "$TASK_SITE_LOCAL_URL"
```

Expected: HTTP 200. Then call `open_in_codex` with that exact URL and keep the resulting tab ID for later handoff. Do not perform screenshot or DOM-based visual QA unless the user asks.

- [ ] **Step 8: Commit the rendered gallery slice**

```bash
git add app/page.tsx app/globals.css app/products/product-gallery.tsx tests/site.test.mjs
git commit -m "feat: add Instagram product gallery"
```

---

### Task 4: Validate Accessibility and Both Static Export Modes

**Files:**
- Modify: `tests/site.test.mjs:65-128`
- Modify if validation requires fallback: `app/products/catalog.ts:15`

**Interfaces:**
- Consumes: rendered `#products` section and resolved `instagramDmUrl`.
- Produces: export regressions proving product paths work at both `/molinari-studios/` and `/`.

- [ ] **Step 1: Add failing product-path assertions to both export tests**

In the repository-subpath export test, add:

```js
assert.match(html, /src="\/molinari-studios\/products\/personalized-collectible\.webp"/);
```

In the custom-domain export test, add:

```js
assert.match(html, /src="\/products\/personalized-collectible\.webp"/);
assert.doesNotMatch(html, /src="\/molinari-studios\/products\//);
```

- [ ] **Step 2: Run the two export tests and confirm the new assertions exercise real output**

```bash
node --test --test-name-pattern="exports the homepage" tests/site.test.mjs
```

Expected: both export tests PASS. If a new assertion fails, fix the shared `assetPath()` usage in `product-gallery.tsx`; do not hard-code a deployment base path.

- [ ] **Step 3: Validate the preferred Instagram DM route**

```bash
curl -I -L --max-redirs 5 https://ig.me/m/molinaristudios
```

Accept the direct route only if it returns or redirects to an Instagram-owned HTTPS destination without a transport error. If validation fails, change exactly one line in `app/products/catalog.ts`:

```ts
export const instagramDmUrl = instagramProfileUrl;
```

Then rerun `node --test tests/products.test.mjs tests/site.test.mjs`.

- [ ] **Step 4: Run the complete validation suite**

```bash
pnpm test
pnpm lint
pnpm build
git diff --check
git status --short
```

Expected: tests, lint, the Sites/Vinext production build, and whitespace check pass. `git status --short` should show only the intended Task 4 test or fallback change before commit.

- [ ] **Step 5: Commit validation changes**

```bash
git add tests/site.test.mjs app/products/catalog.ts
git commit -m "test: cover product gallery exports"
```

Omit `app/products/catalog.ts` from `git add` when the preferred DM route validates and no fallback edit was needed.

- [ ] **Step 6: Review the final implementation before release**

Invoke `superpowers:requesting-code-review` with the implementation base SHA and current HEAD. Fix every Critical or Important finding, rerun the affected tests, and commit review fixes with:

```bash
git add app/page.tsx app/globals.css app/products/catalog.ts app/products/product-gallery.tsx public/products/*.webp scripts/optimize_product_images.py tests/products.test.mjs tests/site.test.mjs
git commit -m "fix: address product gallery review"
```

Request a focused re-review until no Critical or Important findings remain. Skip the fix commit when the first review has no such findings.

---

### Task 5: Publish the Accepted Release

**Files:**
- No planned source changes.
- Preserve: `.openai/hosting.json`

**Interfaces:**
- Consumes: validated `dist/`, the implementation commit SHA, and the existing GitHub remote.
- Produces: updated Sites deployment and updated GitHub Pages site at `https://molinaristudios.com/`.

- [ ] **Step 1: Confirm the release checkout is clean**

```bash
git status --short
git log -5 --oneline
```

Expected: clean working tree and the product-gallery commits at HEAD.

- [ ] **Step 2: Publish the validated Sites build**

Invoke `sites-hosting`. Reuse the successful `pnpm build`, existing project ID, and current access policy. Follow the hosting skill's approval rule if the deployment is shared or public, save one version from the exact HEAD commit, deploy it, and wait for a succeeded status.

- [ ] **Step 3: Push the release to GitHub**

```bash
git push origin main
```

Expected: the push succeeds and triggers `.github/workflows/pages.yml`.

- [ ] **Step 4: Verify GitHub Pages deployment**

Use GitHub CLI or the signed-in GitHub browser to find the Pages workflow for the pushed SHA. Wait until it succeeds, then verify:

```bash
curl -I https://molinaristudios.com/
```

Expected: HTTPS 200 from the custom domain.

- [ ] **Step 5: Hand off the published site**

Reuse the single Sites preview tab ID and call `open_in_codex` with the successful deployed URL. Return `https://molinaristudios.com/` as the primary deliverable and summarize that the site now includes eight products, the custom-medals example, and Instagram DM actions.
