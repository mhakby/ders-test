import manifest from '../data/courses/index.json';
import type { Course, Manifest, Question, QuestionSet } from './types';

// Every course file is bundled; adding a course only needs a JSON file and a manifest entry.
const modules = import.meta.glob<Course>(['../data/courses/*.json', '!../data/courses/index.json'], {
  eager: true,
  import: 'default',
});

export interface CourseIndex {
  course: Course;
  /** All question ids in data order. */
  ids: string[];
  byId: Map<string, { q: Question; set: QuestionSet; index: number }>;
}

export const courses: CourseIndex[] = (manifest as Manifest).courses
  .map(entry => modules[`../data/courses/${entry.file}`])
  .filter((c): c is Course => Boolean(c))
  .map(course => {
    const ids: string[] = [];
    const byId: CourseIndex['byId'] = new Map();
    for (const set of course.sets) {
      set.questions.forEach((q, index) => {
        ids.push(q.id);
        byId.set(q.id, { q, set, index });
      });
    }
    return { course, ids, byId };
  });

export function findCourse(id: string | undefined): CourseIndex | undefined {
  return courses.find(c => c.course.id === id);
}

/** Question ids of the sets in scope (undefined scope = all sets). */
export function scopedIds(ci: CourseIndex, scope: string[] | undefined): string[] {
  if (!scope) return ci.ids;
  const selected = new Set(scope);
  return ci.course.sets.filter(s => selected.has(s.id)).flatMap(s => s.questions.map(q => q.id));
}
