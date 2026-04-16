export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'learning' | 'hands-on' | 'mastery' | 'speed' | 'streak';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  condition: (state: AchievementState) => boolean;
}

export interface AchievementState {
  lessonsCompleted: number;
  totalLessons: number;
  domainProgress: Record<string, number>;
  labsCompleted: number;
  totalLabs: number;
  examScenariosCompleted: number;
  totalExamScenarios: number;
  quizzesPassed: number;
  totalQuizzes: number;
  practiceExamScore: number | null;
  scenarioExamScore: number | null;
  domainsMastered: number;
}

export const RARITY_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  common:    { bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-600', glow: '' },
  uncommon:  { bg: 'bg-green-50',  border: 'border-green-400', text: 'text-green-700', glow: 'shadow-green-200/50' },
  rare:      { bg: 'bg-blue-50',   border: 'border-blue-400',  text: 'text-blue-700',  glow: 'shadow-blue-200/50' },
  epic:      { bg: 'bg-purple-50', border: 'border-purple-400',text: 'text-purple-700', glow: 'shadow-purple-200/50' },
  legendary: { bg: 'bg-amber-50',  border: 'border-amber-400', text: 'text-amber-700',  glow: 'shadow-amber-300/60' },
};

export const RARITY_LABELS: Record<string, string> = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
};
