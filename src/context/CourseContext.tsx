import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { AchievementState } from '../data/achievements';

interface LessonProgress {
  completed: boolean;
  completedAt?: string;
}

interface DomainProgress {
  lessons: Record<string, LessonProgress>;
}

interface LessonNote {
  lessonId: string;
  content: string;
  updatedAt: string;
}

interface CardProgress {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: string; // ISO date
}

interface PersistedState {
  progress: Record<string, DomainProgress>;
  completedLabs: string[];
  completedScenarios: string[];
  quizScores: Record<string, number>;
  practiceExamScore: number | null;
  scenarioExamScore: number | null;
  notes: Record<string, LessonNote>;
  studyDates: string[];
  flashcardProgress: Record<string, CardProgress>;
  flashcardsReviewed: number;
}

interface CourseContextType {
  progress: Record<string, DomainProgress>;
  completeLesson: (domainId: string, lessonId: string) => void;
  isLessonCompleted: (domainId: string, lessonId: string) => boolean;
  getDomainProgress: (domainId: string) => number;
  overallProgress: number;
  completedLabs: Set<string>;
  completedScenarios: Set<string>;
  quizScores: Record<string, number>;
  practiceExamScore: number | null;
  scenarioExamScore: number | null;
  markLabCompleted: (labId: string) => void;
  markScenarioCompleted: (scenarioId: string) => void;
  setQuizScore: (domainId: string, score: number) => void;
  setPracticeExamScore: (score: number) => void;
  setScenarioExamScore: (score: number) => void;
  getAchievementState: () => AchievementState;
  resetProgress: () => void;
  // Notes
  notes: Record<string, LessonNote>;
  saveNote: (lessonId: string, content: string) => void;
  getNote: (lessonId: string) => LessonNote | undefined;
  allNotes: () => LessonNote[];
  // Study streak
  studyDates: string[];
  currentStreak: number;
  recordStudyDay: () => void;
  // Flashcards
  flashcardProgress: Record<string, CardProgress>;
  flashcardsReviewed: number;
  rateFlashcard: (cardId: string, rating: 'hard' | 'good' | 'easy') => void;
  getCardProgress: (cardId: string) => CardProgress | undefined;
  getDueCards: (domainId?: string) => string[];
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

const STORAGE_KEY = 'claude-architect-course-progress';

const defaultProgress: Record<string, DomainProgress> = {
  domain1: { lessons: { '1-1': { completed: false }, '1-2': { completed: false }, '1-3': { completed: false }, '1-4': { completed: false }, '1-5': { completed: false }, '1-6': { completed: false }, '1-7': { completed: false } } },
  domain2: { lessons: { '2-1': { completed: false }, '2-2': { completed: false }, '2-3': { completed: false }, '2-4': { completed: false }, '2-5': { completed: false } } },
  domain3: { lessons: { '3-1': { completed: false }, '3-2': { completed: false }, '3-3': { completed: false }, '3-4': { completed: false }, '3-5': { completed: false }, '3-6': { completed: false } } },
  domain4: { lessons: { '4-1': { completed: false }, '4-2': { completed: false }, '4-3': { completed: false }, '4-4': { completed: false }, '4-5': { completed: false }, '4-6': { completed: false } } },
  domain5: { lessons: { '5-1': { completed: false }, '5-2': { completed: false }, '5-3': { completed: false }, '5-4': { completed: false }, '5-5': { completed: false }, '5-6': { completed: false } } },
};

const TOTAL_LESSONS = 29;
const TOTAL_LABS = 13;
const TOTAL_SCENARIOS = 25;

function loadState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.progress && typeof parsed.progress === 'object') {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function saveState(state: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage full or unavailable
  }
}

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

function calcStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const sorted = [...dates].sort().reverse();
  const today = todayISO();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = (prev.getTime() - curr.getTime()) / 86400000;
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

