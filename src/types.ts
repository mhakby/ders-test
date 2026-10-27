export type Localized = Record<string, string>;

export interface Question {
  id: string;
  number?: string;
  prompt: Localized;
  options: Record<string, string[]>;
  answer: string[];
  explanation?: Localized;
  note?: string;
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

export interface QuestionSet {
  id: string;
  title: string;
  questions: Question[];
}

export interface Course {
  schemaVersion: number;
  id: string;
  title: string;
  languages: { primary: string; secondary?: string };
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
