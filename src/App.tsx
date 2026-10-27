import { useEffect } from 'react';
import { courses, findCourse } from './data';
import { navigate, useRoute } from './router';
import { CourseHome } from './screens/CourseHome';
import { CourseList } from './screens/CourseList';
import { LessonScreen } from './screens/Lesson';
import { Quiz } from './screens/Quiz';
import { Summary } from './screens/Summary';

export function App() {
  const route = useRoute();
  const ci = route.name === 'courses' ? undefined : findCourse(route.courseId);

  useEffect(() => {
    // With a single course the course list is skipped.
    if (route.name === 'courses' && courses.length === 1) navigate({ name: 'course', courseId: courses[0].course.id }, true);
    else if (route.name !== 'courses' && !ci) navigate({ name: 'courses' }, true);
  }, [route.name, ci]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route.name]);

  if (route.name === 'courses' || !ci) return <CourseList />;
  if (route.name === 'course') return <CourseHome ci={ci} />;
  if (route.name === 'lesson') return <LessonScreen ci={ci} setId={route.setId} />;
  if (route.name === 'summary') return <Summary ci={ci} deckId={route.deckId} />;
  return <Quiz key={route.deckId} ci={ci} deckId={route.deckId} />;
}
