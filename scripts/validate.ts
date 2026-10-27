// Validates every course file listed in data/courses/index.json against the shared schema.
// Usage: npm run validate   (exits with code 1 and lists question ids on error)
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { LETTERS, type Course, type Manifest, type Question } from '../src/types';

const dir = path.resolve(import.meta.dirname, '..', 'data', 'courses');
const errors: string[] = [];
const warnings: string[] = [];
const seenIds = new Map<string, string>();

// Patterns that break option shuffling or make generated questions ambiguous.
const FORBIDDEN_OPTION = /\b(all|none|both|neither) of the (above|following)\b|\bboth [A-E] and [A-E]\b|\b(options?|choices?|answers?) [A-E]\b/i;
const LETTER_REF = /\b(options?|choices?|answers?) \(?[A-E]\)?(?![a-z])/;

function isText(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function checkQuestion(course: Course, q: Question, where: string) {
  const err = (msg: string) => errors.push(`${course.id} / ${q?.id ?? where}: ${msg}`);
  if (!isText(q.id)) return err('id missing');
  if (seenIds.has(q.id)) err(`duplicate id (also in ${seenIds.get(q.id)})`);
  seenIds.set(q.id, course.id);

  const { primary, secondary } = course.languages;
  if (!isText(q.prompt?.[primary])) err(`prompt.${primary} missing`);
  const primaryOptions = q.options?.[primary];
  if (!Array.isArray(primaryOptions)) return err(`options.${primary} missing`);
  const count = primaryOptions.length;
  if (count < 2 || count > 5) err(`option count ${count} (must be 2–5)`);
  primaryOptions.forEach((o, i) => isText(o) || err(`options.${primary}[${i}] empty`));
  // Case-sensitive on purpose: options like "f(t) / R(t)" and "F(t) / R(t)" are different answers.
  if (new Set(primaryOptions.map(o => o.trim())).size !== count) {
    // Official sources contain a few verbatim duplicates (isg-398, isg-431b); keep them as printed.
    if (course.origin === 'generated') err('duplicate options');
    else warnings.push(`${course.id} / ${q.id}: duplicate options (kept as in source)`);
  }

  for (const lang of Object.keys(q.options)) {
    if (lang !== primary && lang !== secondary) err(`unknown language "${lang}" in options`);
    if (q.options[lang].length !== count) err(`options.${lang} has ${q.options[lang].length} options, ${primary} has ${count}`);
  }
  for (const lang of Object.keys(q.prompt)) {
    if (lang !== primary && lang !== secondary) err(`unknown language "${lang}" in prompt`);
  }
  if (secondary && isText(q.prompt[secondary]) !== Array.isArray(q.options[secondary])) {
    err(`prompt.${secondary} and options.${secondary} must both exist or both be missing`);
  }

  if (!Array.isArray(q.answer) || q.answer.length === 0) err('answer missing');
  else {
    for (const a of q.answer) {
      const idx = LETTERS.indexOf(a);
      if (idx < 0 || idx >= count) err(`answer "${a}" out of range`);
    }
  }

  if (q.explanation !== undefined && !isText(q.explanation[primary])) err(`explanation.${primary} empty`);
  if (q.source !== undefined && !isText(q.source.file)) err('source.file missing');

  if (course.origin === 'generated') {
    if (!q.explanation) err('generated question needs explanation');
    if (!q.source) err('generated question needs source');
    if (q.answer?.length !== 1) err('generated question must have exactly one answer');
    primaryOptions.forEach((o, i) => FORBIDDEN_OPTION.test(o) && err(`option ${LETTERS[i]} uses a forbidden pattern: "${o}"`));
    if (q.explanation && LETTER_REF.test(q.explanation[primary])) err('explanation refers to an option letter');
  }
}

function checkCourse(file: string, expectedId: string) {
  const course = JSON.parse(readFileSync(path.join(dir, file), 'utf8')) as Course;
  const err = (msg: string) => errors.push(`${file}: ${msg}`);
  if (course.schemaVersion !== 1) err('schemaVersion must be 1');
  if (course.id !== expectedId) err(`id "${course.id}" does not match manifest id "${expectedId}"`);
  if (!isText(course.title)) err('title missing');
  if (!isText(course.languages?.primary)) err('languages.primary missing');
  if (course.origin !== 'official' && course.origin !== 'generated') err('origin must be official or generated');
  if (!Array.isArray(course.sets) || course.sets.length === 0) return err('no sets');

  const setIds = new Set<string>();
  const letters: Record<string, number> = {};
  let total = 0;
  let withSecondary = 0;
  for (const set of course.sets) {
    if (!isText(set.id) || setIds.has(set.id)) err(`set id "${set.id}" missing or duplicate`);
    setIds.add(set.id);
    if (!Array.isArray(set.questions) || set.questions.length === 0) err(`set ${set.id} has no questions`);
    set.questions.forEach((q, i) => {
      checkQuestion(course, q, `${set.id}[${i}]`);
      total++;
      if (course.languages.secondary && q.prompt?.[course.languages.secondary]) withSecondary++;
      if (q.answer?.length === 1) letters[q.answer[0]] = (letters[q.answer[0]] ?? 0) + 1;
    });
  }
  const dist = Object.keys(letters).sort().map(l => `${l}=${letters[l]}`).join(' ');
  const sec = course.languages.secondary ? `, ${withSecondary} with ${course.languages.secondary}` : '';
  console.log(`${course.id}: ${course.sets.length} sets, ${total} questions${sec}; answers ${dist}`);
}

const manifest = JSON.parse(readFileSync(path.join(dir, 'index.json'), 'utf8')) as Manifest;
const manifestIds = new Set<string>();
for (const entry of manifest.courses) {
  if (manifestIds.has(entry.id)) errors.push(`index.json: duplicate course id ${entry.id}`);
  manifestIds.add(entry.id);
  if (!existsSync(path.join(dir, entry.file))) {
    errors.push(`index.json: ${entry.file} not found`);
    continue;
  }
  try {
    checkCourse(entry.file, entry.id);
  } catch (e) {
    errors.push(`${entry.file}: ${(e as Error).message}`);
  }
}

for (const w of warnings) console.warn('  warning: ' + w);
if (errors.length) {
  console.error(`\n${errors.length} error(s):`);
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}
console.log('OK');
