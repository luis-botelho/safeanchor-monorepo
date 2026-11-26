// Gera os ícones da marca sem dependências externas.
// Uso: node apps/frontend/scripts/generate-brand-assets.mjs
// Saída: apps/frontend/public/*.png, favicon.ico
import { mkdirSync, writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import path from "node:path";

const publicDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
);
mkdirSync(publicDir, { recursive: true });

const NAVY = [16, 42, 67];
const TEAL = [22, 125, 131];
const MIST = [242, 246, 245];
const TRANSPARENT = [0, 0, 0, 0];

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  return c >>> 0;
});

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeAndData = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(typeAndData), 0);
  return Buffer.concat([length, typeAndData, checksum]);
}

function encodePng(width, height, pixels) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  const rows = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y += 1) {
    const offset = y * (1 + width * 4);
    rows[offset] = 0; // filtro None
    pixels.copy(rows, offset + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(rows, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function distanceToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSquared = dx * dx + dy * dy;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSquared));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function inTriangle(px, py, [ax, ay], [bx, by], [cx, cy]) {
  const sign = (x1, y1, x2, y2, x3, y3) =>
    (x1 - x3) * (y2 - y3) - (x2 - x3) * (y1 - y3);
  const d1 = sign(px, py, ax, ay, bx, by);
  const d2 = sign(px, py, bx, by, cx, cy);
  const d3 = sign(px, py, cx, cy, ax, ay);
  const hasNegative = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPositive = d1 > 0 || d2 > 0 || d3 > 0;
  return !(hasNegative && hasPositive);
}

function colorAt(nx, ny) {
  const radius = 0.22;
  const qx = Math.abs(nx - 0.5) - (0.5 - radius);
  const qy = Math.abs(ny - 0.5) - (0.5 - radius);
  const distance = Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) +
    Math.min(Math.max(qx, qy), 0) - radius;
  if (distance > 0) return TRANSPARENT;

  let color = distance > -0.014 ? TEAL : NAVY;

  const waveY = 0.87 + 0.024 * Math.sin(nx * Math.PI * 3);
  if (nx > 0.08 && nx < 0.92 && Math.abs(ny - waveY) < 0.04) {
    color = TEAL;
  }

  const ring = Math.hypot(nx - 0.5, ny - 0.3);
  const stem = nx > 0.465 && nx < 0.535 && ny > 0.3 && ny < 0.79;
  const crossbar = nx > 0.34 && nx < 0.66 && ny > 0.44 && ny < 0.5;
  const armLeft = distanceToSegment(nx, ny, 0.5, 0.74, 0.28, 0.6) < 0.032;
  const armRight = distanceToSegment(nx, ny, 0.5, 0.74, 0.72, 0.6) < 0.032;
  const flukeLeft = inTriangle(nx, ny, [0.28, 0.6], [0.16, 0.68], [0.3, 0.7]);
  const flukeRight = inTriangle(nx, ny, [0.72, 0.6], [0.84, 0.68], [0.7, 0.7]);

  if ((ring > 0.072 && ring < 0.145) || stem || crossbar || armLeft || armRight || flukeLeft || flukeRight) {
    color = MIST;
  }
  return [...color, 255];
}

function renderIcon(size) {
  const samples = size <= 32 ? 4 : 2;
  const pixels = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      let ar = 0;
      let ag = 0;
      let ab = 0;
      let aa = 0;
      for (let sy = 0; sy < samples; sy += 1) {
        for (let sx = 0; sx < samples; sx += 1) {
          const nx = (x + (sx + 0.5) / samples) / size;
          const ny = (y + (sy + 0.5) / samples) / size;
          const [r, g, b, a] = colorAt(nx, ny);
          if (a > 0) {
            ar += r * a;
            ag += g * a;
            ab += b * a;
            aa += a;
          }
        }
      }
      const offset = (y * size + x) * 4;
      if (aa === 0) continue;
      pixels[offset] = Math.round(ar / aa);
      pixels[offset + 1] = Math.round(ag / aa);
      pixels[offset + 2] = Math.round(ab / aa);
      pixels[offset + 3] = Math.round(aa / (samples * samples));
    }
  }
  return pixels;
}

function writePng(name, size) {
  const png = encodePng(size, size, renderIcon(size));
  writeFileSync(path.join(publicDir, name), png);
  return png;
}

const sizes = [
  ["favicon-16x16.png", 16],
  ["favicon-32x32.png", 32],
  ["apple-touch-icon.png", 180],
  ["android-chrome-192x192.png", 192],
  ["android-chrome-512x512.png", 512],
];

const frames = sizes.slice(0, 2).map(([name, size]) => ({
  size,
  png: writePng(name, size),
}));
sizes.slice(2).forEach(([name, size]) => writePng(name, size));

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(frames.length, 4);

let offset = 6 + frames.length * 16;
const entries = frames.map(({ size, png }) => {
  const entry = Buffer.alloc(16);
  entry[0] = size === 256 ? 0 : size;
  entry[1] = size === 256 ? 0 : size;
  entry[2] = 0;
  entry[3] = 0;
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(offset, 12);
  offset += png.length;
  return entry;
});

writeFileSync(
  path.join(publicDir, "favicon.ico"),
  Buffer.concat([header, ...entries, ...frames.map((frame) => frame.png)]),
);

console.log(`Ícones gerados em ${publicDir}`);
