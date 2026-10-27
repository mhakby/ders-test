import { useRef, useState } from 'react';
import { ConfirmButton, HazardStripe, Strip, percent, stats } from '../components';
import { courses, scopedIds, type CourseIndex } from '../data';
import { deckCount, deckTitle, openDeck, setMode } from '../decks';
import { href, navigate } from '../router';
import { exportProgress, importProgress, resetAll, updateProgress, useProgress } from '../store';

const MIX_SIZES = [20, 50, 0];

export function CourseHome({ ci }: { ci: CourseIndex }) {
  const { course } = ci;
  const p = useProgress(course.id);
  const [message, setMessage] = useState<string>();
  const fileInput = useRef<HTMLInputElement>(null);

  const scope = p.scope ?? course.sets.map(s => s.id);
  const inScope = new Set(scope);
  const ids = scopedIds(ci, p.scope);
  const s = stats(ids, p);
  const setWord = course.id === 'isg' ? 'test' : 'hafta';

  const start = (deckId: string) => {
    if (openDeck(ci, deckId)) navigate({ name: 'quiz', courseId: course.id, deckId });
    else setMessage(`${deckTitle(ci, deckId)}: seçili kapsamda soru yok.`);
  };

  const toggleSet = (setId: string) =>
    updateProgress(course.id, d => {
      const next = new Set(d.scope ?? course.sets.map(x => x.id));
      if (next.has(setId)) next.delete(setId);
      else next.add(setId);
      d.scope = next.size === course.sets.length ? undefined : course.sets.map(x => x.id).filter(id => next.has(id));
    });

  const last = p.lastDeck ? p.decks[p.lastDeck] : undefined;

  const doExport = () => {
    const blob = new Blob([exportProgress()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ders-test-ilerleme-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const doImport = async (file: File | undefined) => {
    if (!file) return;
    try {
      const changed = importProgress(await file.text());
      setMessage(changed.length ? `İçe aktarıldı: ${changed.join(', ')}` : 'Dosyadaki kayıtlar buradakilerden eski; değişiklik yok.');
    } catch (e) {
      setMessage(`İçe aktarılamadı: ${(e as Error).message}`);
    }
    if (fileInput.current) fileInput.current.value = '';
  };

  return (
    <main className="page">
      {courses.length > 1 && (
        <a className="back-link" href={href({ name: 'courses' })}>
          ‹ Dersler
        </a>
      )}
      <HazardStripe />
      <h1 className="title">
        {course.title}
        {course.origin === 'generated' && <span className="badge">Üretilmiş</span>}
      </h1>

      <section className="summary-grid">
        <div>
          <b>
            {s.solved}/{s.total}
          </b>
          <span>çözülen</span>
        </div>
        <div>
          <b>%{percent(s.correct, s.solved)}</b>
          <span>doğru</span>
        </div>
        <div>
          <b>{s.saved}</b>
          <span>kaydedilen</span>
        </div>
      </section>
      {p.scope && (
        <p className="muted small">
          Kapsam: {scope.length}/{course.sets.length} {setWord} seçili (özet ve listeler buna göre)
        </p>
      )}

      {last && p.lastDeck && (
        <a
          className="btn primary big continue"
          href={href({ name: 'quiz', courseId: course.id, deckId: p.lastDeck })}
          onClick={e => {
            e.preventDefault();
            start(p.lastDeck!);
          }}
        >
          Kaldığın yerden devam et
          <small>
            {deckTitle(ci, p.lastDeck)}, {last.pos + 1}. soru / {last.order.length}
          </small>
        </a>
      )}

      <div className="row-between">
        <span className="label">Soru sırası</span>
        <div className="segmented" role="group" aria-label="Soru sırası">
          <button type="button" className={p.mode === 'seq' ? 'on' : ''} onClick={() => setMode(ci, undefined, 'seq')}>
            Sıralı
          </button>
          <button type="button" className={p.mode === 'shuffle' ? 'on' : ''} onClick={() => setMode(ci, undefined, 'shuffle')}>
            Karışık
          </button>
        </div>
      </div>

      {message && (
        <p className="notice" onClick={() => setMessage(undefined)}>
          {message}
        </p>
      )}

      <section>
        <div className="row-between section-head">
          <h2>{course.id === 'isg' ? 'Testler' : 'Haftalar'}</h2>
          <div className="link-row">
            <button type="button" className="link" onClick={() => updateProgress(course.id, d => void (d.scope = undefined))}>
              Hepsi
            </button>
            <button type="button" className="link" onClick={() => updateProgress(course.id, d => void (d.scope = []))}>
              Temizle
            </button>
          </div>
        </div>
        <p className="muted small">Kutucuklar karma test ve tekrar listelerinin kapsamını belirler.</p>
        <ul className="set-list">
          {course.sets.map(set => {
            const setIds = set.questions.map(q => q.id);
            const st = stats(setIds, p);
            const checked = inScope.has(set.id);
            return (
              <li key={set.id} className={checked ? '' : 'out'}>
                <button
                  type="button"
                  className={`check ${checked ? 'on' : ''}`}
                  role="checkbox"
                  aria-checked={checked}
                  aria-label={`${set.title} kapsama dahil`}
                  onClick={() => toggleSet(set.id)}
                >
                  {checked ? '✓' : ''}
                </button>
                <button type="button" className="set-row" onClick={() => start(`set:${set.id}`)}>
                  <span className="set-title">{set.title}</span>
                  <span className="muted small">
                    {st.solved}/{st.total} çözüldü · <span className="ok-text">{st.correct} D</span> ·{' '}
                    <span className="bad-text">{st.wrong} Y</span>
                  </span>
                  <Strip ids={setIds} answerOf={id => p.answers[id]} />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="card">
        <h2>Karma test</h2>
        <p className="muted small">
          Seçili {scope.length} {setWord} · {ids.length} sorudan rastgele.
        </p>
        <div className="row-between">
          <div className="segmented" role="group" aria-label="Soru sayısı">
            {MIX_SIZES.map(n => (
              <button
                type="button"
                key={n}
                className={p.mixSize === n ? 'on' : ''}
                onClick={() => updateProgress(course.id, d => void (d.mixSize = n))}
              >
                {n === 0 ? 'Tümü' : n}
              </button>
            ))}
          </div>
          <button type="button" className="btn primary" disabled={ids.length === 0} onClick={() => start('mix')}>
            Başlat
          </button>
        </div>
      </section>

      <section>
        <h2>Tekrar</h2>
        <div className="stack">
          {(['saved', 'wrong', 'all'] as const).map(deckId => (
            <button type="button" key={deckId} className="btn list-btn" onClick={() => start(deckId)}>
              <span>{deckTitle(ci, deckId)}</span>
              <span className="count">{deckCount(ci, p, deckId)}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="footer-actions">
        <button type="button" className="btn" onClick={doExport}>
          İlerlemeyi dışa aktar
        </button>
        <button type="button" className="btn" onClick={() => fileInput.current?.click()}>
          İçe aktar
        </button>
        <input ref={fileInput} type="file" accept="application/json,.json" hidden onChange={e => doImport(e.target.files?.[0])} />
        <ConfirmButton className="btn" onConfirm={() => resetAll()} confirmText="Tüm dersler sıfırlanacak. Emin misin?">
          Tüm ilerlemeyi sıfırla
        </ConfirmButton>
      </section>

      {course.sourceNote && <p className="muted small source-note">{course.sourceNote}</p>}
    </main>
  );
}
