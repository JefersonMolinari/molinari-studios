# Instagram Product Gallery Design

**Date:** 2026-08-26  
**Status:** Approved in conversation; awaiting written-spec review

## Objective

Replace the homepage's generic “Work” examples with a real product catalog built from the approved posts on `@molinaristudios`. The catalog should help visitors understand what Molinari STUDIOS makes and start an Instagram conversation without introducing prices, checkout, or account features.

## Current Site Context

Molinari STUDIOS is a one-page, statically exported Next.js site. The homepage already has Services, Process, Work, and Contact sections, uses a green/cream/brass visual system, and publishes through GitHub Pages at `https://molinaristudios.com/`. The project also has an existing Sites deployment configuration.

The current Work section uses abstract CSS illustrations and generic application examples. This change replaces that section with concrete products and photographs while preserving the rest of the page structure and visual identity.

## Source Selection

Use only the content sequence approved by the owner:

- Ignore the three pinned logo posts.
- Use the next eight static posts as products.
- Use the following medals post as a custom-order example.
- Ignore all remaining reels.

The selected source posts are:

| Order | Product title | Instagram post | Website description |
| --- | --- | --- | --- |
| 1 | Personalized Collectible | `https://www.instagram.com/molinaristudios/p/Dcgypi5tJ8F/` | A custom figure created from a customer photo; positioned as a personal gift or keepsake. |
| 2 | Custom Team Crest | `https://www.instagram.com/molinaristudios/p/DcgvmWONpdh/` | A personalized club display produced in the customer's chosen team and colors. |
| 3 | Rattan-Style Tray | `https://www.instagram.com/molinaristudios/p/DcgfqB4NyvF/` | A textured decorative tray for coffee tables, vanities, shelves, and other styled spaces. |
| 4 | Tissue Box Cover | `https://www.instagram.com/molinaristudios/p/DceJvo4NS9A/` | A customizable cover that elevates an everyday home or office item. |
| 5 | Key Tray | `https://www.instagram.com/molinaristudios/p/DceIeXztRbn/` | Organized storage for keys, coins, and small essentials, with selectable colors. |
| 6 | Climber Wall Hooks | `https://www.instagram.com/molinaristudios/p/Dcdz8izNIXj/` | Colorful climbing-figure hooks for keys, bags, purses, and accessories. |
| 7 | Tent Lamp | `https://www.instagram.com/molinaristudios/p/DcdxT1LNLwR/` | Customizable camping-inspired decor with a warm ambient glow. |
| 8 | Martial Arts Display | `https://www.instagram.com/molinaristudios/p/DcbKA_Dm1f3/` | A personalized gi and belt presentation piece for martial-arts practitioners. |
| Custom order | Custom Event Medals | `https://www.instagram.com/molinaristudios/p/DcbJhquG96x/` | The Vancouver Beach Tennis Open medals, presented as proof of custom work for tournaments, teams, and events. |

The website copy may be lightly edited for clarity and consistency, but it must not invent dimensions, materials, prices, lead times, or availability that the posts do not provide.

## User Experience

### Navigation and page flow

- Rename the primary navigation item from “Work” to “Products.”
- Rename the section anchor from `#work` to `#products` and update every internal link and test to use the new value.
- Change “Explore our work” in the hero to “Explore products,” targeting the product section.
- Keep Services, Process, the capabilities strip, Contact, and the footer in their current order.
- Place the product catalog where the current Work section appears, followed immediately by the custom-medals feature.

### Product gallery

- Render the eight products as an editorial two-column grid on wide screens and a one-column list on smaller screens.
- Use one strong source image per product. Select the first useful carousel frame unless another frame shows the product substantially more clearly.
- Keep image frames visually consistent while allowing a per-image focal position so important details are not cropped.
- Every product card contains:
  - descriptive product image;
  - product title;
  - short description;
  - a small customization note when supported by the source post;
  - primary “DM on Instagram” action;
  - secondary “View original post” action.
- Use the existing serif display type, sans-serif body type, green, cream, and brass palette, border language, and restrained hover movement.

### Custom-order feature

- Present Custom Event Medals as a full-width feature below the eight-product grid.
- Distinguish it from the product cards with a “Custom order example” label and larger image treatment.
- Explain that Molinari STUDIOS can produce tailored pieces for events, teams, and tournaments without implying that the pictured medals are a continuously stocked item.
- Include the same Instagram DM action and original-post link.

