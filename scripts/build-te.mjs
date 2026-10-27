// Builds data/courses/test-engineering.json from sources/test-engineering/_questions/:
//   weekNN.json (slides), book-chNN.json (Jorgensen textbook), tutorial-NN.json (tutorial articles).
// A lesson file with the same name in _lessons/ adds the set's bilingual lesson, each question's
// concept link and the Turkish explanation.
// In the source files options[0] is always the correct answer; here options are shuffled
// deterministically so that the correct letter is balanced (every block of 5 questions in a set
// uses each of A–E once). Re-running on unchanged input gives identical output.
import { existsSync } from 'node:fs';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const qDir = path.join(root, 'sources', 'test-engineering', '_questions');
const lessonDir = path.join(root, 'sources', 'test-engineering', '_lessons');
const outFile = path.join(root, 'data', 'courses', 'test-engineering.json');
const LETTERS = ['A', 'B', 'C', 'D', 'E'];
const MIDTERM_LAST_WEEK = 6;
const BOOK = 'Jorgensen, Software Testing (2. baskı)';

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

// Part file kinds, in the order their sets appear in the app.
const KINDS = [
  {
    match: /^week(\d\d)\.json$/,
    setId: nn => `week-${nn}`,
    idPrefix: nn => `te-w${nn}`,
    title: (nn, part) => `Week ${Number(nn)}: ${part.title}`,
    source: (nn, q) => ({ file: `week${nn}.pptx`, kind: 'slides', slide: q.slide }),
    midterm: nn => Number(nn) <= MIDTERM_LAST_WEEK,
  },
  {
    match: /^book-ch(\d\d)\.json$/,
    setId: nn => `book-ch-${nn}`,
    idPrefix: nn => `te-b${nn}`,
    title: (nn, part) => `Kitap Bölüm ${Number(nn)}: ${part.title}`,
    source: (nn, q) => ({
      file: BOOK,
      kind: 'book',
      page: q.page,
      ...(q.exercise ? { exercise: `${Number(nn)}.${q.exercise}` } : {}),
    }),
    midterm: () => true,
  },
  {
    match: /^tutorial-(\d\d)\.json$/,
    setId: nn => `tutorial-${nn}`,
    idPrefix: nn => `te-t${nn}`,
    title: (nn, part) => `Tutorial ${Number(nn)}: ${part.title}`,
    source: (nn, q, part) => ({ file: new URL(part.url).hostname.replace(/^www\./, ''), kind: 'tutorial', section: q.section }),
    midterm: () => true,
  },
];

const files = (await readdir(qDir)).sort();
const sets = [];
const midtermSets = [];
const problems = [];

for (const kind of KINDS) {
  for (const file of files) {
    const nn = file.match(kind.match)?.[1];
    if (!nn) continue;
    const part = JSON.parse(await readFile(path.join(qDir, file), 'utf8'));
    const lessonFile = path.join(lessonDir, file);
    const lesson = existsSync(lessonFile) ? JSON.parse(await readFile(lessonFile, 'utf8')) : undefined;
    const setId = kind.setId(nn);
    const seenN = new Set();
    const questions = part.questions.map((q, i) => {
      const id = `${kind.idPrefix(nn)}-${String(q.n).padStart(2, '0')}`;
      if (seenN.has(q.n)) problems.push(`${file}: duplicate n ${q.n}`);
      seenN.add(q.n);
      if (q.options.length !== 5) problems.push(`${id}: ${q.options.length} options`);
      const block = shuffled([0, 1, 2, 3, 4], hash(`${setId}:${Math.floor(i / 5)}`));
      const target = block[i % 5] % q.options.length;
      const distractors = shuffled(q.options.slice(1), hash(id));
      const options = [];
      for (let k = 0; k < q.options.length; k++) options.push(k === target ? q.options[0] : distractors.shift());
      const link = lesson?.questions?.[String(q.n)];
      if (lesson && !link) problems.push(`${id}: no entry in _lessons/${file}`);
      return {
        id,
        number: String(q.n),
        prompt: { en: q.prompt },
        options: { en: options },
        answer: [LETTERS[target]],
        explanation: { en: q.explanation, ...(link?.explanation_tr ? { tr: link.explanation_tr } : {}) },
        ...(link?.concept ? { concept: link.concept } : {}),
        source: kind.source(nn, q, part),
      };
    });
    sets.push({
      id: setId,
      title: kind.title(nn, part),
      ...(lesson ? { lesson: { intro: lesson.intro, concepts: lesson.concepts } } : {}),
      questions,
    });
    if (kind.midterm(nn)) midtermSets.push(setId);
  }
}

const course = {
  schemaVersion: 1,
  id: 'test-engineering',
  title: 'Test Engineering (CEN315)',
  languages: { primary: 'en', help: 'tr' },
  origin: 'generated',
  sourceNote:
    'CEN315 haftalık slaytlarından (Week 1–13), ders kitabından (Jorgensen, Software Testing: A Craftsman\'s Approach, 2. baskı, Bölüm 1–11) ve tutorial makalesinden Claude tarafından üretildi. Vize kapsamı: Week 1–6, kitap s. 1–183, tutorial. Şüpheli bir cevapta kaynağa bakın ve "Bu soruda sorun var" ile işaretleyin.',
  presets: [{ id: 'vize', title: 'Vize', sets: midtermSets }],
  sets,
};

await writeFile(outFile, JSON.stringify(course, null, 1) + '\n');
const total = sets.reduce((n, s) => n + s.questions.length, 0);
console.log(`test-engineering.json: ${sets.length} sets, ${total} questions (vize: ${midtermSets.length} sets)`);
for (const s of sets) {
  const cards = s.lesson ? `${String(s.lesson.concepts.length).padStart(2)} cards` : '        ';
  console.log(`  ${s.id.padEnd(12)} ${String(s.questions.length).padStart(3)}  ${cards}  ${s.title}`);
}
if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
