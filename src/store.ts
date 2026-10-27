import { useSyncExternalStore } from 'react';
import { courses } from './data';

export type Mode = 'seq' | 'shuffle';

export interface AnswerRec {
  choice: string;
  correct: boolean;
  at: number;
}

export interface DeckState {
  order: string[];
  pos: number;
  mode: Mode;
  /** Answers given in this round (review decks only, so a list can be solved again). */
  done?: Record<string, AnswerRec>;
  /** For generated decks (mix): what the deck was built from. */
  key?: string;
}

export interface CourseProgress {
  answers: Record<string, AnswerRec>;
  wrongCount: Record<string, number>;
  saved: Record<string, number>;
  flagged: Record<string, number>;
  decks: Record<string, DeckState>;
  lastDeck?: string;
  mode: Mode;
  /** Selected set ids; undefined means every set. */
  scope?: string[];
  /** Question count for mixed tests; 0 means all questions in scope. */
  mixSize: number;
  /** Sets whose lesson has been opened (the first tap on such a set goes straight to the quiz). */
  lessonSeen?: Record<string, number>;
  /** Language chosen for lessons and explanations. */
  helpLang?: string;
  updatedAt: number;
}

type AllProgress = Record<string, CourseProgress>;

const KEY = 'ders-test.progress.v1';

export function emptyProgress(): CourseProgress {
  return { answers: {}, wrongCount: {}, saved: {}, flagged: {}, decks: {}, mode: 'seq', mixSize: 20, updatedAt: 0 };
}

function load(): AllProgress {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as AllProgress) : {};
    for (const id of Object.keys(parsed)) parsed[id] = { ...emptyProgress(), ...parsed[id] };
    return parsed;
  } catch {
    return {};
  }
}

let state: AllProgress = load();
const listeners = new Set<() => void>();
const EMPTY = emptyProgress();

function commit(next: AllProgress) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked: keep working in memory.
  }
  listeners.forEach(l => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getProgress(courseId: string): CourseProgress {
  return state[courseId] ?? EMPTY;
}

export function useProgress(courseId: string): CourseProgress {
  return useSyncExternalStore(subscribe, () => getProgress(courseId));
}

/** Applies a mutation to a copy of the course progress and saves it immediately. */
export function updateProgress(courseId: string, mutate: (p: CourseProgress) => void) {
  const draft = structuredClone(state[courseId] ?? emptyProgress());
  mutate(draft);
  draft.updatedAt = Date.now();
  commit({ ...state, [courseId]: draft });
}

export function resetAll() {
  commit({});
}

export function exportProgress(): string {
  const flagged = [];
  for (const { course, byId } of courses) {
    for (const id of Object.keys(state[course.id]?.flagged ?? {})) {
      const hit = byId.get(id);
      if (!hit) continue;
      const lang = course.languages.primary;
      flagged.push({ course: course.id, set: hit.set.title, id, number: hit.q.number, prompt: hit.q.prompt[lang] });
    }
  }
  return JSON.stringify({ app: 'ders-test', version: 1, exportedAt: new Date().toISOString(), progress: state, flagged }, null, 1);
}

/** Merges an exported file: per course, the record with the newer updatedAt wins. Returns updated course ids. */
export function importProgress(text: string): string[] {
  const data = JSON.parse(text) as { app?: string; progress?: AllProgress };
  if (data.app !== 'ders-test' || !data.progress) throw new Error('Bu dosya bir Ders Test yedeği değil.');
  const next = { ...state };
  const changed: string[] = [];
  for (const [id, incoming] of Object.entries(data.progress)) {
    if (!incoming || typeof incoming.updatedAt !== 'number') continue;
    if (!next[id] || incoming.updatedAt > next[id].updatedAt) {
      next[id] = { ...emptyProgress(), ...incoming };
      changed.push(id);
    }
  }
  commit(next);
  return changed;
}
