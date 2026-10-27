import { useEffect } from 'react';
import { ConfirmButton, HazardStripe, percent } from '../components';
import type { CourseIndex } from '../data';
import { answerOf, deckTitle, goTo, resetDeck, startRetry } from '../decks';
import { navigate } from '../router';
import { useProgress } from '../store';

export function Summary({ ci, deckId }: { ci: CourseIndex; deckId: string }) {
  const courseId = ci.course.id;
  const p = useProgress(courseId);
  const deck = p.decks[deckId];
  useEffect(() => {
    if (!deck) navigate({ name: 'course', courseId }, true);
  }, [deck, courseId]);
  if (!deck) return null;

  let correct = 0;
  let wrong = 0;
  for (const id of deck.order) {
    const a = answerOf(p, deckId, id);
    if (a?.correct) correct++;
    else if (a) wrong++;
  }
  const empty = deck.order.length - correct - wrong;

  return (
    <main className="page">
      <HazardStripe />
      <h1 className="title">{deckTitle(ci, deckId)}</h1>
      <p className="muted">Tur özeti</p>
      <section className="summary-grid big-numbers">
        <div className="ok-text">
          <b>{correct}</b>
          <span>doğru</span>
        </div>
        <div className="bad-text">
          <b>{wrong}</b>
          <span>yanlış</span>
        </div>
        <div>
          <b>{empty}</b>
          <span>boş</span>
        </div>
      </section>
      <p className="score">
        Başarı: <b>%{percent(correct, deck.order.length)}</b>
        {correct + wrong > 0 && <span className="muted"> (cevaplananlarda %{percent(correct, correct + wrong)})</span>}
      </p>

      <div className="stack">
        {wrong > 0 && (
          <button
            type="button"
            className="btn primary big"
            onClick={() => startRetry(ci, deckId) && navigate({ name: 'quiz', courseId, deckId: 'retry' }, true)}
          >
            Yanlışları tekrar çöz ({wrong})
          </button>
        )}
        {empty > 0 && (
          <button
            type="button"
            className="btn"
            onClick={() => {
              const first = deck.order.findIndex(id => !answerOf(p, deckId, id));
              goTo(ci, deckId, Math.max(first, 0));
              navigate({ name: 'quiz', courseId, deckId }, true);
            }}
          >
            Boş kalanlara dön ({empty})
          </button>
        )}
        <ConfirmButton
          className="btn"
          onConfirm={() => {
            resetDeck(ci, deckId);
            navigate({ name: 'quiz', courseId, deckId }, true);
          }}
        >
          {deckId === 'mix' ? 'Yeni karma test' : 'Sıfırla ve baştan çöz'}
        </ConfirmButton>
        <button type="button" className="btn" onClick={() => navigate({ name: 'course', courseId })}>
          Geri dön
        </button>
      </div>
    </main>
  );
}
