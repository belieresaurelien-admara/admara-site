#!/usr/bin/env node
/**
 * QR code generator for ADMARA business cards.
 * Outputs:
 *   - qr-<name>.png + .svg : standalone QR (1024x1024, brand colors)
 *   - qr-<name>-wallpaper.png : iPhone 13 wallpaper format (1170x2532) with brand layout
 *
 * Usage: node scripts/generate-qr.mjs
 */
import QRCode from 'qrcode';
import {Resvg} from '@resvg/resvg-js';
import {writeFile, mkdir} from 'node:fs/promises';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'brand-assets', 'qr');

const INK = '#0A0A0A';
const CREAM = '#F4EFE6';
const BRICK = '#8E3A19';
const OLIVE = '#726D2D';

const cards = [
  {
    name: 'alyssia',
    url: 'https://admara-studio.com/alyssia',
    personName: 'Alyssia Mezaache',
    role: 'Co-fondatrice — Direction artistique'
  }
];

await mkdir(OUT_DIR, {recursive: true});

for (const {name, url, personName, role} of cards) {
  const baseOpts = {
    errorCorrectionLevel: 'H',
    margin: 2,
    color: {dark: INK, light: CREAM}
  };

  // 1. Standalone QR — PNG 1024x1024 + SVG vector
  const pngPath = join(OUT_DIR, `qr-${name}.png`);
  await QRCode.toFile(pngPath, url, {...baseOpts, width: 1024, type: 'png'});

  const svgPath = join(OUT_DIR, `qr-${name}.svg`);
  await QRCode.toFile(svgPath, url, {...baseOpts, type: 'svg'});

  // 2. iPhone 13 wallpaper (1170x2532). Compose SVG, rasterize via resvg.
  const qrSvgString = await QRCode.toString(url, {
    ...baseOpts,
    type: 'svg',
    margin: 0
  });

  // qrcode lib emits stroked horizontal lines for modules — extract the full
  // inner content (background rect + stroked path) and embed as a <g>.
  const sizeMatch = qrSvgString.match(/viewBox="0 0 (\d+) (\d+)"/);
  if (!sizeMatch) throw new Error('Cannot read QR viewBox');
  const qrModuleSize = parseInt(sizeMatch[1], 10);
  const qrInner = qrSvgString
    .replace(/<\?xml[^>]*\?>/, '')
    .replace(/<!DOCTYPE[^>]*>/, '')
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>/, '')
    .trim();

  // Wallpaper geometry: 1170x2532. QR centered, ~820px wide, around screen center.
  const W = 1170;
  const H = 2532;
  const QR_SIZE = 820;
  const QR_X = (W - QR_SIZE) / 2;
  const QR_Y = (H - QR_SIZE) / 2 - 60; // slight upward bias for visual balance
  const scale = QR_SIZE / qrModuleSize;

  const wallpaperSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${CREAM}"/>

  <!-- Top wordmark -->
  <text x="${W / 2}" y="380"
        font-family="'Cormorant Garamond', Georgia, serif"
        font-size="180" font-weight="400"
        fill="${OLIVE}" text-anchor="middle"
        letter-spacing="2">Admara</text>
  <text x="${W / 2}" y="450"
        font-family="'Tenor Sans', Helvetica, sans-serif"
        font-size="32" font-weight="400"
        fill="${INK}" fill-opacity="0.55"
        text-anchor="middle"
        letter-spacing="6"
        text-transform="uppercase">STUDIO NOMADE</text>

  <!-- QR -->
  <g transform="translate(${QR_X}, ${QR_Y}) scale(${scale})" shape-rendering="crispEdges">
    ${qrInner}
  </g>

  <!-- Center wordmark mask (covers ~20% of QR, well under error correction H 30% recovery) -->
  <g>
    <rect
      x="${QR_X + QR_SIZE / 2 - 175}"
      y="${QR_Y + QR_SIZE / 2 - 60}"
      width="350"
      height="120"
      rx="12"
      fill="${CREAM}"/>
    <text
      x="${QR_X + QR_SIZE / 2}"
      y="${QR_Y + QR_SIZE / 2 + 24}"
      font-family="'Cormorant Garamond', Georgia, serif"
      font-size="80"
      font-weight="500"
      fill="${INK}"
      text-anchor="middle"
      letter-spacing="4">ADMARA</text>
  </g>

  <!-- Brick divider -->
  <rect x="${(W - 80) / 2}" y="${QR_Y + QR_SIZE + 90}" width="80" height="3" fill="${BRICK}"/>

  <!-- Person name -->
  <text x="${W / 2}" y="${QR_Y + QR_SIZE + 200}"
        font-family="'Cormorant Garamond', Georgia, serif"
        font-size="78" font-weight="400"
        fill="${INK}" text-anchor="middle"
        letter-spacing="1">${personName}</text>
  <text x="${W / 2}" y="${QR_Y + QR_SIZE + 256}"
        font-family="'Tenor Sans', Helvetica, sans-serif"
        font-size="28" font-weight="400"
        fill="${BRICK}" text-anchor="middle"
        letter-spacing="4"
        text-transform="uppercase">${role.toUpperCase()}</text>

  <!-- URL footer -->
  <text x="${W / 2}" y="${H - 120}"
        font-family="'Tenor Sans', Helvetica, sans-serif"
        font-size="32" font-weight="400"
        fill="${INK}" fill-opacity="0.55"
        text-anchor="middle"
        letter-spacing="4">admara-studio.com/${name}</text>
</svg>`;

  const wallpaperSvgPath = join(OUT_DIR, `qr-${name}-wallpaper.svg`);
  await writeFile(wallpaperSvgPath, wallpaperSvg, 'utf8');

  const wallpaperPng = new Resvg(wallpaperSvg, {
    fitTo: {mode: 'width', value: W},
    font: {loadSystemFonts: true}
  })
    .render()
    .asPng();

  const wallpaperPngPath = join(OUT_DIR, `qr-${name}-wallpaper.png`);
  await writeFile(wallpaperPngPath, wallpaperPng);

  console.log(`✓ ${name}`);
  console.log(`    standalone : ${pngPath} + ${svgPath}`);
  console.log(`    wallpaper  : ${wallpaperPngPath} (${W}x${H})`);
}
