// Draws the app icons (dark tile, hazard stripe, yellow check mark) into public/ without image libraries.
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const out = path.resolve(import.meta.dirname, '..', 'public');
mkdirSync(out, { recursive: true });

const BG = [20, 20, 20];
const YELLOW = [242, 183, 5];
const CHECK = [
  [0.27, 0.58],
  [0.43, 0.74],
  [0.75, 0.42],
];
const STROKE = 0.1;

function distToSegment(px, py, [ax, ay], [bx, by]) {
  const dx = bx - ax;
  const dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function colorAt(x, y) {
  if (y > 0.2 && y < 0.3) return (x + y) * 10 % 2 < 1 ? YELLOW : BG; // diagonal stripes
  const d = Math.min(distToSegment(x, y, CHECK[0], CHECK[1]), distToSegment(x, y, CHECK[1], CHECK[2]));
  return d < STROKE / 2 ? YELLOW : BG;
}

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function png(size) {
  const SS = 3; // supersampling per axis
  const rows = [];
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 3);
    for (let x = 0; x < size; x++) {
      const acc = [0, 0, 0];
      for (let sy = 0; sy < SS; sy++)
        for (let sx = 0; sx < SS; sx++) {
          const c = colorAt((x + (sx + 0.5) / SS) / size, (y + (sy + 0.5) / SS) / size);
          for (let i = 0; i < 3; i++) acc[i] += c[i];
        }
      for (let i = 0; i < 3; i++) row[1 + x * 3 + i] = Math.round(acc[i] / (SS * SS));
    }
    rows.push(row);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // RGB
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(Buffer.concat(rows))),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

for (const [name, size] of [['icon-192.png', 192], ['icon-512.png', 512], ['apple-touch-icon.png', 180]]) {
  writeFileSync(path.join(out, name), png(size));
  console.log(name);
}

const pts = CHECK.map(([x, y]) => `${x * 100},${y * 100}`).join(' ');
writeFileSync(
  path.join(out, 'icon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<defs><pattern id="h" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="5" height="10" fill="#F2B705"/></pattern></defs>
<rect width="100" height="100" rx="18" fill="#141414"/><rect y="20" width="100" height="10" fill="url(#h)"/>
<polyline points="${pts}" fill="none" stroke="#F2B705" stroke-width="10" stroke-linecap="butt" stroke-linejoin="miter"/>
</svg>
`,
);
console.log('icon.svg');
