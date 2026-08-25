import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
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

test('guides visitors through services, process, work, and project planning', async () => {
  const html = await renderHomePage();
  const text = html.replace(/<[^>]*>/g, '');

  assert.match(html, /id="services"/);
  assert.match(html, /id="process"/);
  assert.match(html, /id="work"/);
  assert.match(html, /id="contact"/);
  assert.match(text, /From rough idea to resolved object/);
  assert.match(text, /Four deliberate steps/);
  assert.match(text, /Build your project brief/);
});

test('uses a wide logo canvas that fits horizontal brand placements', async () => {
  const svg = await readFile('public/molinari-horizontal.svg', 'utf8');
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1].split(/\s+/).map(Number);

  assert.ok(viewBox, 'horizontal logo must define a viewBox');
  const [, , width, height] = viewBox;
  assert.ok(width / height >= 2.5, `expected a horizontal canvas, got ${width}:${height}`);
});
