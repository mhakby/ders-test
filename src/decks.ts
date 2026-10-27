import { scopedIds, type CourseIndex } from './data';
import { updateProgress, type AnswerRec, type CourseProgress, type DeckState, type Mode } from './store';
import type { Question } from './types';

// Deck ids: "set:<setId>" for a question set; "saved", "wrong", "all", "exercises" for review lists;
// "mix" for a random test from the selected sets; "retry" for the wrong answers of a finished round.
export const isSetDeck = (deckId: string) => deckId.startsWith('set:');
/** Review decks keep their own round of answers in deck.done so they can be solved again. */
export const isReviewDeck = (deckId: string) => !isSetDeck(deckId);
/** Decks whose order follows the course's Sıralı/Karışık setting. */
export const followsMode = (deckId: string) => deckId !== 'mix' && deckId !== 'retry';

export function deckTitle(ci: CourseIndex, deckId: string): string {
  if (isSetDeck(deckId)) return ci.course.sets.find(s => s.id === deckId.slice(4))?.title ?? 'Set';
  return {
    saved: 'Kaydettiklerim',
    wrong: 'Yanlışlarım',
    all: 'Tüm sorular',
    exercises: '📘 Kitap alıştırmaları',
    mix: 'Karma test',
    retry: 'Yanlışları tekrar',
  }[deckId] ?? deckId;
}

/** Questions derived from a textbook's end-of-chapter exercises. */
export const isExercise = (ci: CourseIndex, id: string) => Boolean(ci.byId.get(id)?.q.source?.exercise);
export const hasExercises = (ci: CourseIndex) => ci.ids.some(id => isExercise(ci, id));

export function answerOf(p: CourseProgress, deckId: string, id: string): AnswerRec | undefined {
  return isReviewDeck(deckId) ? p.decks[deckId]?.done?.[id] : p.answers[id];
}

/** Current members of a list deck in data order; undefined for snapshot decks (mix, retry). */
function members(ci: CourseIndex, p: CourseProgress, deckId: string): string[] | undefined {
  if (isSetDeck(deckId)) return ci.course.sets.find(s => s.id === deckId.slice(4))?.questions.map(q => q.id) ?? [];
  const ids = scopedIds(ci, p.scope);
  if (deckId === 'all') return ids;
  if (deckId === 'saved') return ids.filter(id => p.saved[id]);
  if (deckId === 'wrong') return ids.filter(id => p.answers[id] && !p.answers[id].correct);
  if (deckId === 'exercises') return ids.filter(id => isExercise(ci, id));
  return undefined;
}

export function deckCount(ci: CourseIndex, p: CourseProgress, deckId: string): number {
  return members(ci, p, deckId)?.length ?? 0;
}

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Unanswered questions first, each group shuffled. */
function shuffledOrder(ids: string[], answered: (id: string) => boolean): string[] {
  return [...shuffle(ids.filter(id => !answered(id))), ...shuffle(ids.filter(answered))];
}

function arrange(ci: CourseIndex, ids: string[], mode: Mode, answered: (id: string) => boolean): string[] {
  if (mode === 'shuffle') return shuffledOrder(ids, answered);
  const keep = new Set(ids);
  return ci.ids.filter(id => keep.has(id));
}

function keepCurrent(deck: DeckState, order: string[]) {
  const current = deck.order[deck.pos];
  const idx = current ? order.indexOf(current) : -1;
  deck.order = order;
  deck.pos = idx >= 0 ? idx : Math.min(deck.pos, Math.max(order.length - 1, 0));
}

const isComplete = (deck: DeckState) => deck.order.length > 0 && deck.order.every(id => deck.done?.[id]);

