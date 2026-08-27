import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
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
  const personalized = catalog.catalogItems.find(
    (item) => item.slug === 'personalized-collectible',
  );
  assert.equal(personalized?.imageFit, 'contain');

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
