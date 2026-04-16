// Shared types across all data modules

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  trap: string;
}

export interface RefSubSection {
  title: string;
  bullets: string[];
}

export interface AntiPattern {
  title: string;
  bad: string;
  good: string;
}

export interface RefSection {
  title: string;
  icon: string;
  color: string;
  subsections: RefSubSection[];
}

export interface QuickRefData {
  title: string;
  examWeight: string;
  color: string;
  sections: RefSection[];
  antiPatterns: AntiPattern[];
  examTips: string[];
}
