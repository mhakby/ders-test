import { useEffect, useRef } from 'react';
import type { AnswerRec } from '../store';

export function MapSheet({
  ids,
  pos,
  answerOf,
  isSaved,
  isExercise,
  onPick,
  onClose,
}: {
  ids: string[];
  pos: number;
  answerOf: (id: string) => AnswerRec | undefined;
  isSaved: (id: string) => boolean;
  isExercise: (id: string) => boolean;
  onPick: (index: number) => void;
  onClose: () => void;
}) {
  const current = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    current.current?.scrollIntoView({ block: 'center' });
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const answered = ids.filter(id => answerOf(id)).length;
  const anyExercise = ids.some(isExercise);
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" role="dialog" aria-label="Soru haritası" onClick={e => e.stopPropagation()}>
        <div className="row-between">
          <h2>Soru haritası</h2>
          <button type="button" className="icon-btn" aria-label="Kapat" onClick={onClose}>
            ✕
          </button>
        </div>
        <p className="muted small">
          {answered}/{ids.length} cevaplandı · ★ kaydedilen
          {anyExercise && ' · 📘 kitap alıştırması'}
        </p>
        <div className="map-grid">
          {ids.map((id, i) => {
            const a = answerOf(id);
            return (
              <button
                type="button"
                key={id}
                ref={i === pos ? current : undefined}
                className={`map-cell ${a ? (a.correct ? 'ok' : 'bad') : ''} ${i === pos ? 'current' : ''}`}
                onClick={() => onPick(i)}
              >
                {i + 1}
                {isSaved(id) && <span className="star">★</span>}
                {isExercise(id) && <span className="book-mark">📘</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
