import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, ArrowRight, BarChart3, Brain, Briefcase, CheckCircle2, ChevronDown, ChevronRight, Clock, FlaskConical, Lightbulb, RotateCcw, Scroll, Target, Trophy, XCircle } from 'lucide-react';
import { scenarios } from '../data/scenarios';
import type { Scenario } from '../data/scenarios';
import { shuffleAllOptions } from '../utils/shuffle';

type Domain = 'd1' | 'd2' | 'd3' | 'd4' | 'd5';


// ─────────────────────────────────────────────────────────────────────────────
// UI
// ─────────────────────────────────────────────────────────────────────────────

const domainMeta: Record<Domain, { label: string; color: string; bg: string; border: string }> = {
  d1: { label: 'Agentic Architecture', color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200' },
  d2: { label: 'Tool Design & MCP', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  d3: { label: 'Claude Code Config', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
  d4: { label: 'Prompt Engineering', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  d5: { label: 'Safety & Evaluation', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
};

const diffColors: Record<string, string> = {
  Intermediate: 'bg-green-100 text-green-700',
  Advanced: 'bg-amber-100 text-amber-700',
  Expert: 'bg-red-100 text-red-700',
};

type Phase = 'start' | 'exam' | 'results';

export default function ScenarioExam() {
  const [phase, setPhase] = useState<Phase>('start');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [expandedReview, setExpandedReview] = useState<number | null>(null);

  const shuffled = useMemo(() => shuffleAllOptions(scenarios), [scenarios]);
  const [filterDomain, setFilterDomain] = useState<Domain | 'all'>('all');
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  const answeredCount = Object.keys(answers).length;

  const getScore = () => {
    let correct = 0;
    scenarios.forEach((q) => { if (answers[q.id] === q.shuffledCorrect) correct++; });
    return correct;
  };

  const getDomainScore = (domain: Domain) => {
    const qs = shuffled.filter((q) => q.domain === domain);
    let correct = 0;
    qs.forEach((q) => { if (answers[q.id] === q.shuffledCorrect) correct++; });
    return { correct, total: qs.length, pct: qs.length > 0 ? Math.round((correct / qs.length) * 100) : 0 };
  };

  const startExam = () => {
    setAnswers({});
    setCurrentQ(0);
    setExpandedReview(null);
    setFilterDomain('all');
    setStartTime(Date.now());
    setPhase('exam');
  };

  const submitExam = () => {
    setEndTime(Date.now());
    setPhase('results');
  };

  const selectAnswer = (qId: number, optIdx: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const formatTime = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return `${mins}m ${secs}s`;
  };

  const filteredQuestions = filterDomain === 'all' ? shuffled : shuffled.filter((q) => q.domain === filterDomain);

  // ── START ─────────────────────────────────────────────────────────────────
  if (phase === 'start') {
    const counts = { d1: 0, d2: 0, d3: 0, d4: 0, d5: 0 };
    scenarios.forEach((q) => counts[q.domain]++);

    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-8 h-8" />
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">Scenario-Based</span>
          </div>
          <h1 className="text-3xl font-bold mb-3">Architectural Decision Exam</h1>
          <p className="text-amber-100">20 real-world scenarios testing your ability to make the right architectural decisions — not trivia memorization.</p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
          {(Object.entries(domainMeta) as [Domain, typeof domainMeta.d1][]).map(([key, meta]) => (
            <div key={key} className={`${meta.bg} border ${meta.border} rounded-xl p-3 text-center`}>
              <p className={`text-xs font-semibold ${meta.color}`}>{meta.label.split(' ')[0]}</p>
              <p className={`text-2xl font-bold ${meta.color}`}>{counts[key]}</p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2"><FlaskConical className="w-5 h-5" /> What makes this different?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-violet-50 rounded-lg p-3">
              <p className="font-semibold text-violet-900 text-sm mb-1">Scenario-First</p>
              <p className="text-xs text-violet-700">Each question starts with a real-world situation, not a definition lookup</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/10 rounded-lg p-3">
              <p className="font-semibold text-amber-900 text-sm mb-1">Exam Traps</p>
              <p className="text-xs text-amber-700">Each answer explains the common trap and why the wrong answer is tempting</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-3">
              <p className="font-semibold text-green-900 text-sm mb-1">Mixed Difficulty</p>
              <p className="text-xs text-green-700">Intermediate to Expert — mirrors the real exam&apos;s hardest questions</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border p-6">
          <h3 className="font-semibold text-slate-900 mb-3">Difficulty Breakdown</h3>
          <div className="flex gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Intermediate — 5</span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Advanced — 10</span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">Expert — 5</span>
          </div>
        </div>

        <button
          onClick={startExam}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold text-lg py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Brain className="w-5 h-5" />
          Start Scenario Exam — 20 Questions
        </button>
      </div>
    );
  }

  // ── EXAM ──────────────────────────────────────────────────────────────────
  if (phase === 'exam') {
    const q = shuffled[currentQ];
    const meta = domainMeta[q.domain];
    const elapsed = Date.now() - startTime;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-2 py-1 rounded ${meta.bg} ${meta.color} ${meta.border} border`}>{meta.label}</span>
              <span className="text-xs text-slate-400">{q.domainLabel}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${diffColors[q.difficulty]}`}>{q.difficulty}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {formatTime(elapsed)}</span>
              <span>{answeredCount}/{scenarios.length}</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="bg-amber-500 h-2 rounded-full transition-all" style={{ width: `${(answeredCount / scenarios.length) * 100}%` }} />
          </div>
        </div>

        {/* Scenario Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Scroll className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Scenario</span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">{q.scenario}</p>
        </div>

        {/* Question */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border p-6 space-y-5">
          <div className="flex items-start gap-3">
            <span className="bg-amber-100 text-amber-700 text-sm font-bold px-2.5 py-1 rounded-lg flex-shrink-0">
              {currentQ + 1}/{scenarios.length}
            </span>
            <p className="font-semibold text-slate-900 text-lg">{q.question}</p>
          </div>

          <div className="space-y-2">
            {q.shuffledOptions.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => selectAnswer(q.id, idx)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  answers[q.id] === idx
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className={`font-medium text-sm ${answers[q.id] === idx ? 'text-amber-700' : 'text-slate-700'}`}>{opt}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentQ((p) => Math.max(0, p - 1))}
            disabled={currentQ === 0}
            className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4 inline mr-1" /> Previous
          </button>

          <div className="flex gap-1.5">
            {scenarios.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQ(i)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  i === currentQ ? 'bg-amber-600 scale-125' : answers[shuffled[i].id] !== undefined ? 'bg-amber-300' : 'bg-slate-200'
                }`}
                title={`Scenario ${i + 1}`}
              />
            ))}
          </div>

          {currentQ < scenarios.length - 1 ? (
            <button
              onClick={() => setCurrentQ((p) => p + 1)}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-colors"
            >
              Next <ArrowRight className="w-4 h-4 inline ml-1" />
            </button>
          ) : (
            <button
              onClick={submitExam}
              className="px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
            >
              Submit Exam ✓
            </button>
          )}
        </div>

        {answeredCount < scenarios.length && (
          <p className="text-center text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/10 rounded-lg py-2 px-4">
            ⚠ {scenarios.length - answeredCount} unanswered — you can still submit, unanswered count as wrong
          </p>
        )}
      </div>
    );
  }

  // ── RESULTS ───────────────────────────────────────────────────────────────
  const score = getScore();
  const pct = Math.round((score / scenarios.length) * 100);
  const timeTaken = endTime - startTime;
  const passed = pct >= 70;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Score */}
      <div className={`rounded-2xl p-8 text-white ${passed ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-orange-500 to-red-500'}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {passed ? <Trophy className="w-8 h-8" /> : <Target className="w-8 h-8" />}
              <span className="text-lg font-semibold">{passed ? 'PASSED' : 'NOT YET'}</span>
            </div>
            <h1 className="text-4xl font-bold mb-1">{score}/{scenarios.length} ({pct}%)</h1>
            <p className="text-white/80">Passing score: 70% — Time: {formatTime(timeTaken)}</p>
          </div>
          <button onClick={startExam} className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
            <RotateCcw className="w-4 h-4" /> Retake
          </button>
        </div>
      </div>

      {/* Domain Scores */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
        {(Object.entries(domainMeta) as [Domain, typeof domainMeta.d1][]).map(([key, meta]) => {
          const ds = getDomainScore(key);
          if (ds.total === 0) return null;
          return (
            <button
              key={key}
              onClick={() => setFilterDomain(filterDomain === key ? 'all' : key)}
              className={`${meta.bg} border ${meta.border} rounded-xl p-3 text-center transition-all ${filterDomain === key ? 'ring-2 ring-offset-1 ring-amber-400' : ''}`}
            >
              <p className={`text-xs font-semibold ${meta.color}`}>{meta.label.split(' ')[0]}</p>
              <p className={`text-xl font-bold ${ds.pct >= 70 ? 'text-green-600' : 'text-red-600'}`}>{ds.pct}%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{ds.correct}/{ds.total}</p>
            </button>
          );
        })}
      </div>

      {/* Question Review */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Review {filteredQuestions.length} Scenarios
            {filterDomain !== 'all' && (
              <button onClick={() => setFilterDomain('all')} className="text-xs text-amber-600 font-normal hover:underline">Show all</button>
            )}
          </h2>
        </div>

        {filteredQuestions.map((q) => {
          const meta = domainMeta[q.domain];
          const userAnswer = answers[q.id];
          const isCorrect = userAnswer === q.shuffledCorrect;
          const isExpanded = expandedReview === q.id;

          return (
            <div key={q.id} className={`bg-white dark:bg-slate-900 rounded-xl border overflow-hidden ${isCorrect ? 'border-green-200' : 'border-red-200'}`}>
              <button
                onClick={() => setExpandedReview(isExpanded ? null : q.id)}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-slate-50 transition-colors"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                  {isCorrect ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-slate-400">Scenario {q.id}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${meta.bg} ${meta.color}`}>{meta.label}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${diffColors[q.difficulty]}`}>{q.difficulty}</span>
                  </div>
                  <p className="text-sm text-slate-700 line-clamp-2">{q.question}</p>
                </div>
                {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
              </button>

              {isExpanded && (
                <div className="border-t space-y-4">
                  {/* Scenario */}
                  <div className="bg-slate-50 px-5 py-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Scroll className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Scenario</span>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{q.scenario}</p>
                  </div>

                  {/* Options */}
                  <div className="px-5 space-y-2">
                    {q.shuffledOptions.map((opt, idx) => {
                      const isThisCorrect = idx === q.shuffledCorrect;
                      const isThisUser = idx === userAnswer;
                      let cls = 'border-slate-200';
                      if (isThisCorrect) cls = 'border-green-400 bg-green-50';
                      else if (isThisUser && !isCorrect) cls = 'border-red-400 bg-red-50';

                      return (
                        <div key={idx} className={`p-3 rounded-lg border-2 ${cls}`}>
                          <p className={`text-sm font-medium ${isThisCorrect ? 'text-green-800' : isThisUser ? 'text-red-800' : 'text-slate-600'}`}>
                            {opt}
                            {isThisCorrect && <span className="ml-2 text-green-600 text-xs">✓ Correct</span>}
                            {isThisUser && !isCorrect && <span className="ml-2 text-red-600 text-xs">✗ Your answer</span>}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  <div className="mx-5 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 rounded-lg p-4">
                    <p className="text-xs font-semibold text-blue-800 mb-1 flex items-center gap-1"><Lightbulb className="w-3.5 h-3.5" /> Explanation</p>
                    <p className="text-sm text-blue-900">{q.explanation}</p>
                  </div>

                  {/* Exam Trap */}
                  {!isCorrect && (
                    <div className="mx-5 bg-red-50 dark:bg-red-900/10 border border-red-200 rounded-lg p-4">
                      <p className="text-xs font-semibold text-red-800 mb-1 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Why the wrong answer is tempting</p>
                      <p className="text-sm text-red-900">{q.trap}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-4 pb-8">
        <button onClick={startExam} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
          <RotateCcw className="w-5 h-5" /> Retake Scenario Exam
        </button>
        <Link to="/" className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-center">
          Back to Course
        </Link>
      </div>
    </div>
  );
}