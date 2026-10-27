// Downloads the Test Engineering weekly decks listed in sources/test-engineering/doc-links.txt
// as .pptx files into sources/test-engineering/pptx/weekNN.pptx.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const srcDir = path.join(root, 'sources', 'test-engineering');
const outDir = path.join(srcDir, 'pptx');

const text = await readFile(path.join(srcDir, 'doc-links.txt'), 'utf8');
const entries = [...text.matchAll(/week(\d+)\s*:\s*\r?\n\s*(\S+)/g)].map(m => ({ week: Number(m[1]), url: m[2] }));

function downloadUrl(url) {
  const slides = url.match(/docs\.google\.com\/presentation\/d\/([^/]+)/);
  if (slides) return `https://docs.google.com/presentation/d/${slides[1]}/export/pptx`;
  const drive = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (drive) return `https://drive.usercontent.google.com/download?id=${drive[1]}&export=download&confirm=t`;
  throw new Error(`Unknown link format: ${url}`);
}

await mkdir(outDir, { recursive: true });
const force = process.argv.includes('--force');

for (const { week, url } of entries) {
  const file = path.join(outDir, `week${String(week).padStart(2, '0')}.pptx`);
  if (existsSync(file) && !force) {
    console.log(`week ${week}: already downloaded`);
    continue;
  }
  const res = await fetch(downloadUrl(url));
  if (!res.ok) throw new Error(`week ${week}: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.subarray(0, 2).toString() !== 'PK') throw new Error(`week ${week}: response is not a pptx file`);
  await writeFile(file, buf);
  console.log(`week ${week}: ${(buf.length / 1024 / 1024).toFixed(1)} MB`);
}
