import { Link } from 'react-router-dom';
import { useCourse } from '../context/CourseContext';
import { ArrowRight, BookOpen, FlaskConical, GraduationCap, Zap, Trophy, Brain, StickyNote, Flame, Target } from 'lucide-react';

const domainInfo = [
  { id: 'domain1', name: 'Agentic Architecture', color: '#3b82f6', weight: '27%' },
  { id: 'domain2', name: 'Tool Design & MCP', color: '#8b5cf6', weight: '18%' },
  { id: 'domain3', name: 'Claude Code Config', color: '#10b981', weight: '20%' },
  { id: 'domain4', name: 'Prompt Engineering', color: '#f59e0b', weight: '20%' },
  { id: 'domain5', name: 'Context & Reliability', color: '#ef4444', weight: '15%' },
];

function RadarChart({ values }: { values: number[] }) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = 85;
  const n = values.length;
  const angleStep = (2 * Math.PI) / n;

  const getPoint = (i: number, val: number) => {
    const angle = i * angleStep - Math.PI / 2;
    const dist = (val / 100) * r;
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) };
  };

  // Grid rings
  const rings = [25, 50, 75, 100];

  // Data polygon
  const dataPoints = values.map((v, i) => getPoint(i, v));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  // Axis lines + labels
  const axes = domainInfo.map((d, i) => {
    const outer = getPoint(i, 100);
    return { ...d, outer, angle: i * angleStep - Math.PI / 2 };
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[220px]">
      {/* Grid rings */}
      {rings.map(level => {
        const pts = Array.from({ length: n }, (_, i) => getPoint(i, level));
        const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
        return <path key={level} d={path} fill="none" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />;
      })}

      {/* Axis lines */}
      {axes.map((a, i) => (
        <line key={i} x1={cx} y1={cy} x2={a.outer.x} y2={a.outer.y} className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />
      ))}

      {/* Data polygon */}
      <path d={dataPath} fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" strokeWidth="2" />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill={domainInfo[i].color} className="stroke-white dark:stroke-slate-900" strokeWidth="2" />
      ))}

      {/* Labels */}
      {axes.map((a, i) => {
        const labelR = r + 25;
        const angle = a.angle;
        const lx = cx + labelR * Math.cos(angle);
        const ly = cy + labelR * Math.sin(angle);
        return (
          <text
            key={i}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="central"
            className="text-[9px] fill-slate-500 dark:fill-slate-400 font-medium"
          >
            D{i + 1}
          </text>
        );
      })}
    </svg>
  );
}

