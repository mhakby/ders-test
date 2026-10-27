import { Fragment, useEffect, type ReactNode } from 'react';
import type { CourseIndex } from './data';
import { updateProgress, useProgress } from './store';
import type { Concept } from './types';

/** Renders lesson markup: blank line between paragraphs, "- " bullets, **bold**, *italic*, `code`. */
export function RichText({ text }: { text: string }) {
  const blocks = text.trim().split(/\n\s*\n/);
  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split('\n');
        if (lines.every(l => l.trimStart().startsWith('- '))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{inline(l.trimStart().slice(2))}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i}>
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {inline(l)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|`([^`]+)`|\*(\S(?:[^*\n]*?\S)?)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    // *italic* only between word boundaries, so formulas like "(b - a + 1) * Rnd" or "(14, …, 20)*" stay as text.
    if (m[3] !== undefined && (/[\w)]/.test(text[m.index - 1] ?? '') || /\w/.test(text[m.index + m[0].length] ?? ''))) {
      re.lastIndex = m.index + 1;
      continue;
    }
    out.push(text.slice(last, m.index));
    if (m[1] !== undefined) out.push(<strong key={m.index}>{m[1]}</strong>);
    else if (m[2] !== undefined) out.push(<code key={m.index}>{m[2]}</code>);
    else out.push(<em key={m.index}>{m[3]}</em>);
    last = m.index + m[0].length;
  }
  out.push(text.slice(last));
  return out;
}

/** The language for lessons and explanations: the viewer's choice, else the course's help language. */
export function useHelpLang(ci: CourseIndex): [string, (lang: string) => void] {
  const p = useProgress(ci.course.id);
  const { primary, help } = ci.course.languages;
  const lang = p.helpLang && [primary, help].includes(p.helpLang) ? p.helpLang : (help ?? primary);
  const setLang = (next: string) => updateProgress(ci.course.id, d => void (d.helpLang = next));
  return [lang, setLang];
}

const LANG_NAMES: Record<string, string> = { tr: 'Türkçe', en: 'English' };

/** Segmented control between the course's primary and help languages (hidden when there is only one). */
export function HelpLangToggle({ ci }: { ci: CourseIndex }) {
  const [lang, setLang] = useHelpLang(ci);
  const { primary, help } = ci.course.languages;
  if (!help) return null;
  return (
    <div className="segmented small-seg" role="group" aria-label="Açıklama dili">
      {[help, primary].map(l => (
        <button type="button" key={l} className={lang === l ? 'on' : ''} onClick={() => setLang(l)}>
          {LANG_NAMES[l] ?? l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export function pick(text: Record<string, string> | undefined, lang: string, fallback: string): string {
  return text?.[lang] ?? text?.[fallback] ?? '';
}

export function ConceptCard({ concept, lang, primary, index }: { concept: Concept; lang: string; primary: string; index?: number }) {
  return (
    <article className="concept" id={`concept-${concept.id}`}>
      <h3>
        {index !== undefined && <span className="concept-num">{index + 1}</span>}
        {pick(concept.title, lang, primary)}
      </h3>
      <div className="concept-body" lang={lang}>
        <RichText text={pick(concept.body, lang, primary)} />
      </div>
      {concept.source && <p className="muted small">Kaynak: {concept.source}</p>}
    </article>
  );
}

/** Bottom sheet with the concept card a question is linked to. */
export function ConceptSheet({
  ci,
  concept,
  onOpenLesson,
  onClose,
}: {
  ci: CourseIndex;
  concept: Concept;
  onOpenLesson: () => void;
  onClose: () => void;
}) {
  const [lang] = useHelpLang(ci);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" role="dialog" aria-label="Konu kartı" onClick={e => e.stopPropagation()}>
        <div className="row-between sheet-head">
          <HelpLangToggle ci={ci} />
          <button type="button" className="icon-btn" aria-label="Kapat" onClick={onClose}>
            ✕
          </button>
        </div>
        <ConceptCard concept={concept} lang={lang} primary={ci.course.languages.primary} />
        <button type="button" className="btn wide" onClick={onOpenLesson}>
          📖 Konu anlatımının tamamı
        </button>
      </div>
    </div>
  );
}
