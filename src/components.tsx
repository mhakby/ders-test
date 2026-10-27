import { useEffect, useState, type ReactNode } from 'react';
import type { AnswerRec, CourseProgress } from './store';

export interface Stats {
  total: number;
  solved: number;
  correct: number;
  wrong: number;
  saved: number;
}

export function stats(ids: string[], p: CourseProgress): Stats {
  let solved = 0;
  let correct = 0;
  let saved = 0;
  for (const id of ids) {
    const a = p.answers[id];
    if (a) {
      solved++;
      if (a.correct) correct++;
    }
    if (p.saved[id]) saved++;
  }
  return { total: ids.length, solved, correct, wrong: solved - correct, saved };
}

export const percent = (part: number, whole: number) => (whole ? Math.round((100 * part) / whole) : 0);

/** One small segment per question: green correct, red wrong, grey unanswered. */
export function Strip({ ids, answerOf }: { ids: string[]; answerOf: (id: string) => AnswerRec | undefined }) {
  return (
    <div className="strip" aria-hidden="true">
      {ids.map(id => {
        const a = answerOf(id);
        return <span key={id} className={a ? (a.correct ? 'ok' : 'bad') : ''} />;
      })}
    </div>
  );
}

/** Destructive action that needs a second tap within a few seconds. */
export function ConfirmButton({
  onConfirm,
  children,
  confirmText = 'Emin misin? Tekrar dokun',
  className = '',
}: {
  onConfirm: () => void;
  children: ReactNode;
  confirmText?: string;
  className?: string;
}) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 4000);
    return () => clearTimeout(t);
  }, [armed]);
  return (
    <button
      type="button"
      className={`${className} ${armed ? 'danger armed' : ''}`}
      onClick={() => {
        if (armed) {
          setArmed(false);
          onConfirm();
        } else setArmed(true);
      }}
    >
      {armed ? confirmText : children}
    </button>
  );
}

export function HazardStripe() {
  return <div className="hazard" aria-hidden="true" />;
}
