export type Localized = Record<string, string>;

export interface Question {
  id: string;
  number?: string;
  prompt: Localized;
  options: Record<string, string[]>;
  answer: string[];
  explanation?: Localized;
  note?: string;
  /** Id of the lesson concept (in the question's set) that explains this question's topic. */
  concept?: string;
  source?: {
    file: string;
    /** What kind of material the question comes from; "book" questions are marked with an icon. */
    kind?: 'slides' | 'book' | 'tutorial';
    page?: number;
    slide?: number;
    /** End-of-chapter exercise the question is derived from, e.g. "5.3". */
    exercise?: string;
    section?: string;
  };
}

export interface Concept {
  id: string;
  title: Localized;
  /** Light markup: blank line between paragraphs, "- " bullets, **bold**, `code`. */
  body: Localized;
  source?: string;
}

/** Short topic explanation shown before a set and linked from its questions. */
export interface Lesson {
  intro?: Localized;
  concepts: Concept[];
}

export interface QuestionSet {
  id: string;
  title: string;
  lesson?: Lesson;
  questions: Question[];
}

export interface Course {
  schemaVersion: number;
  id: string;
  title: string;
  /**
   * primary/secondary: languages of prompts and options (secondary is the per-question toggle).
   * help: extra language offered only for lessons and explanations.
   */
  languages: { primary: string; secondary?: string; help?: string };
  origin: 'official' | 'generated';
  sourceNote?: string;
  /** Named scope shortcuts, e.g. the sets covered by the midterm. */
  presets?: { id: string; title: string; sets: string[] }[];
  sets: QuestionSet[];
}

export interface Manifest {
  courses: { id: string; file: string }[];
}

export const LETTERS = ['A', 'B', 'C', 'D', 'E'];
