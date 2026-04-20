import type { Achievement, AchievementState } from './types';

export const achievements: Achievement[] = [
  // ─── Learning ─────────────────────────────────────────────────
  {
    id: 'first-lesson',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: '📖',
    category: 'learning',
    rarity: 'common',
    condition: (s: AchievementState) => s.lessonsCompleted >= 1,
  },
  {
    id: 'five-lessons',
    title: 'Getting Warmed Up',
    description: 'Complete 5 lessons',
    icon: '📚',
    category: 'learning',
    rarity: 'common',
    condition: (s: AchievementState) => s.lessonsCompleted >= 5,
  },
  {
    id: 'half-lessons',
    title: 'Halfway There',
    description: 'Complete 50% of all lessons',
    icon: '🎯',
    category: 'learning',
    rarity: 'uncommon',
    condition: (s: AchievementState) => s.lessonsCompleted >= Math.ceil(s.totalLessons * 0.5),
  },
  {
    id: 'all-lessons',
    title: 'Scholar',
    description: 'Complete all lessons across every domain',
    icon: '🎓',
    category: 'learning',
    rarity: 'rare',
    condition: (s: AchievementState) => s.lessonsCompleted >= s.totalLessons,
  },

  // ─── Domain Mastery ───────────────────────────────────────────
  {
    id: 'domain1-done',
    title: 'Architect Initiate',
    description: 'Complete all Domain 1 lessons (Agentic Architecture)',
    icon: '🏛️',
    category: 'mastery',
    rarity: 'uncommon',
    condition: (s: AchievementState) => (s.domainProgress['domain1'] ?? 0) >= 100,
  },
  {
    id: 'domain2-done',
    title: 'Context Master',
    description: 'Complete all Domain 2 lessons (Context Engineering)',
    icon: '🧠',
    category: 'mastery',
    rarity: 'uncommon',
    condition: (s: AchievementState) => (s.domainProgress['domain2'] ?? 0) >= 100,
  },
  {
    id: 'domain3-done',
    title: 'Tool Smith',
    description: 'Complete all Domain 3 lessons (Tool Design)',
    icon: '🔧',
    category: 'mastery',
    rarity: 'uncommon',
    condition: (s: AchievementState) => (s.domainProgress['domain3'] ?? 0) >= 100,
  },
  {
    id: 'domain4-done',
    title: 'Quality Guardian',
    description: 'Complete all Domain 4 lessons (Testing & Evaluation)',
    icon: '🛡️',
    category: 'mastery',
    rarity: 'uncommon',
    condition: (s: AchievementState) => (s.domainProgress['domain4'] ?? 0) >= 100,
  },
  {
    id: 'domain5-done',
    title: 'Security Warden',
    description: 'Complete all Domain 5 lessons (Security & Guardrails)',
    icon: '🔒',
    category: 'mastery',
    rarity: 'uncommon',
    condition: (s: AchievementState) => (s.domainProgress['domain5'] ?? 0) >= 100,
  },
  {
    id: 'all-domains',
    title: 'Five-Star General',
    description: 'Complete ALL five domains — full course mastery',
    icon: '⭐',
    category: 'mastery',
    rarity: 'epic',
    condition: (s: AchievementState) => s.domainsMastered >= 5,
  },

  // ─── Hands-on ─────────────────────────────────────────────────
  {
    id: 'first-lab',
    title: 'Lab Rat',
    description: 'Complete your first hands-on lab',
    icon: '🧪',
    category: 'hands-on',
    rarity: 'common',
    condition: (s: AchievementState) => s.labsCompleted >= 1,
  },
  {
    id: 'five-labs',
    title: 'Experimenter',
    description: 'Complete 5 hands-on labs',
    icon: '🔬',
    category: 'hands-on',
    rarity: 'uncommon',
    condition: (s: AchievementState) => s.labsCompleted >= 5,
  },
  {
    id: 'all-labs',
    title: 'Lab Champion',
    description: 'Complete all 13 hands-on labs',
    icon: '🏅',
    category: 'hands-on',
    rarity: 'rare',
    condition: (s: AchievementState) => s.labsCompleted >= s.totalLabs,
  },
  {
    id: 'first-scenario',
    title: 'Bug Hunter',
    description: 'Fix your first exam scenario (Broken → Fixed)',
    icon: '🐛',
    category: 'hands-on',
    rarity: 'common',
    condition: (s: AchievementState) => s.examScenariosCompleted >= 1,
  },
  {
    id: 'ten-scenarios',
    title: 'Code Doctor',
    description: 'Fix 10 exam scenarios',
    icon: '💊',
    category: 'hands-on',
    rarity: 'rare',
    condition: (s: AchievementState) => s.examScenariosCompleted >= 10,
  },
  {
    id: 'all-scenarios',
    title: 'Exterminator',
    description: 'Fix all 25 exam scenarios',
    icon: '🦸',
    category: 'hands-on',
    rarity: 'epic',
    condition: (s: AchievementState) => s.examScenariosCompleted >= s.totalExamScenarios,
  },

  // ─── Exam Performance ─────────────────────────────────────────
  {
    id: 'quiz-perfect',
    title: 'Quiz Whiz',
    description: 'Score 100% on any domain quiz',
    icon: '💯',
    category: 'speed',
    rarity: 'rare',
    condition: (s: AchievementState) => s.quizzesPassed >= 1,
  },
  {
    id: 'practice-pass',
    title: 'Exam Ready',
    description: 'Score 70%+ on the Practice Exam (66 questions)',
    icon: '📝',
    category: 'speed',
    rarity: 'uncommon',
    condition: (s: AchievementState) => (s.practiceExamScore ?? 0) >= 70,
  },
  {
    id: 'practice-ace',
    title: 'Claude Certified',
    description: 'Score 90%+ on the Practice Exam',
    icon: '🏆',
    category: 'speed',
    rarity: 'epic',
    condition: (s: AchievementState) => (s.practiceExamScore ?? 0) >= 90,
  },
  {
    id: 'scenario-pass',
    title: 'Scenario Solver',
    description: 'Score 70%+ on the Scenario Exam',
    icon: '🧩',
    category: 'speed',
    rarity: 'uncommon',
    condition: (s: AchievementState) => (s.scenarioExamScore ?? 0) >= 70,
  },
  {
    id: 'scenario-ace',
    title: 'Scenario Master',
    description: 'Score 90%+ on the Scenario Exam',
    icon: '🎭',
    category: 'speed',
    rarity: 'rare',
    condition: (s: AchievementState) => (s.scenarioExamScore ?? 0) >= 90,
  },

  // ─── Legendary ────────────────────────────────────────────────
  {
    id: 'completionist',
    title: 'Completionist',
    description: '100% everything: all lessons, all labs, all scenarios, 90%+ on both exams',
    icon: '👑',
    category: 'streak',
    rarity: 'legendary',
    condition: (s: AchievementState) =>
      s.lessonsCompleted >= s.totalLessons &&
      s.labsCompleted >= s.totalLabs &&
      s.examScenariosCompleted >= s.totalExamScenarios &&
      (s.practiceExamScore ?? 0) >= 90 &&
      (s.scenarioExamScore ?? 0) >= 90,
  },
];

export function evaluateAchievements(state: AchievementState): string[] {
  return achievements.filter(a => a.condition(state)).map(a => a.id);
}

export function getAchievementById(id: string): Achievement | undefined {
  return achievements.find(a => a.id === id);
}
