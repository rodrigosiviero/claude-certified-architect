import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCourse } from '../context/CourseContext';
import { shuffleAllOptions } from '../utils/shuffle';
import {
  generateRandomExam, generateDomainExam, generateFullExam,
  getPoolStats, type GeneratedExam, type UnifiedQuestion,
} from '../data/questionBank';
import { scenarioExams } from '../data/scenarioExams';
import {
  ArrowLeft, ArrowRight, BarChart3, Brain, CheckCircle2, ChevronDown,
  Clock, FlaskConical, Lightbulb, RotateCcw, Trophy, XCircle, Target,
  AlertTriangle, Scroll, Shuffle, Zap, BookOpen, Sparkles, Briefcase,
} from 'lucide-react';

// ── Domain meta ──────────────────────────────────────────────────────────────
const domainMeta: Record<string, { label: string; color: string; bg: string; border: string }> = {
  d1: { label: 'Agentic Architecture', color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200' },
  d2: { label: 'Tool Design & MCP', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  d3: { label: 'Claude Code Config', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
  d4: { label: 'Prompt Engineering', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  d5: { label: 'Safety & Evaluation', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
};

const domainIcons: Record<string, string> = { d1: '🏗️', d2: '🔧', d3: '⚙️', d4: '🎨', d5: '🛡️' };

const scenarioColors = [
  { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', hover: 'hover:border-blue-400' },
  { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', hover: 'hover:border-emerald-400' },
  { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', hover: 'hover:border-amber-400' },
  { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', hover: 'hover:border-violet-400' },
  { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', hover: 'hover:border-rose-400' },
  { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', hover: 'hover:border-cyan-400' },
];

type Phase = 'hub' | 'exam' | 'results';

// ── Shuffled question wrapper ─────────────────────────────────────────────
interface ShuffledQ extends UnifiedQuestion {
  shuffledOptions: string[];
  shuffledCorrect: number;
}

// Convert a scenario exam question to UnifiedQuestion format
/** Strip leading "A) ", "B) ", "C) ", "D) " prefix from option text */
const stripOptPrefix = (s: string) => s.replace(/^[A-D]\)\s*/, '');

function scenarioToUnified(examId: number, q: { id: number; domain: string; domainLabel: string; examTask?: string; scenario: string; question: string; options: string[]; correct: number; explanation: string; trap?: string }): UnifiedQuestion {
  return {
    poolId: (examId - 1) * 20 + q.id,
    domain: q.domain as UnifiedQuestion['domain'],
    domainLabel: q.domainLabel,
    examTask: (q as { examTask?: string }).examTask || '',
    scenario: q.scenario,
    question: q.question,
    options: [...q.options],
    correct: q.correct,
    explanation: q.explanation,
    trap: q.trap,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// HUB PHASE
// ══════════════════════════════════════════════════════════════════════════════
function HubPhase({ onStart }: { onStart: (exam: GeneratedExam) => void }) {
  const stats = getPoolStats();
  const [examCounter, setExamCounter] = useState(() => Date.now());

  const makeSeed = useCallback(() => {
    setExamCounter(c => c + 1);
    return examCounter + 1;
  }, [examCounter]);

  const handleScenarioExam = (examIdx: number) => {
    const exam = scenarioExams[examIdx];
    onStart({
      id: `scenario-${exam.id}`,
      title: exam.title,
      description: exam.description,
      icon: exam.icon,
      questions: exam.questions.map(q => scenarioToUnified(exam.id, q)),
      mode: 'random',
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Exam Center</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Practice with scenario-based exams and randomized quizzes from a pool of <strong>{stats.total}</strong> questions.
        </p>
      </div>

      {/* ── SECTION 1: Scenario Exams (fixed) ────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-5 h-5 text-violet-500" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Scenario Exams</h3>
          <span className="text-xs text-slate-400 font-normal">6 themed exams • 20Q each • fixed questions</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {scenarioExams.map((exam, idx) => {
            const c = scenarioColors[idx % scenarioColors.length];
            return (
              <button
                key={exam.id}
                onClick={() => handleScenarioExam(idx)}
                className={`group rounded-xl border-2 ${c.border} ${c.bg} ${c.hover} p-4 text-left transition-all hover:shadow-md`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{exam.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold text-sm ${c.text}`}>{exam.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{exam.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-medium text-slate-500 bg-white/60 dark:bg-slate-800/60 px-2 py-0.5 rounded">
                        {exam.questions.length} questions
                      </span>
                      <span className="text-xs text-slate-400">4 per domain</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Pool stats ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-2">
        <Shuffle className="w-5 h-5 text-emerald-500" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Random Simulator</h3>
        <span className="text-xs text-slate-400 font-normal">{stats.total} questions in pool • fresh mix every time</span>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {['d1','d2','d3','d4','d5'].map(d => (
          <div key={d} className={`${domainMeta[d].bg} rounded-lg p-3 text-center border ${domainMeta[d].border}`}>
            <div className="text-2xl">{domainIcons[d]}</div>
            <div className={`text-xs font-medium mt-1 ${domainMeta[d].color}`}>D{d[1]}</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">{stats.byDomain[d]}</div>
            <div className="text-xs text-slate-500">questions</div>
          </div>
        ))}
      </div>

      {/* ── SECTION 2: Random Simulator modes ──────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Random 20Q */}
        <button
          onClick={() => onStart(generateRandomExam(makeSeed()))}
          className="group relative overflow-hidden rounded-2xl border-2 border-violet-200 bg-violet-50 p-6 text-left hover:border-violet-400 hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-violet-500 text-white flex items-center justify-center text-2xl">🎲</div>
            <div>
              <h3 className="font-bold text-violet-900">Random 20Q</h3>
              <p className="text-sm text-violet-600">Quick practice</p>
            </div>
          </div>
          <p className="text-sm text-violet-700">4 questions per domain. Fresh mix every click.</p>
          <Shuffle className="absolute -right-2 -bottom-2 w-16 h-16 text-violet-200 group-hover:text-violet-300 transition-colors" />
        </button>

        {/* Domain Focus */}
        <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-2xl">🎯</div>
            <div>
              <h3 className="font-bold text-emerald-900">Domain Focus</h3>
              <p className="text-sm text-emerald-600">Drill one domain</p>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-1 mt-3">
            {['d1','d2','d3','d4','d5'].map(d => (
              <button
                key={d}
                onClick={() => onStart(generateDomainExam(d, makeSeed()))}
                className={`${domainMeta[d].bg} ${domainMeta[d].color} rounded-lg p-2 text-center text-xs font-medium hover:opacity-80 transition-opacity border ${domainMeta[d].border}`}
              >
                D{d[1]}
                <br />
                <span className="text-[10px] opacity-75">{stats.byDomain[d]}q</span>
              </button>
            ))}
          </div>
        </div>

        {/* Full Exam */}
        <button
          onClick={() => onStart(generateFullExam(makeSeed()))}
          className="group relative overflow-hidden rounded-2xl border-2 border-amber-200 bg-amber-50 p-6 text-left hover:border-amber-400 hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center text-2xl">📝</div>
            <div>
              <h3 className="font-bold text-amber-900">Full Exam (60Q)</h3>
              <p className="text-sm text-amber-600">Real exam simulation</p>
            </div>
          </div>
          <p className="text-sm text-amber-700">12 per domain. Simulates the real certification exam.</p>
          <BookOpen className="absolute -right-2 -bottom-2 w-16 h-16 text-amber-200 group-hover:text-amber-300 transition-colors" />
        </button>
      </div>

      {/* Tip */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 p-4">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Pro tip:</strong> Scenario exams test real-world application with themed stories. The Random Simulator mixes questions from the entire pool — answer options are shuffled daily to prevent memorization.
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// EXAM PHASE
// ══════════════════════════════════════════════════════════════════════════════
function ExamPhase({
  exam, shuffled, answers, currentQ, showFeedback, selectedAnswer,
  onSelect, onNext, onSubmit, onBack,
}: {
  exam: GeneratedExam;
  shuffled: ShuffledQ[];
  answers: Record<number, number>;
  currentQ: number;
  showFeedback: boolean;
  selectedAnswer: number | null;
  onSelect: (index: number) => void;
  onNext: () => void;
  onSubmit: () => void;
  onBack: () => void;
}) {
  const q = shuffled[currentQ];
  const answeredCount = Object.keys(answers).length;
  const isCorrect = selectedAnswer === q.shuffledCorrect;
  const dm = domainMeta[q.domain] || domainMeta.d1;
  const isLast = currentQ === shuffled.length - 1;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
          <ArrowLeft className="w-4 h-4" /> Exit
        </button>
        <div className="flex items-center gap-3">
          <span className="text-lg">{exam.icon}</span>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{exam.title}</span>
        </div>
      </div>

      {/* Domain + progress */}
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${dm.bg} ${dm.color}`}>{dm.label}</span>
        <span className="text-sm text-slate-500">{answeredCount}/{shuffled.length} answered</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div className="bg-violet-500 h-2 rounded-full transition-all" style={{ width: `${(answeredCount / shuffled.length) * 100}%` }} />
      </div>

      {/* Question */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="text-xs text-slate-400 mb-2">Question {currentQ + 1} of {shuffled.length}</div>

        {/* Scenario */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-4 text-sm text-slate-700 dark:text-slate-300 italic">
          {q.scenario}
        </div>

        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">{q.question}</h3>

        {/* Options */}
        <div className="space-y-2">
          {q.shuffledOptions.map((opt, i) => {
            const letter = String.fromCharCode(65 + i);
            let optClass = 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 cursor-pointer';
            let letterBg = 'bg-slate-100 text-slate-600';

            if (showFeedback) {
              if (i === q.shuffledCorrect) {
                optClass = 'border-green-300 bg-green-50';
                letterBg = 'bg-green-500 text-white';
              } else if (i === selectedAnswer && !isCorrect) {
                optClass = 'border-red-300 bg-red-50';
                letterBg = 'bg-red-500 text-white';
              } else {
                optClass = 'border-slate-100 bg-slate-50 opacity-50';
              }
            } else if (i === selectedAnswer) {
              optClass = 'border-slate-400 bg-slate-100';
            }

            return (
              <button
                key={i}
                onClick={() => onSelect(i)}
                disabled={showFeedback}
                className={`w-full text-left rounded-xl border p-4 transition-all flex items-center gap-3 ${optClass}`}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${letterBg}`}>
                  {letter}
                </span>
                <span className="text-sm text-slate-700 dark:text-slate-300">{stripOptPrefix(opt)}</span>
                {showFeedback && i === q.shuffledCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto flex-shrink-0" />
                )}
                {showFeedback && i === selectedAnswer && !isCorrect && i !== q.shuffledCorrect && (
                  <XCircle className="w-5 h-5 text-red-500 ml-auto flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className="mt-4 space-y-2">
            <div className={`flex items-start gap-2 p-3 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <p className={`text-sm font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </p>
                {q.examTask && <p className="text-xs font-mono text-indigo-600 dark:text-indigo-400 mb-1">📘 {q.examTask}</p>}
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{q.explanation}</p>
              </div>
            </div>
            {!isCorrect && (
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-green-700">
                  <span className="font-semibold">Correct answer: </span>
                  {stripOptPrefix(q.shuffledOptions[q.shuffledCorrect])}
                </p>
              </div>
            )}
            {q.trap && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-700"><strong>Trap:</strong> {q.trap}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2 flex-wrap">
          {shuffled.map((_, i) => (
            <button
              key={i}
              onClick={() => {/* jump-to disabled for simplicity */}}
              disabled
              className={`w-3 h-3 rounded-full transition-all ${
                i === currentQ ? 'bg-violet-600 scale-125' : answers[i] !== undefined ? 'bg-violet-300' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          {showFeedback && !isLast && (
            <button onClick={onNext} className="flex items-center gap-1 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700">
              Next <ArrowRight className="w-4 h-4" />
            </button>
          )}
          {showFeedback && isLast && (
            <button onClick={onSubmit} className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Trophy className="w-4 h-4" /> See Results
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// RESULTS PHASE
// ══════════════════════════════════════════════════════════════════════════════
function ResultsPhase({
  exam, shuffled, answers, onRetry, onBack,
}: {
  exam: GeneratedExam;
  shuffled: ShuffledQ[];
  answers: Record<number, number>;
  onRetry: () => void;
  onBack: () => void;
}) {
  const score = shuffled.reduce((acc, q, i) => acc + (answers[i] === q.shuffledCorrect ? 1 : 0), 0);
  const pct = Math.round((score / shuffled.length) * 100);
  const [filterDomain, setFilterDomain] = useState<string>('all');
  const [expandedReview, setExpandedReview] = useState<number | null>(null);

  const filteredQuestions = filterDomain === 'all' ? shuffled : shuffled.filter(q => q.domain === filterDomain);

  const domainBreakdown = ['d1','d2','d3','d4','d5'].map(d => {
    const qs = shuffled.filter(q => q.domain === d);
    const correct = qs.reduce((acc, q) => {
      const globalIdx = shuffled.indexOf(q);
      return acc + (answers[globalIdx] === q.shuffledCorrect ? 1 : 0);
    }, 0);
    return { domain: d, total: qs.length, correct };
  }).filter(d => d.total > 0);

  const grade = pct >= 90 ? { label: 'Excellent!', color: 'text-green-600', icon: '🏆' }
    : pct >= 70 ? { label: 'Good job!', color: 'text-blue-600', icon: '👍' }
    : pct >= 50 ? { label: 'Keep practicing', color: 'text-amber-600', icon: '📚' }
    : { label: 'More study needed', color: 'text-red-600', icon: '💪' };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="w-4 h-4" /> Back to Hub
      </button>

      {/* Score card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
        <div className="text-sm text-slate-400 mb-2">{exam.icon} {exam.title}</div>
        <div className="text-5xl mb-2">{grade.icon}</div>
        <h2 className={`text-2xl font-bold ${grade.color}`}>{grade.label}</h2>
        <div className="mt-4 flex items-center justify-center gap-4">
          <div className="text-4xl font-bold text-slate-900 dark:text-white">{pct}%</div>
          <div className="text-left text-sm text-slate-500">
            <div>{score} correct</div>
            <div>{shuffled.length - score} incorrect</div>
          </div>
        </div>

        {/* Domain breakdown */}
        {domainBreakdown.length > 1 && (
          <div className={`mt-6 grid gap-2 ${domainBreakdown.length <= 3 ? 'grid-cols-3' : 'grid-cols-5'}`}>
            {domainBreakdown.map(d => {
              const dm = domainMeta[d.domain];
              return (
                <div key={d.domain} className={`${dm.bg} rounded-lg p-2 border ${dm.border}`}>
                  <div className={`text-xs font-medium ${dm.color}`}>D{d.domain[1]}</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{d.correct}/{d.total}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={onRetry} className="flex items-center gap-1 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700">
            <RotateCcw className="w-4 h-4" /> Try Another
          </button>
          <button onClick={onBack} className="flex items-center gap-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300">
            Back to Hub
          </button>
        </div>
      </div>

      {/* Review */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900 dark:text-white">Review Answers</h3>
          <div className="flex gap-1 flex-wrap">
            <button
              onClick={() => setFilterDomain('all')}
              className={`px-3 py-1 rounded text-xs font-medium ${filterDomain === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              All
            </button>
            {['d1','d2','d3','d4','d5'].map(d => (
              <button
                key={d}
                onClick={() => setFilterDomain(d)}
                className={`px-3 py-1 rounded text-xs font-medium ${filterDomain === d ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                D{d[1]}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredQuestions.map((q, _) => {
            const globalIdx = shuffled.indexOf(q);
            const userAnswer = answers[globalIdx];
            const isCorrect = userAnswer === q.shuffledCorrect;
            const isExpanded = expandedReview === globalIdx;

            return (
              <div key={globalIdx} className={`rounded-xl border p-4 ${isCorrect ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'}`}>
                <button
                  onClick={() => setExpandedReview(isExpanded ? null : globalIdx)}
                  className="w-full text-left flex items-start gap-3"
                >
                  {isCorrect
                    ? <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    : <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  }
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-slate-900 dark:text-white">{q.question}</p>
                    <p className={`text-sm mt-1 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      {isCorrect ? '✓ Correct' : `✗ Correct answer: ${stripOptPrefix(q.shuffledOptions[q.shuffledCorrect])}`}
                    </p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                {isExpanded && (
                  <div className="mt-3 pl-8 space-y-2 text-sm">
                    <p className="text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800 rounded p-3">{q.scenario}</p>
                    {q.examTask && <p className="text-xs font-mono text-indigo-600 dark:text-indigo-400">📘 {q.examTask}</p>}
                    <p className="text-slate-700 dark:text-slate-300"><strong>Explanation:</strong> {q.explanation}</p>
                    {userAnswer !== undefined && !isCorrect && (
                      <p className="text-red-600"><strong>Your answer:</strong> {stripOptPrefix(q.shuffledOptions[userAnswer])}</p>
                    )}
                    {q.trap && (
                      <p className="text-amber-700"><strong>Trap:</strong> {q.trap}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
export default function ScenarioExamHub() {
  const { setQuizScore } = useCourse();
  const [phase, setPhase] = useState<Phase>('hub');
  const [currentExam, setCurrentExam] = useState<GeneratedExam | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Shuffle options with daily seed
  const shuffled = useMemo(() => {
    if (!currentExam) return [];
    return shuffleAllOptions(currentExam.questions) as ShuffledQ[];
  }, [currentExam]);

  // Save score on results
  useEffect(() => {
    if (phase === 'results' && currentExam) {
      const score = shuffled.reduce((acc, q, i) => acc + (answers[i] === q.shuffledCorrect ? 1 : 0), 0);
      const pct = Math.round((score / shuffled.length) * 100);
      setQuizScore(`sim-${currentExam.id}`, pct);
    }
  }, [phase]);

  const handleStart = (exam: GeneratedExam) => {
    setCurrentExam(exam);
    setPhase('exam');
    setCurrentQ(0);
    setAnswers({});
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const handleSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);
    setAnswers(prev => ({ ...prev, [currentQ]: index }));
  };

  const handleNext = () => {
    setCurrentQ(prev => prev + 1);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const handleSubmit = () => {
    setPhase('results');
  };

  const handleRetry = () => {
    setPhase('hub');
    setCurrentExam(null);
  };

  const handleBack = () => {
    setPhase('hub');
    setCurrentExam(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/" className="text-slate-400 hover:text-slate-600"><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FlaskConical className="w-6 h-6 text-violet-500" /> Exam Center
            </h1>
            <p className="text-sm text-slate-500">Scenario exams + randomized practice</p>
          </div>
        </div>

        {phase === 'hub' && <HubPhase onStart={handleStart} />}
        {phase === 'exam' && currentExam && (
          <ExamPhase
            exam={currentExam} shuffled={shuffled} answers={answers}
            currentQ={currentQ} showFeedback={showFeedback} selectedAnswer={selectedAnswer}
            onSelect={handleSelect} onNext={handleNext} onSubmit={handleSubmit} onBack={handleBack}
          />
        )}
        {phase === 'results' && currentExam && (
          <ResultsPhase
            exam={currentExam} shuffled={shuffled} answers={answers}
            onRetry={handleRetry} onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}
