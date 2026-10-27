import { useSyncExternalStore } from 'react';

export type Route =
  | { name: 'courses' }
  | { name: 'course'; courseId: string }
  | { name: 'lesson'; courseId: string; setId: string }
  | { name: 'quiz'; courseId: string; deckId: string }
  | { name: 'summary'; courseId: string; deckId: string };

function parse(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  if (parts[0] === 'c' && parts[1]) {
    if (parts[2] === 'd' && parts[3]) {
      return { name: parts[4] === 'summary' ? 'summary' : 'quiz', courseId: parts[1], deckId: parts[3] };
    }
    if (parts[2] === 'l' && parts[3]) return { name: 'lesson', courseId: parts[1], setId: parts[3] };
    return { name: 'course', courseId: parts[1] };
  }
  return { name: 'courses' };
}

export function href(route: Route): string {
  switch (route.name) {
    case 'courses':
      return '#/';
    case 'course':
      return `#/c/${encodeURIComponent(route.courseId)}`;
    case 'lesson':
      return `#/c/${encodeURIComponent(route.courseId)}/l/${encodeURIComponent(route.setId)}`;
    case 'quiz':
      return `#/c/${encodeURIComponent(route.courseId)}/d/${encodeURIComponent(route.deckId)}`;
    case 'summary':
      return `#/c/${encodeURIComponent(route.courseId)}/d/${encodeURIComponent(route.deckId)}/summary`;
  }
}

export function navigate(route: Route, replace = false) {
  if (replace) location.replace(href(route));
  else location.hash = href(route);
}

const subscribe = (cb: () => void) => {
  window.addEventListener('hashchange', cb);
  return () => window.removeEventListener('hashchange', cb);
};

export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, () => location.hash);
  return parse(hash);
}