// SM-2 simplified
function sm2(prev: CardProgress | undefined, rating: 'hard' | 'good' | 'easy'): CardProgress {
  const p = prev || { easeFactor: 2.5, interval: 0, repetitions: 0, nextReview: '' };
  const quality = rating === 'easy' ? 5 : rating === 'good' ? 3 : 1;

  let { easeFactor, interval, repetitions } = p;

  if (quality >= 3) {
    repetitions += 1;
    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 6;
    else interval = Math.round(interval * easeFactor);
  } else {
    repetitions = 0;
    interval = 1;
  }

  easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

  const next = new Date(Date.now() + interval * 86400000);

  return { easeFactor, interval, repetitions, nextReview: next.toISOString() };
}

const defaultState: PersistedState = {
  progress: defaultProgress,
  completedLabs: [],
  completedScenarios: [],
  quizScores: {},
  practiceExamScore: null,
  scenarioExamScore: null,
  notes: {},
  studyDates: [],
  flashcardProgress: {},
  flashcardsReviewed: 0,
};

export function CourseProvider({ children }: { children: ReactNode }) {
  const saved = loadState();
  const [progress, setProgress] = useState<Record<string, DomainProgress>>(saved?.progress ?? defaultProgress);
  const [completedLabs, setCompletedLabs] = useState<Set<string>>(new Set(saved?.completedLabs ?? []));
  const [completedScenarios, setCompletedScenarios] = useState<Set<string>>(new Set(saved?.completedScenarios ?? []));
  const [quizScores, setQuizScores] = useState<Record<string, number>>(saved?.quizScores ?? {});
  const [practiceExamScore, setPracticeExamScore] = useState<number | null>(saved?.practiceExamScore ?? null);
  const [scenarioExamScore, setScenarioExamScore] = useState<number | null>(saved?.scenarioExamScore ?? null);
  const [notes, setNotes] = useState<Record<string, LessonNote>>(saved?.notes ?? {});
  const [studyDates, setStudyDates] = useState<string[]>(saved?.studyDates ?? []);
  const [flashcardProgress, setFlashcardProgress] = useState<Record<string, CardProgress>>(saved?.flashcardProgress ?? {});
  const [flashcardsReviewed, setFlashcardsReviewed] = useState<number>(saved?.flashcardsReviewed ?? 0);

  // Persist on every change
  useEffect(() => {
    saveState({
      progress,
      completedLabs: Array.from(completedLabs),
      completedScenarios: Array.from(completedScenarios),
      quizScores,
      practiceExamScore,
      scenarioExamScore,
      notes,
      studyDates,
      flashcardProgress,
      flashcardsReviewed,
    });
  }, [progress, completedLabs, completedScenarios, quizScores, practiceExamScore, scenarioExamScore, notes, studyDates, flashcardProgress, flashcardsReviewed]);

  const completeLesson = useCallback((domainId: string, lessonId: string) => {
    setProgress((prev) => {
      const isCompleted = prev[domainId]?.lessons[lessonId]?.completed;
      return {
        ...prev,
        [domainId]: {
          ...prev[domainId],
          lessons: {
            ...prev[domainId].lessons,
            [lessonId]: isCompleted
              ? { completed: false, completedAt: undefined }
              : { completed: true, completedAt: new Date().toISOString() },
          },
        },
      };
    });
  }, []);

  const isLessonCompleted = useCallback((domainId: string, lessonId: string) => {
    return progress[domainId]?.lessons[lessonId]?.completed ?? false;
  }, [progress]);

  const getDomainProgress = useCallback((domainId: string) => {
    const domain = progress[domainId];
    if (!domain) return 0;
    const total = Object.keys(domain.lessons).length;
    const done = Object.values(domain.lessons).filter(l => l.completed).length;
    return Math.round((done / total) * 100);
  }, [progress]);

  const totalCompleted = Object.values(progress).reduce((sum, d) => sum + Object.values(d.lessons).filter(l => l.completed).length, 0);
  const overallProgress = Math.round((totalCompleted / TOTAL_LESSONS) * 100);

  const markLabCompleted = useCallback((labId: string) => {
    setCompletedLabs(prev => new Set(prev).add(labId));
  }, []);

  const markScenarioCompleted = useCallback((scenarioId: string) => {
    setCompletedScenarios(prev => new Set(prev).add(scenarioId));
  }, []);

  const setQuizScore = useCallback((domainId: string, score: number) => {
    setQuizScores(prev => ({ ...prev, [domainId]: score }));
  }, []);

  // ─── Notes ─────────────────────────────────────────────────────
  const saveNote = useCallback((lessonId: string, content: string) => {
    setNotes(prev => ({
      ...prev,
      [lessonId]: { lessonId, content, updatedAt: new Date().toISOString() },
    }));
  }, []);

  const getNote = useCallback((lessonId: string) => notes[lessonId], [notes]);

  const allNotes = useCallback(() => Object.values(notes).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)), [notes]);

  // ─── Study Streak ──────────────────────────────────────────────
  const currentStreak = calcStreak(studyDates);

  const recordStudyDay = useCallback(() => {
    const today = todayISO();
    if (!studyDates.includes(today)) {
      setStudyDates(prev => [...prev, today]);
    }
  }, [studyDates]);

  // ─── Flashcards (SM-2) ─────────────────────────────────────────
  const rateFlashcard = useCallback((cardId: string, rating: 'hard' | 'good' | 'easy') => {
    setFlashcardProgress(prev => ({
      ...prev,
      [cardId]: sm2(prev[cardId], rating),
    }));
    setFlashcardsReviewed(prev => prev + 1);
  }, []);

  const getCardProgress = useCallback((cardId: string) => flashcardProgress[cardId], [flashcardProgress]);

  const getDueCards = useCallback((domainId?: string) => {
    const now = new Date().toISOString();
    return Object.entries(flashcardProgress)
      .filter(([, p]) => !p.nextReview || p.nextReview <= now)
      .map(([id]) => id);
  }, [flashcardProgress]);

  // ─── Reset ─────────────────────────────────────────────────────
  const resetProgress = useCallback(() => {
    setProgress(defaultProgress);
    setCompletedLabs(new Set());
    setCompletedScenarios(new Set());
    setQuizScores({});
    setPracticeExamScore(null);
    setScenarioExamScore(null);
  }, []);

  const getAchievementState = useCallback((): AchievementState => {
    const lessonsCompleted = totalCompleted;
    const domainProgress: Record<string, number> = {};
    let domainsMastered = 0;
    for (const key of ['domain1', 'domain2', 'domain3', 'domain4', 'domain5']) {
      domainProgress[key] = getDomainProgress(key);
      if (domainProgress[key] >= 100) domainsMastered++;
    }
    const quizzesPassed = Object.values(quizScores).filter(s => s === 100).length;
    return {
      lessonsCompleted,
      totalLessons: TOTAL_LESSONS,
      domainProgress,
      labsCompleted: completedLabs.size,
      totalLabs: TOTAL_LABS,
      examScenariosCompleted: completedScenarios.size,
      totalExamScenarios: TOTAL_SCENARIOS,
      quizzesPassed,
      totalQuizzes: 5,
      practiceExamScore,
      scenarioExamScore,
      domainsMastered,
    };
  }, [progress, completedLabs, completedScenarios, quizScores, practiceExamScore, scenarioExamScore, totalCompleted, getDomainProgress]);

  return (
    <CourseContext.Provider value={{
      progress, completeLesson, isLessonCompleted, getDomainProgress, overallProgress,
      completedLabs, completedScenarios, quizScores, practiceExamScore, scenarioExamScore,
      markLabCompleted, markScenarioCompleted, setQuizScore, setPracticeExamScore, setScenarioExamScore,
      getAchievementState, resetProgress,
      notes, saveNote, getNote, allNotes,
      studyDates, currentStreak, recordStudyDay,
      flashcardProgress, flashcardsReviewed, rateFlashcard, getCardProgress, getDueCards,
    }}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourse() {
  const ctx = useContext(CourseContext);
  if (!ctx) throw new Error('useCourse must be used within CourseProvider');
  return ctx;
}
