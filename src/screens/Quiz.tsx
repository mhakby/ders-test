import { useEffect, useRef, useState, type TouchEvent } from 'react';
import type { CourseIndex } from '../data';
import {
  answer,
  answerOf,
  clearAnswer,
  deckTitle,
  followsMode,
  goTo,
  isExercise,
  isReviewDeck,
  openDeck,
  setMode,
  toggleFlagged,
  toggleSaved,
} from '../decks';
import { navigate } from '../router';
import { useProgress } from '../store';
import { LETTERS } from '../types';
import { MapSheet } from './MapSheet';

export function Quiz({ ci, deckId }: { ci: CourseIndex; deckId: string }) {
  const { course } = ci;
  const p = useProgress(course.id);
  const deck = p.decks[deckId];
  const [langFor, setLangFor] = useState<{ id: string; lang: string }>();
  const [mapOpen, setMapOpen] = useState(false);
  const [toast, setToast] = useState<string>();
  const touch = useRef<{ x: number; y: number }>(undefined);

  useEffect(() => {
    if (!deck && !openDeck(ci, deckId)) navigate({ name: 'course', courseId: course.id }, true);
  }, [deck, ci, deckId, course.id]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(undefined), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const id = deck?.order[deck.pos];
  const hit = id ? ci.byId.get(id) : undefined;

  const { primary, secondary } = course.languages;
  const q = hit?.q;
  const hasSecondary = Boolean(q && secondary && q.prompt[secondary] && q.options[secondary]);
  const lang = q && langFor?.id === q.id ? langFor.lang : primary;
  const a = q ? answerOf(p, deckId, q.id) : undefined;
  const total = deck?.order.length ?? 0;
  const pos = deck?.pos ?? 0;
  const isLast = pos >= total - 1;

  const go = (next: number) => {
    if (next < 0) return;
    if (next >= total) navigate({ name: 'summary', courseId: course.id, deckId });
    else goTo(ci, deckId, next);
  };
  const choose = (letter: string) => {
    if (q && !a && LETTERS.indexOf(letter) < q.options[primary].length) answer(ci, deckId, q, letter);
  };
  const toggleLang = () => {
    if (!q || !secondary) return;
    if (!hasSecondary) setToast(`Bu sorunun ${secondary === 'en' ? 'İngilizcesi' : 'çevirisi'} yok.`);
    else setLangFor({ id: q.id, lang: lang === primary ? secondary : primary });
  };
  const save = () => {
    if (!q) return;
    toggleSaved(ci, q.id);
    setToast(p.saved[q.id] ? 'Kaydedilenlerden çıkarıldı.' : 'Kaydedildi.');
  };

  const handlers = useRef({ go, choose, toggleLang, save, pos, optionCount: 0, mapOpen });
  handlers.current = { go, choose, toggleLang, save, pos, optionCount: q?.options[primary].length ?? 0, mapOpen };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      const h = handlers.current;
      if (h.mapOpen) return;
      const key = e.key.toUpperCase();
      if (/^[1-5]$/.test(key)) h.choose(LETTERS[Number(key) - 1]);
      else if (key === 'E' && h.optionCount < 5) h.toggleLang();
      else if (/^[A-E]$/.test(key)) h.choose(key);
      else if (key === 'S') h.save();
      else if (e.key === 'ArrowRight') h.go(h.pos + 1);
      else if (e.key === 'ArrowLeft') h.go(h.pos - 1);
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!deck || !q || !hit) return <main className="page" />;

  const onTouchStart = (e: TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: TouchEvent) => {
    const start = touch.current;
    touch.current = undefined;
    if (!start) return;
    const dx = e.changedTouches[0].clientX - start.x;
    const dy = e.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? pos + 1 : pos - 1);
  };

  const options = q.options[lang] ?? q.options[primary];
  const correctLetters = q.answer;
  const wrongTimes = p.wrongCount[q.id] ?? 0;
  const explanation = q.explanation?.[lang] ?? q.explanation?.[primary];
  const src = q.source;
  const sourceLabel = src
    ? [
        src.file.endsWith('.pptx') ? src.file.replace(/\.pptx$/, '').replace(/^week0?/, 'Week ') : src.file,
        src.slide && `slayt ${src.slide}`,
        src.page && `s. ${src.page}`,
        src.exercise && `Alıştırma ${src.exercise}`,
        src.section,
      ]
        .filter(Boolean)
        .join(', ')
    : undefined;

  return (
    <div className="quiz">
      <header className="topbar">
        <button type="button" className="icon-btn" aria-label="Geri" onClick={() => navigate({ name: 'course', courseId: course.id })}>
          ‹
        </button>
        <div className="topbar-title">{deckTitle(ci, deckId)}</div>
        {followsMode(deckId) && (
          <button
            type="button"
            className="chip"
            aria-label="Soru sırasını değiştir"
            onClick={() => setMode(ci, deckId, deck.mode === 'seq' ? 'shuffle' : 'seq')}
          >
            {deck.mode === 'seq' ? 'Sıralı' : 'Karışık'}
          </button>
        )}
        <button type="button" className="icon-btn" aria-label="Soru haritası" onClick={() => setMapOpen(true)}>
          ▦
        </button>
      </header>
      <div className="progress">
        <span style={{ width: `${((pos + 1) / total) * 100}%` }} />
      </div>

      <main className="page question-page" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="q-meta">
          <div className="q-number">
            {isReviewDeck(deckId) && <small>{hit.set.title}</small>}
            <span>
              {src?.kind === 'book' && (
                <span role="img" aria-label="Kitap sorusu" title="Ders kitabından">
                  📘{' '}
                </span>
              )}
              Soru {q.number ?? hit.index + 1}
              {src?.exercise && <span className="badge exercise">Alıştırma {src.exercise}</span>}
            </span>
          </div>
          <div className="q-tools">
            <button
              type="button"
              className={`icon-btn save ${p.saved[q.id] ? 'on' : ''}`}
              aria-label={p.saved[q.id] ? 'Kaydedilenlerden çıkar' : 'Kaydet'}
              aria-pressed={Boolean(p.saved[q.id])}
              onClick={save}
            >
              {p.saved[q.id] ? '★' : '☆'}
            </button>
            {secondary && (
              <button
                type="button"
                className={`lang-btn ${hasSecondary ? '' : 'disabled'} ${lang !== primary ? 'on' : ''}`}
                aria-label="Dili değiştir"
                aria-disabled={!hasSecondary}
                onClick={toggleLang}
              >
                {(lang === primary ? secondary : primary).toUpperCase()}
              </button>
            )}
          </div>
        </div>

        <p className="prompt" lang={lang}>
          {q.prompt[lang] ?? q.prompt[primary]}
        </p>

        <ol className="options" lang={lang}>
          {options.map((text, i) => {
            const letter = LETTERS[i];
            let cls = '';
            if (a) {
              if (correctLetters.includes(letter)) cls = 'correct';
              else if (letter === a.choice) cls = 'wrong';
              else cls = 'dim';
            }
            return (
              <li key={letter}>
                <button type="button" className={`option ${cls}`} onClick={() => choose(letter)} aria-disabled={Boolean(a)}>
                  <span className="letter">{letter}</span>
                  <span className="text">{text}</span>
                </button>
              </li>
            );
          })}
        </ol>

        {a && (
          <section className={`result ${a.correct ? 'ok' : 'bad'}`} aria-live="polite">
            <p className="verdict">
              {a.correct
                ? 'Doğru.'
                : `Yanlış. Doğru cevap ${correctLetters.join(' / ')}: ${options[LETTERS.indexOf(correctLetters[0])]}`}
            </p>
            {explanation && <p className="explanation">{explanation}</p>}
            {q.note && <p className="note">{q.note}</p>}
            {sourceLabel && <p className="muted small">Kaynak: {sourceLabel}</p>}
            {wrongTimes > 0 && <p className="muted small">Bu soruyu toplam {wrongTimes} kez yanlış cevapladın.</p>}
            <button type="button" className="link" onClick={() => clearAnswer(ci, deckId, q.id)}>
              Bu soruyu tekrar çöz
            </button>
          </section>
        )}

        <button
          type="button"
          className={`link report ${p.flagged[q.id] ? 'on' : ''}`}
          onClick={() => {
            toggleFlagged(ci, q.id);
            setToast(p.flagged[q.id] ? 'İşaret kaldırıldı.' : 'İşaretlendi; dışa aktarılan dosyada listelenir.');
          }}
        >
          {p.flagged[q.id] ? '⚑ Sorunlu olarak işaretli (kaldır)' : '⚐ Bu soruda sorun var'}
        </button>
      </main>

      <nav className="bottombar">
        <button type="button" className="btn" disabled={pos === 0} onClick={() => go(pos - 1)}>
          ‹ Önceki
        </button>
        <span className="position">
          {pos + 1} / {total}
        </span>
        <button type="button" className={`btn ${a ? 'primary' : ''}`} onClick={() => go(pos + 1)}>
          {isLast ? 'Bitir' : 'Sonraki ›'}
        </button>
      </nav>

      {toast && <div className="toast">{toast}</div>}
      {mapOpen && (
        <MapSheet
          ids={deck.order}
          pos={pos}
          answerOf={qid => answerOf(p, deckId, qid)}
          isSaved={qid => Boolean(p.saved[qid])}
          isExercise={qid => isExercise(ci, qid)}
          onPick={i => {
            setMapOpen(false);
            go(i);
          }}
          onClose={() => setMapOpen(false)}
        />
      )}
    </div>
  );
}