### Instagram actions

- The primary CTA URL is `https://ig.me/m/molinaristudios` and opens in a new tab.
- The secondary action opens the corresponding source post in a new tab.
- Every external link uses `rel="noreferrer"` or the framework-equivalent safe relationship value.
- If the direct DM route cannot be validated during implementation, replace the primary target with `https://www.instagram.com/molinaristudios/`; do not ship a broken direct-message link.

## Architecture

### Static product data

Keep catalog content in a small typed data module rather than embedding nine repeated objects directly in the homepage. Each product record contains:

- stable slug;
- title;
- description;
- optional customization note;
- local image path;
- descriptive image alternative text;
- Instagram source URL;
- optional image-position value;
- feature kind: `product` or `custom-order`.

The data is local and build-time only. No Instagram API, database, client-side fetching, or runtime synchronization is required.

### Components

- A product-gallery component receives the eight normal product records and renders the grid.
- A product-card component owns the repeated image, text, and action markup.
- A custom-order feature uses the same data shape but a distinct full-width presentation.
- The homepage imports the catalog and composes these pieces into the existing section position.

Components remain server-rendered and static unless an actual interaction requires client code. This feature does not require client state.

### Images

- Download approved images from the owner's Instagram posts and store them in `public/products/`.
- Use stable, descriptive filenames rather than Instagram CDN names.
- Do not hotlink Instagram CDN URLs; the deployed gallery must remain visible if Instagram changes or rate-limits its media URLs.
- Convert the selected source images to WebP at a consistent quality setting that preserves product detail while avoiding unnecessarily large files.
- Do not alter `public/og.png`; the catalog change does not change the site's brand identity or primary social headline.

## Failure Behavior

- Because content and images are local, an Instagram outage must not remove the catalog itself.
- If an image fails, meaningful alternative text and the product copy keep the card understandable.
- If the direct DM URL does not resolve during validation, the primary CTA falls back to the profile URL.
- Original-post links remain independent of the DM link and provide a second route to the Instagram account.
- There is no empty, loading, or API error state because the catalog is static.

## Accessibility and Responsive Requirements

- Use semantic section, article, heading, and link elements.
- Give every product image concise, descriptive alternative text; decorative elements remain hidden from assistive technology.
- Preserve visible keyboard focus for both actions on every card.
- Ensure link names identify their destination, including accessible context for repeated DM and source-post links.
- Maintain readable color contrast within the existing palette.
- At the current mobile breakpoint, collapse the gallery to one column, keep actions comfortably tappable, and prevent text or images from overflowing.
- Avoid animations that are required to discover or understand content.

## Testing and Validation

Add or update automated tests to verify:

- the navigation and hero link target the Products section;
- exactly eight normal products are rendered;
- the Custom Event Medals feature is present and identified as a custom-order example;
- every selected record has a local image, meaningful alt text, Instagram source URL, and DM action;
- product image files exist under `public/products/`;
- repeated external actions use safe new-tab attributes;
- the existing GitHub Pages repository-subpath export still succeeds;
- the custom-domain root export still succeeds;
- the project test suite, lint, and production build pass.

After the smallest representative product slice compiles, show the local preview through the existing Sites workflow. After the full change passes validation, publish the Sites version and push the commit to the GitHub repository so the existing GitHub Pages workflow updates `https://molinaristudios.com/`.

## Out of Scope

- Prices, cart, checkout, payment, inventory, and shipping.
- Product detail routes or modals.
- Automated Instagram synchronization or embedding.
- Instagram reels.
- Etsy integration.
- Contact forms, accounts, saved items, filtering, and search.
- Changes to the logo, hero artwork, overall brand palette, or social-preview image.

## Acceptance Criteria

The change is complete when:

1. The homepage presents the eight approved products with locally hosted Instagram imagery and accurate copy.
2. The medals post appears as a separate custom-order example.
3. Each item offers a working Instagram DM action and a source-post link.
4. The gallery matches the existing Molinari STUDIOS visual system and works on desktop and mobile layouts.
5. The catalog remains visible without a live Instagram data request.
6. Automated tests, lint, and production exports pass.
7. The updated site is published through both the current Sites deployment and the GitHub Pages workflow serving `molinaristudios.com`.
