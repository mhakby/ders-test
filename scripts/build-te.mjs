// Builds data/courses/test-engineering.json from sources/test-engineering/_questions/weekNN.json.
// In the source files options[0] is always the correct answer; here options are shuffled
// deterministically so that the correct letter is balanced (every block of 5 questions in a set
// uses each of A–E once). Re-running on unchanged input gives identical output.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const qDir = path.join(root, 'sources', 'test-engineering', '_questions');
const outFile = path.join(root, 'data', 'courses', 'test-engineering.json');
const LETTERS = ['A', 'B', 'C', 'D', 'E'];

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return h >>> 0;
}

function shuffled(items, seed) {
  let s = seed;
  const rand = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const files = (await readdir(qDir)).filter(f => /^week\d\d\.json$/.test(f)).sort();
const sets = [];
const problems = [];

for (const file of files) {
  const nn = file.slice(4, 6);
  const part = JSON.parse(await readFile(path.join(qDir, file), 'utf8'));
  const setId = `week-${nn}`;
  const seenN = new Set();
  const questions = part.questions.map((q, i) => {
    const id = `te-w${nn}-${String(q.n).padStart(2, '0')}`;
    if (seenN.has(q.n)) problems.push(`${file}: duplicate n ${q.n}`);
    seenN.add(q.n);
    if (q.options.length !== 5) problems.push(`${id}: ${q.options.length} options`);
    const block = shuffled([0, 1, 2, 3, 4], hash(`${setId}:${Math.floor(i / 5)}`));
    const target = block[i % 5] % q.options.length;
    const distractors = shuffled(q.options.slice(1), hash(id));
    const options = [];
    for (let k = 0; k < q.options.length; k++) options.push(k === target ? q.options[0] : distractors.shift());
    return {
      id,
      number: String(q.n),
      prompt: { en: q.prompt },
      options: { en: options },
      answer: [LETTERS[target]],
      explanation: { en: q.explanation },
      source: { file: `week${nn}.pptx`, slide: q.slide },
    };
  });
  sets.push({ id: setId, title: `Week ${Number(nn)}: ${part.title}`, questions });
}

const course = {
  schemaVersion: 1,
  id: 'test-engineering',
  title: 'Test Engineering (CEN315)',
  languages: { primary: 'en' },
  origin: 'generated',
  sourceNote:
    'CEN315 Introduction to Test Engineering haftalık slaytlarından (Week 1–13) Claude tarafından üretildi. Şüpheli bir cevapta slayta bakın ve "Bu soruda sorun var" ile işaretleyin.',
  sets,
};

await writeFile(outFile, JSON.stringify(course, null, 1) + '\n');
const total = sets.reduce((n, s) => n + s.questions.length, 0);
console.log(`test-engineering.json: ${sets.length} sets, ${total} questions`);
for (const s of sets) console.log(`  ${s.id}  ${String(s.questions.length).padStart(3)}  ${s.title}`);
if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