function StreakDots({ dates }: { dates: string[] }) {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const iso = d.toISOString().split('T')[0];
    const active = dates.includes(iso);
    const label = d.toLocaleDateString('en', { weekday: 'short' });
    return { iso, active, label };
  });

  return (
    <div className="flex items-center gap-2">
      {days.map(d => (
        <div key={d.iso} className="flex flex-col items-center gap-1">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-colors ${
              d.active
                ? 'bg-green-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
            }`}
          >
            {d.active ? '✓' : '·'}
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const {
    overallProgress, getDomainProgress, completedLabs, completedScenarios,
    quizScores, practiceExamScore, scenarioExamScore,
    notes, studyDates, currentStreak, flashcardsReviewed,
  } = useCourse();

  const domainValues = domainInfo.map(d => getDomainProgress(d.id));
  const weakAreas = domainInfo
    .map((d, i) => ({ ...d, score: quizScores[d.id] ?? -1, progress: domainValues[i] }))
    .filter(d => d.score >= 0 && d.score < 70);

  const notesCount = Object.keys(notes).length;
  const totalLessons = 29;

  // Find next incomplete lesson
  const lessonCounts: Record<string, number> = { domain1: 7, domain2: 5, domain3: 6, domain4: 6, domain5: 6 };
  let continueLesson: { domain: number; lesson: number } | null = null;
  for (const d of [1, 2, 3, 4, 5]) {
    for (let l = 1; l <= lessonCounts[`domain${d}`]; l++) {
      const domainId = `domain${d}`;
      const lessonId = `${d}-${l}`;
      const domain = { domain1: 'domain1', domain2: 'domain2', domain3: 'domain3', domain4: 'domain4', domain5: 'domain5' }[domainId];
      // Simple check — if progress < 100 for this domain, suggest next lesson
      if (getDomainProgress(domainId) < 100) {
        continueLesson = { domain: d, lesson: l };
        break;
      }
    }
    if (continueLesson) break;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          📊 Study Dashboard
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Your learning progress at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} label="Lessons" value={`${Object.values(studyDates).length > 0 ? Math.round(overallProgress / 100 * totalLessons) : 0}/${totalLessons}`} color="#3b82f6" />
        <StatCard icon={FlaskConical} label="Labs" value={`${completedLabs.size}/14`} color="#10b981" />
        <StatCard icon={Brain} label="Flashcards" value={`${flashcardsReviewed}`} color="#8b5cf6" />
        <StatCard icon={StickyNote} label="Notes" value={`${notesCount}`} color="#f59e0b" />
      </div>

      {/* Radar + Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Domain Progress</h3>
          <div className="flex justify-center">
            <RadarChart values={domainValues} />
          </div>
          <div className="mt-4 space-y-2">
            {domainInfo.map((d, i) => (
              <div key={d.id} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-xs text-slate-500 dark:text-slate-400 w-32">{d.name}</span>
                <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${domainValues[i]}%`, backgroundColor: d.color }} />
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 w-8 text-right">{domainValues[i]}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scores */}
        <div className="space-y-4">
          {/* Exam Scores */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Exam Scores</h3>
            <div className="space-y-3">
              <ScoreRow label="Practice Exam (60Q)" score={practiceExamScore} />
              <ScoreRow label="Scenario Exam (20Q)" score={scenarioExamScore} />
              {domainInfo.map(d => (
                <ScoreRow key={d.id} label={`Quiz D${d.id.replace('domain', '')}: ${d.name}`} score={quizScores[d.id]} />
              ))}
            </div>
          </div>

          {/* Weak Areas */}
          {weakAreas.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-900/30 p-6">
              <h3 className="font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                ⚠️ Weak Areas
              </h3>
              <div className="space-y-2">
                {weakAreas.map(w => (
                  <div key={w.id} className="flex items-center justify-between text-sm">
                    <span className="text-red-600 dark:text-red-400">{w.name}</span>
                    <span className="font-medium text-red-700 dark:text-red-300">Quiz: {w.score}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Streak */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" /> Study Streak
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-orange-500">{currentStreak}</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">day{currentStreak !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <StreakDots dates={studyDates} />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          {continueLesson && (
            <Link
              to={`/domain/${continueLesson.domain}`}
              className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" /> Continue D{continueLesson.domain}L{continueLesson.lesson}
            </Link>
          )}
          <Link
            to="/flashcards"
            className="px-5 py-3 bg-violet-500 hover:bg-violet-400 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
          >
            <Brain className="w-4 h-4" /> Study Flashcards
          </Link>
          <Link
            to="/practice-exam"
            className="px-5 py-3 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
          >
            <GraduationCap className="w-4 h-4" /> Practice Exam
          </Link>
          <Link
            to="/scenario-exams"
            className="px-5 py-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:opacity-90 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
          >
            <Target className="w-4 h-4" /> Scenario Exams
          </Link>
          <Link
            to="/achievements"
            className="px-5 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-colors flex items-center gap-2"
          >
            <Trophy className="w-4 h-4" /> Achievements
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">{value}</div>
        </div>
      </div>
    </div>
  );
}

function ScoreRow({ label, score }: { label: string; score: number | null | undefined }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
      {score != null ? (
        <span className={`text-sm font-medium px-2 py-0.5 rounded ${
          score >= 80 ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
          score >= 60 ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' :
          'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
        }`}>
          {score}%
        </span>
      ) : (
        <span className="text-sm text-slate-300 dark:text-slate-600">—</span>
      )}
    </div>
  );
}
