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
    assert.match(
      item.sourceUrl,
      /^https:\/\/www\.instagram\.com\/molinaristudios\/p\/[A-Za-z0-9_-]+\/$/,
    );
    assert.ok(item.alt.length >= 20, `${item.slug} needs meaningful alt text`);
    assert.ok(
      item.description.length >= 40,
      `${item.slug} needs useful copy`,
    );
  }
});
