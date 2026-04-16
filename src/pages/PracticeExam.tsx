import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BarChart3, BookOpen, Brain, CheckCircle2, ChevronDown, ChevronRight, Clock, GraduationCap, Lightbulb, RotateCcw, Target, Trophy, XCircle } from 'lucide-react';
import { questions } from '../data/practiceExam';
import type { Question } from '../data/practiceExam';

type Domain = 'd1' | 'd2' | 'd3' | 'd4' | 'd5';

const domainMeta: Record<Domain, { label: string; color: string; bg: string; border: string; count: number }> = {
  d1: { label: 'Agentic Architecture', color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200', count: 16 },
  d2: { label: 'Tool Design & MCP', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', count: 11 },
  d3: { label: 'Claude Code Config', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', count: 12 },
  d4: { label: 'Prompt Engineering', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', count: 11 },
  d5: { label: 'Safety & Evaluation', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', count: 10 },
};

type Phase = 'start' | 'exam' | 'results';

export default function PracticeExam() {
  const [phase, setPhase] = useState<Phase>('start');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [expandedReview, setExpandedReview] = useState<number | null>(null);
  const [filterDomain, setFilterDomain] = useState<Domain | 'all'>('all');
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  const getScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct) correct++;
    });
    return correct;
  };

  const getDomainScore = (domain: Domain) => {
    const domainQs = questions.filter((q) => q.domain === domain);
    let correct = 0;
    domainQs.forEach((q) => {
      if (answers[q.id] === q.correct) correct++;
    });
    return { correct, total: domainQs.length, pct: Math.round((correct / domainQs.length) * 100) };
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

  const filteredQuestions = filterDomain === 'all'
    ? questions
    : questions.filter((q) => q.domain === filterDomain);

  // ── START SCREEN ──────────────────────────────────────────────────────────
  if (phase === 'start') {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="w-8 h-8" />
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">Full Practice Exam</span>
          </div>
          <h1 className="text-3xl font-bold mb-3">Claude Certified Architect — Practice Exam</h1>
          <p className="text-violet-100">60 questions covering all 5 domains. Answer all questions, then review each one with detailed explanations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {(Object.entries(domainMeta) as [Domain, typeof domainMeta.d1][]).map(([key, meta]) => (
            <div key={key} className={`${meta.bg} border ${meta.border} rounded-xl p-3 text-center`}>
              <p className={`text-xs font-semibold ${meta.color}`}>{meta.label}</p>
              <p className={`text-2xl font-bold ${meta.color}`}>{meta.count}Q</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {key === 'd1' ? '27%' : key === 'd2' ? '18%' : key === 'd3' ? '20%' : key === 'd4' ? '18%' : '17%'}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2"><BookOpen className="w-5 h-5" /> Exam Format</h3>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2"><span className="text-violet-600 font-bold">1.</span> Answer all 60 questions — select one option per question</li>
            <li className="flex items-start gap-2"><span className="text-violet-600 font-bold">2.</span> Submit when you're done (or when all questions are answered)</li>
            <li className="flex items-start gap-2"><span className="text-violet-600 font-bold">3.</span> Review your score by domain and see detailed explanations</li>
            <li className="flex items-start gap-2"><span className="text-violet-600 font-bold">4.</span> Expand any question to see why the correct answer is right</li>
          </ul>
        </div>

        <button
          onClick={startExam}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold text-lg py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Brain className="w-5 h-5" />
          Start Exam — 60 Questions
        </button>
      </div>
    );
  }

  // ── EXAM SCREEN ───────────────────────────────────────────────────────────
  if (phase === 'exam') {
    const q = questions[currentQ];
    const meta = domainMeta[q.domain];
    const elapsed = Date.now() - startTime;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className={`text-xs font-semibold px-2 py-1 rounded ${meta.bg} ${meta.color} ${meta.border} border`}>
                {meta.label}
              </span>
              <span className="text-xs text-slate-400">{q.domainLabel}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {formatTime(elapsed)}</span>
              <span>{answeredCount}/{questions.length} answered</span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div
              className="bg-violet-500 h-2 rounded-full transition-all"
              style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border p-6 space-y-5">
          <div className="flex items-start gap-3">
            <span className="bg-slate-100 text-slate-600 text-sm font-bold px-2.5 py-1 rounded-lg flex-shrink-0">
              {currentQ + 1}/{questions.length}
            </span>
            <div>
              <p className="font-semibold text-slate-900 text-lg">{q.question}</p>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => selectAnswer(q.id, idx)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  answers[q.id] === idx
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className={`font-medium ${answers[q.id] === idx ? 'text-violet-700' : 'text-slate-700'}`}>
                  {opt}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setCurrentQ((p) => Math.max(0, p - 1))}
            disabled={currentQ === 0}
            className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4 inline mr-1" /> Prev
          </button>

          {/* Compact question navigator */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-center gap-1 overflow-x-auto py-1 scrollbar-hide">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQ(i)}
                  className={`w-2 h-2 rounded-full transition-all shrink-0 ${
                    i === currentQ
                      ? 'bg-violet-600 scale-150 ring-2 ring-violet-300'
                      : answers[questions[i].id] !== undefined
                      ? 'bg-violet-300'
                      : 'bg-slate-200'
                  }`}
                  title={`Q${i + 1}`}
                />
              ))}
            </div>
            <div className="text-center text-xs text-slate-400 mt-0.5">
              {currentQ + 1} of {questions.length} · {answeredCount} answered
            </div>
          </div>

          {currentQ < questions.length - 1 ? (
            <button
              onClick={() => setCurrentQ((p) => p + 1)}
              className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold transition-colors shrink-0"
            >
              Next <ArrowRight className="w-4 h-4 inline ml-1" />
            </button>
          ) : (
            <button
              onClick={submitExam}
              className="px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors shrink-0"
            >
              Submit ✓
            </button>
          )}
        </div>

        {!allAnswered && (
          <p className="text-center text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/10 rounded-lg py-2 px-4">
            ⚠ {questions.length - answeredCount} unanswered question{questions.length - answeredCount !== 1 ? 's' : ''} — you can still submit, but unanswered questions count as wrong
          </p>
        )}
      </div>
    );
  }

  // ── RESULTS SCREEN ────────────────────────────────────────────────────────
  const score = getScore();
  const pct = Math.round((score / questions.length) * 100);
  const timeTaken = endTime - startTime;
  const passed = pct >= 70;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Score Header */}
      <div className={`rounded-2xl p-8 text-white ${passed ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-orange-500 to-red-500'}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {passed ? <Trophy className="w-8 h-8" /> : <Target className="w-8 h-8" />}
              <span className="text-lg font-semibold">{passed ? 'PASSED' : 'NOT YET'}</span>
            </div>
            <h1 className="text-4xl font-bold mb-1">{score}/{questions.length} ({pct}%)</h1>
            <p className="text-white/80">Passing score: 70% — Time: {formatTime(timeTaken)}</p>
          </div>
          <button
            onClick={startExam}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Retake
          </button>
        </div>
      </div>

      {/* Domain Scores */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {(Object.entries(domainMeta) as [Domain, typeof domainMeta.d1][]).map(([key, meta]) => {
          const ds = getDomainScore(key);
          return (
            <button
              key={key}
              onClick={() => setFilterDomain(filterDomain === key ? 'all' : key)}
              className={`${meta.bg} border ${meta.border} rounded-xl p-3 text-center transition-all ${
                filterDomain === key ? 'ring-2 ring-offset-1 ring-violet-400' : ''
              }`}
            >
              <p className={`text-xs font-semibold ${meta.color}`}>{meta.label}</p>
              <p className={`text-xl font-bold ${ds.pct >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                {ds.pct}%
              </p>
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
            Review {filteredQuestions.length} Questions
            {filterDomain !== 'all' && (
              <button onClick={() => setFilterDomain('all')} className="text-xs text-violet-600 font-normal hover:underline">
                Show all
              </button>
            )}
          </h2>
        </div>

        {filteredQuestions.map((q) => {
          const meta = domainMeta[q.domain];
          const userAnswer = answers[q.id];
          const isCorrect = userAnswer === q.correct;
          const isExpanded = expandedReview === q.id;

          return (
            <div key={q.id} className={`bg-white dark:bg-slate-900 rounded-xl border overflow-hidden ${isCorrect ? 'border-green-200' : 'border-red-200'}`}>
              <button
                onClick={() => setExpandedReview(isExpanded ? null : q.id)}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-slate-50 transition-colors"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-slate-400">Q{q.id}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${meta.bg} ${meta.color}`}>{meta.label}</span>
                  </div>
                  <p className="text-sm text-slate-700 line-clamp-2">{q.question}</p>
                </div>
                {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
              </button>

              {isExpanded && (
                <div className="border-t p-5 space-y-4">
                  {/* Full question */}
                  <p className="font-medium text-slate-900 dark:text-white">{q.question}</p>

                  {/* Options with correct/wrong marking */}
                  <div className="space-y-2">
                    {q.options.map((opt, idx) => {
                      const isThisCorrect = idx === q.correct;
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
                  <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 rounded-lg p-4">
                    <p className="text-xs font-semibold text-blue-800 mb-1 flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5" /> Explanation
                    </p>
                    <p className="text-sm text-blue-900">{q.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-4 pb-8">
        <button
          onClick={startExam}
          className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" /> Retake Exam
        </button>
        <Link
          to="/"
          className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-center"
        >
          Back to Course
        </Link>
      </div>
    </div>
  );
}