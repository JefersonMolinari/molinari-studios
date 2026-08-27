import assert from 'node:assert/strict';
import { access, readFile, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import react from '@vitejs/plugin-react';
import { createServer } from 'vite';

async function renderHomePage() {
  const server = await createServer({
    appType: 'custom',
    configFile: false,
    plugins: [react()],
    server: { middlewareMode: true },
  });

  try {
    const page = await server.ssrLoadModule('/app/page.tsx');
    return renderToStaticMarkup(React.createElement(page.default));
  } finally {
    await server.close();
  }
}

test('presents Molinari Studios as a custom 3D-printing studio', async () => {
  const html = await renderHomePage();
  const text = html.replace(/<[^>]*>/g, '');

  assert.match(text, /Molinari STUDIOS/);
  assert.match(text, /Ideas, made tangible\./);
  assert.match(text, /Custom 3D printing/);
});

test('provides navigation and a direct project-start action', async () => {
  const html = await renderHomePage();

  assert.match(html, /<nav[\s>]/);
  assert.match(html, /href="#contact"/);
  assert.match(html, />Start a project</);
});

test('guides visitors through services, process, products, and project planning', async () => {
  const html = await renderHomePage();
  const text = html.replace(/<[^>]*>/g, '');

  assert.match(html, /id="services"/);
  assert.match(html, /id="process"/);
  assert.match(html, /id="products"/);
  assert.match(html, /id="contact"/);
  assert.match(text, /From rough idea to resolved object/);
  assert.match(text, /Four deliberate steps/);
  assert.match(text, /Build your project brief/);
});

test('renders the approved product catalog and Instagram actions', async () => {
  const html = await renderHomePage();

  assert.match(html, /id="products"/);
  assert.doesNotMatch(html, /id="work"/);
  assert.equal((html.match(/data-catalog-kind="product"/g) ?? []).length, 8);
  assert.equal(
    (html.match(/data-catalog-kind="custom-order"/g) ?? []).length,
    1,
  );
  assert.match(html, /Personalized Collectible/);
  assert.match(html, /Custom Event Medals/);
  assert.equal((html.match(/>DM on Instagram\s*</g) ?? []).length, 9);
  assert.equal((html.match(/>View original post</g) ?? []).length, 9);
  assert.equal((html.match(/target="_blank"/g) ?? []).length, 18);
  assert.equal((html.match(/rel="noreferrer"/g) ?? []).length, 18);
  assert.match(html, /href="#products"[^>]*>Products</);
  assert.match(html, /href="#products"[^>]*>Explore products\s*</);
});

test('uses a wide logo canvas that fits horizontal brand placements', async () => {
  const svg = await readFile('public/molinari-horizontal.svg', 'utf8');
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1].split(/\s+/).map(Number);

  assert.ok(viewBox, 'horizontal logo must define a viewBox');
  const [, , width, height] = viewBox;
  assert.ok(width / height >= 2.5, `expected a horizontal canvas, got ${width}:${height}`);
});

test('exports the homepage for a GitHub Pages repository subpath', async () => {
  await rm('out', { recursive: true, force: true });

  const build = spawnSync(
    process.execPath,
    ['node_modules/next/dist/bin/next', 'build'],
    {
      encoding: 'utf8',
      env: {
        ...process.env,
        NODE_ENV: 'production',
        GITHUB_PAGES: 'true',
        GITHUB_REPOSITORY: 'test-owner/molinari-studios',
        CUSTOM_DOMAIN: '',
        SITE_URL: 'https://test-owner.github.io/molinari-studios',
      },
    },
  );

  assert.equal(build.status, 0, `${build.stdout}\n${build.stderr}`);

  const hasExport = await access('out/index.html').then(
    () => true,
    () => false,
  );
  assert.equal(hasExport, true, 'Next.js must emit out/index.html for GitHub Pages');

  const html = await readFile('out/index.html', 'utf8');
  assert.match(html, /\/molinari-studios\/_next\/static\//);
  assert.match(html, /\/molinari-studios\/molinari-horizontal\.svg/);
  assert.match(
    html,
    /src="\/molinari-studios\/products\/personalized-collectible\.webp"/,
  );
  assert.match(
    html,
    /<link[^>]+rel="icon"[^>]+href="\/molinari-studios\/favicon\.svg"/,
  );
  assert.match(html, /https:\/\/test-owner\.github\.io\/molinari-studios\/og\.png/);
});

test('exports the homepage at the custom domain root', async () => {
  await rm('out', { recursive: true, force: true });

  const build = spawnSync(
    process.execPath,
    ['node_modules/next/dist/bin/next', 'build'],
    {
      encoding: 'utf8',
      env: {
        ...process.env,
        NODE_ENV: 'production',
        GITHUB_PAGES: 'true',
        GITHUB_REPOSITORY: 'test-owner/molinari-studios',
        CUSTOM_DOMAIN: 'molinaristudios.com',
        SITE_URL: 'https://molinaristudios.com',
      },
    },
  );

  assert.equal(build.status, 0, `${build.stdout}\n${build.stderr}`);

  const html = await readFile('out/index.html', 'utf8');
  assert.match(html, /(?:src|href)="\/_next\/static\//);
  assert.match(html, /src="\/molinari-horizontal\.svg"/);
  assert.match(html, /src="\/products\/personalized-collectible\.webp"/);
  assert.doesNotMatch(html, /src="\/molinari-studios\/products\//);
  assert.match(html, /<link[^>]+rel="icon"[^>]+href="\/favicon\.svg"/);
  assert.match(html, /https:\/\/molinaristudios\.com\/og\.png/);
  assert.doesNotMatch(html, /(?:src|href)="\/molinari-studios\//);
});
