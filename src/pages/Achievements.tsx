import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ArrowLeft, Lock } from 'lucide-react';
import { useCourse } from '../context/CourseContext';
import { achievements, evaluateAchievements, RARITY_COLORS, RARITY_LABELS } from '../data/achievements';
import type { AchievementState } from '../data/achievements';

function StatCard({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</span>
        <span className="text-sm font-bold" style={{ color }}>{value}/{max}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: pct + '%', backgroundColor: color }} />
      </div>
      <div className="text-xs text-slate-400 mt-1">{pct}% complete</div>
    </div>
  );
}

function BadgeCard({ achievement, unlocked }: { achievement: typeof achievements[0]; unlocked: boolean }) {
  const rarity = RARITY_COLORS[achievement.rarity];
  return (
    <div
      className={`relative rounded-xl border-2 p-4 transition-all duration-300 ${unlocked ? `${rarity.bg} ${rarity.border} shadow-lg ${rarity.glow}` : 'bg-slate-50 border-slate-200 opacity-60'}`}
    >
      {!unlocked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-slate-900/10">
          <Lock className="w-6 h-6 text-slate-400" />
        </div>
      )}
      <div className="flex items-start gap-3">
        <span className="text-3xl">{achievement.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold text-sm ${unlocked ? rarity.text : 'text-slate-400'}`}>{achievement.title}</h3>
          <p className={`text-xs mt-0.5 ${unlocked ? 'text-slate-600' : 'text-slate-400'}`}>{achievement.description}</p>
          <span className={`inline-block mt-1.5 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${unlocked ? rarity.bg + ' ' + rarity.text : 'bg-slate-100 text-slate-400'}`}>
            {RARITY_LABELS[achievement.rarity]}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Achievements() {
  const { getAchievementState } = useCourse();
  const state: AchievementState = useMemo(() => getAchievementState(), [getAchievementState]);
  const unlockedIds = useMemo(() => new Set(evaluateAchievements(state)), [state]);

  const unlocked = achievements.filter(a => unlockedIds.has(a.id));
  const locked = achievements.filter(a => !unlockedIds.has(a.id));

  const categories = [
    { key: 'learning', label: 'Learning', emoji: '📖' },
    { key: 'hands-on', label: 'Hands-on', emoji: '🧪' },
    { key: 'mastery', label: 'Mastery', emoji: '⭐' },
    { key: 'speed', label: 'Exam Performance', emoji: '📝' },
    { key: 'streak', label: 'Ultimate', emoji: '👑' },
  ] as const;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">🏆 Achievements</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
        <p className="text-amber-100">Complete lessons, labs, and exams to unlock badges. Track your journey to Claude Architect certification.</p>
        <div className="flex items-center gap-6 mt-4 text-sm text-amber-100">
          <span className="flex items-center gap-1"><Trophy className="w-4 h-4" /> {unlocked.length}/{achievements.length} Badges</span>
        </div>
      </div>

      {/* Overall Progress Ring */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border p-6">
        <div className="flex items-center justify-center gap-12">
          {/* Big circle */}
          <div className="relative w-40 h-40">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#f1f5f9" strokeWidth="8" />
              <circle cx="60" cy="60" r="52" fill="none" stroke="#f59e0b" strokeWidth="8"
                strokeDasharray={`${(unlocked.length / achievements.length) * 327} 327`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-amber-600">{unlocked.length}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">of {achievements.length}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 flex-1 max-w-md">
            <StatCard label="Lessons" value={state.lessonsCompleted} max={state.totalLessons} color="#7c3aed" />
            <StatCard label="Domains Mastered" value={state.domainsMastered} max={5} color="#0891b2" />
            <StatCard label="Labs" value={state.labsCompleted} max={state.totalLabs} color="#059669" />
            <StatCard label="Exam Scenarios" value={state.examScenariosCompleted} max={state.totalExamScenarios} color="#d97706" />
          </div>
        </div>
      </div>

      {/* Badges by Category */}
      {categories.map(cat => {
        const catAchievements = achievements.filter(a => a.category === cat.key);
        const catUnlocked = catAchievements.filter(a => unlockedIds.has(a.id));
        if (catAchievements.length === 0) return null;
        return (
          <div key={cat.key}>
            <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span>{cat.emoji}</span> {cat.label}
              <span className="text-sm font-normal text-slate-400">({catUnlocked.length}/{catAchievements.length})</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {catAchievements.map(a => <BadgeCard key={a.id} achievement={a} unlocked={unlockedIds.has(a.id)} />)}
            </div>
          </div>
        );
      })}

      {/* Back link */}
      <div className="text-center pt-4">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Course Overview
        </Link>
      </div>
    </div>
  );
}
