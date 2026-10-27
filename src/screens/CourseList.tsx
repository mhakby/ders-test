import { HazardStripe, percent, stats } from '../components';
import { courses } from '../data';
import { href } from '../router';
import { getProgress, useProgress } from '../store';
import type { CourseIndex } from '../data';

function CourseCard({ ci }: { ci: CourseIndex }) {
  const p = useProgress(ci.course.id);
  const s = stats(ci.ids, p);
  return (
    <a className="card course-card" href={href({ name: 'course', courseId: ci.course.id })}>
      <div className="course-card-title">
        {ci.course.title}
        {ci.course.origin === 'generated' && <span className="badge">Üretilmiş</span>}
      </div>
      <div className="muted">
        {s.total} soru · {s.solved} çözüldü{s.solved > 0 && ` · %${percent(s.correct, s.solved)} doğru`}
      </div>
      <div className="bar">
        <span style={{ width: `${percent(s.solved, s.total)}%` }} />
      </div>
    </a>
  );
}

export function CourseList() {
  const last = courses
    .map(ci => ({ ci, at: getProgress(ci.course.id).updatedAt }))
    .sort((a, b) => b.at - a.at)[0];
  return (
    <main className="page">
      <HazardStripe />
      <h1 className="title">Ders Test</h1>
      <p className="muted">Ders seç.</p>
      <div className="stack">
        {courses.map(ci => (
          <CourseCard key={ci.course.id} ci={ci} />
        ))}
      </div>
      {last && last.at > 0 && (
        <p className="muted small">Son çalışılan: {last.ci.course.title}</p>
      )}
      <p className="muted small install-hint">
        Telefonda ana ekrana ekle: iPhone'da Safari → Paylaş → Ana Ekrana Ekle; Android'de Chrome menüsü → Ana ekrana ekle.
        Eklendikten sonra internetsiz de çalışır.
      </p>
    </main>
  );
}