/** Creates or refreshes a deck so it matches the current lists, scope and mode. Returns false if it is empty. */
export function openDeck(ci: CourseIndex, deckId: string): boolean {
  let ok = true;
  updateProgress(ci.course.id, p => {
    const scopeKey = `${(p.scope ?? ['*']).join(',')}|${p.mixSize}`;
    let deck: DeckState | undefined = p.decks[deckId];

    if (deckId === 'mix') {
      if (!deck || deck.key !== scopeKey || isComplete(deck)) {
        const ids = shuffle(scopedIds(ci, p.scope));
        deck = { order: p.mixSize ? ids.slice(0, p.mixSize) : ids, pos: 0, mode: 'shuffle', done: {}, key: scopeKey };
      }
    } else if (deckId !== 'retry') {
      const list = members(ci, p, deckId) ?? [];
      if (deck && isReviewDeck(deckId) && isComplete(deck)) deck = undefined; // finished round: start a new one
      if (!deck) {
        const answered = (id: string) => !isReviewDeck(deckId) && Boolean(p.answers[id]);
        deck = { order: arrange(ci, list, p.mode, answered), pos: 0, mode: p.mode, done: isReviewDeck(deckId) ? {} : undefined };
      } else {
        // Keep questions answered in this round even if they left the list (e.g. now correct).
        const keep = new Set([...list, ...Object.keys(deck.done ?? {})]);
        const answered = (id: string) => Boolean(answerOf(p, deckId, id));
        let order: string[];
        if (deck.mode !== p.mode || p.mode === 'seq') {
          order = arrange(ci, [...keep], p.mode, answered);
        } else {
          const kept = deck.order.filter(id => keep.has(id));
          const present = new Set(kept);
          order = [...kept, ...shuffle([...keep].filter(id => !present.has(id)))];
        }
        deck.mode = p.mode;
        keepCurrent(deck, order);
      }
    }

    if (!deck || deck.order.length === 0) {
      ok = false;
      return;
    }
    deck.order = deck.order.filter(id => ci.byId.has(id));
    deck.pos = Math.min(deck.pos, Math.max(deck.order.length - 1, 0));
    p.decks[deckId] = deck;
    p.lastDeck = deckId;
  });
  return ok;
}

export function setMode(ci: CourseIndex, deckId: string | undefined, mode: Mode) {
  updateProgress(ci.course.id, p => {
    p.mode = mode;
    const deck = deckId ? p.decks[deckId] : undefined;
    if (!deckId || !deck || !followsMode(deckId) || deck.mode === mode) return;
    const answered = (id: string) => Boolean(answerOf(p, deckId, id));
    keepCurrent(deck, arrange(ci, deck.order, mode, answered));
    deck.mode = mode;
  });
}

export function goTo(ci: CourseIndex, deckId: string, pos: number) {
  updateProgress(ci.course.id, p => {
    const deck = p.decks[deckId];
    if (deck) deck.pos = Math.max(0, Math.min(pos, deck.order.length - 1));
    p.lastDeck = deckId;
  });
}

export function answer(ci: CourseIndex, deckId: string, q: Question, choice: string) {
  updateProgress(ci.course.id, p => {
    const rec = { choice, correct: q.answer.includes(choice), at: Date.now() };
    p.answers[q.id] = rec;
    if (!rec.correct) p.wrongCount[q.id] = (p.wrongCount[q.id] ?? 0) + 1;
    const deck = p.decks[deckId];
    if (deck && isReviewDeck(deckId)) deck.done = { ...deck.done, [q.id]: rec };
  });
}

export function clearAnswer(ci: CourseIndex, deckId: string, id: string) {
  updateProgress(ci.course.id, p => {
    if (isReviewDeck(deckId)) delete p.decks[deckId]?.done?.[id];
    else delete p.answers[id];
  });
}

/** Starts the deck over: clears this round's answers (or the set's answers) and rebuilds the order. */
export function resetDeck(ci: CourseIndex, deckId: string) {
  updateProgress(ci.course.id, p => {
    const deck = p.decks[deckId];
    if (!deck) return;
    if (isSetDeck(deckId)) for (const id of deck.order) delete p.answers[id];
    if (deckId === 'mix') {
      delete p.decks[deckId];
      return;
    }
    deck.done = isReviewDeck(deckId) ? {} : undefined;
    if (deck.mode === 'shuffle') deck.order = shuffle(deck.order);
    deck.pos = 0;
  });
  openDeck(ci, deckId);
}

/** Builds the "retry" deck from the questions answered wrong in the given deck's round. */
export function startRetry(ci: CourseIndex, fromDeckId: string): boolean {
  let ok = false;
  updateProgress(ci.course.id, p => {
    const from = p.decks[fromDeckId];
    if (!from) return;
    const wrong = from.order.filter(id => answerOf(p, fromDeckId, id)?.correct === false);
    if (!wrong.length) return;
    p.decks.retry = { order: from.mode === 'shuffle' ? shuffle(wrong) : wrong, pos: 0, mode: from.mode, done: {} };
    p.lastDeck = 'retry';
    ok = true;
  });
  return ok;
}

export function toggleSaved(ci: CourseIndex, id: string) {
  updateProgress(ci.course.id, p => {
    if (p.saved[id]) delete p.saved[id];
    else p.saved[id] = Date.now();
  });
}

export function toggleFlagged(ci: CourseIndex, id: string) {
  updateProgress(ci.course.id, p => {
    if (p.flagged[id]) delete p.flagged[id];
    else p.flagged[id] = Date.now();
  });
}
