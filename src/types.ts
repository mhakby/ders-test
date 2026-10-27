export type Localized = Record<string, string>;

export interface Question {
  id: string;
  number?: string;
  prompt: Localized;
  options: Record<string, string[]>;
  answer: string[];
  explanation?: Localized;
  note?: string;
  source?: { file: string; page?: number; slide?: number };
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
  sets: QuestionSet[];
}

export interface Manifest {
  courses: { id: string; file: string }[];
}

export const LETTERS = ['A', 'B', 'C', 'D', 'E'];
