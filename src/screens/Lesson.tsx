import { useEffect } from 'react';
import { HazardStripe } from '../components';
import type { CourseIndex } from '../data';
import { openDeck } from '../decks';
import { ConceptCard, HelpLangToggle, RichText, pick, useHelpLang } from '../lesson';
import { navigate } from '../router';
import { updateProgress, useProgress } from '../store';

export function LessonScreen({ ci, setId }: { ci: CourseIndex; setId: string }) {
  const courseId = ci.course.id;
  const set = ci.course.sets.find(s => s.id === setId);
  const p = useProgress(courseId);
  const [lang] = useHelpLang(ci);
  const primary = ci.course.languages.primary;

  useEffect(() => {
    if (!set?.lesson) navigate({ name: 'course', courseId }, true);
    else updateProgress(courseId, d => void (d.lessonSeen = { ...d.lessonSeen, [setId]: Date.now() }));
  }, [set, courseId, setId]);

  if (!set?.lesson) return null;
  const { intro, concepts } = set.lesson;
  const answered = set.questions.filter(q => p.answers[q.id]).length;
  const deckId = `set:${setId}`;

  return (
    <main className="page lesson-page">
      <button
        type="button"
        className="back-link link-reset"
        onClick={() => (history.length > 1 ? history.back() : navigate({ name: 'course', courseId }))}
      >
        ‹ Geri
      </button>
      <HazardStripe />
      <p className="muted eyebrow">Konu anlatımı</p>
      <h1 className="title">{set.title}</h1>
      <div className="row-between">
        <span className="label">Dil</span>
        <HelpLangToggle ci={ci} />
      </div>

      {intro && (
        <div className="lesson-intro" lang={lang}>
          <RichText text={pick(intro, lang, primary)} />
        </div>
      )}

      <nav className="toc" aria-label="Konular">
        <ol>
          {concepts.map(c => (
            <li key={c.id}>
              <button
                type="button"
                className="link"
                onClick={() => document.getElementById(`concept-${c.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                {pick(c.title, lang, primary)}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      {concepts.map((c, i) => (
        <ConceptCard key={c.id} concept={c} lang={lang} primary={primary} index={i} />
      ))}

      <div className="lesson-actions">
        <button
          type="button"
          className="btn primary big"
          onClick={() => {
            if (openDeck(ci, deckId)) navigate({ name: 'quiz', courseId, deckId });
          }}
        >
          {answered ? 'Teste devam et' : 'Teste başla'} ({set.questions.length} soru)
        </button>
      </div>
    </main>
  );
}
