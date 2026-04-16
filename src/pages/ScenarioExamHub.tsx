import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { scenarioExams } from '../data/scenarioExams';
import { useCourse } from '../context/CourseContext';
import {
  ArrowLeft, ArrowRight, BarChart3, Brain, CheckCircle2, ChevronDown,
  Clock, FlaskConical, Lightbulb, RotateCcw, Trophy, XCircle, Target,
  AlertTriangle, Scroll,
} from 'lucide-react';

// ── Domain meta ──────────────────────────────────────────────────────────────
const domainMeta: Record<string, { label: string; color: string; bg: string; border: string }> = {
  d1: { label: 'Agentic Architecture', color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200' },
  d2: { label: 'Tool Design & MCP', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  d3: { label: 'Claude Code Config', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
  d4: { label: 'Prompt Engineering', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  d5: { label: 'Safety & Evaluation', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
};

const examColors = [
  { bg: 'bg-blue-600', light: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', gradient: 'from-blue-500 to-cyan-500' },
  { bg: 'bg-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', gradient: 'from-emerald-500 to-teal-500' },
  { bg: 'bg-amber-600', light: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', gradient: 'from-amber-500 to-orange-500' },
  { bg: 'bg-violet-600', light: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', gradient: 'from-violet-500 to-purple-500' },
  { bg: 'bg-rose-600', light: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', gradient: 'from-rose-500 to-pink-500' },
  { bg: 'bg-cyan-600', light: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', gradient: 'from-cyan-500 to-blue-500' },
];

type Phase = 'hub' | 'exam' | 'results';

export default function ScenarioExamHub() {
  const { quizScores, setQuizScore } = useCourse();
  const [phase, setPhase] = useState<Phase>('hub');
  const [selectedExam, setSelectedExam] = useState<number | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [expandedReview, setExpandedReview] = useState<number | null>(null);
  const [filterDomain, setFilterDomain] = useState<string>('all');
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const exam = selectedExam !== null ? scenarioExams[selectedExam] : null;
  const questions = exam?.questions || [];
  const q = questions[currentQ];
  const ec = selectedExam !== null ? examColors[selectedExam] : examColors[0];

  // Save score when exam completes
  useEffect(() => {
    if (phase === 'results' && exam) {
      const s = questions.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0);
      const p = Math.round((s / questions.length) * 100);
      setQuizScore(`scenario-exam-${exam.id}`, p);
    }
  }, [phase]);

  // ── Start exam ─────────────────────────────────────────────
  const startExam = (id: number) => {
    setSelectedExam(id);
    setPhase('exam');
    setCurrentQ(0);
    setAnswers({});
    setStartTime(Date.now());
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  // ── Select answer ──────────────────────────────────────────
  const handleSelect = (index: number) => {
    if (showFeedback || !q) return;
    setSelectedAnswer(index);
    setShowFeedback(true);
    setAnswers(prev => ({ ...prev, [currentQ]: index }));
  };

  // ── Next question ──────────────────────────────────────────
  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setEndTime(Date.now());
      setPhase('results');
    }
  };

  // ── Reset ──────────────────────────────────────────────────
  const handleReset = () => {
    setPhase('exam');
    setCurrentQ(0);
    setAnswers({});
    setStartTime(Date.now());
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  // ── Score calc ─────────────────────────────────────────────
  const score = questions.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0);
  const filteredQuestions = filterDomain === 'all' ? questions : questions.filter(q => q.domain === filterDomain);

  // ── Domain breakdown ───────────────────────────────────────
  const domainBreakdown = ['d1','d2','d3','d4','d5'].map(d => {
    const qs = questions.filter(q => q.domain === d);
    const correct = qs.filter(q => answers[q.id - 1] === q.correct).length;
    return { domain: d, total: qs.length, correct };
  });

  // ══════════════════════════════════════════════════════════════
  // HUB
  // ══════════════════════════════════════════════════════════════
  if (phase === 'hub') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link to="/dashboard" className="text-slate-500 hover:text-slate-700 text-sm flex items-center gap-1 mb-4">
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl">
                <FlaskConical className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900">Scenario Exams</h1>
            </div>
            <p className="text-slate-600 text-lg">
              The real exam picks 4 of 6 scenarios at random. Practice each one with 20 scenario-specific questions.
            </p>
          </div>

          {/* Exam Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {scenarioExams.map((exam, idx) => {
              const c = examColors[idx];
              const scoreKey = `scenario-exam-${exam.id}`;
              const bestScore = quizScores[scoreKey];
              return (
                <button
                  key={exam.id}
                  onClick={() => startExam(idx)}
                  className="group text-left bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Color strip */}
                  <div className={`h-2 bg-gradient-to-r ${c.gradient}`} />

                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{exam.icon}</span>
                      <div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Scenario {exam.id} of 6
                        </div>
                        <h3 className="font-bold text-slate-900 group-hover:text-slate-800">
                          {exam.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">{exam.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Target className="w-3.5 h-3.5" />
                        {exam.questions.length} questions
                      </div>
                      {bestScore !== undefined && (
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          bestScore >= 80 ? 'bg-emerald-100 text-emerald-700' :
                          bestScore >= 60 ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          Best: {bestScore}%
                        </span>
                      )}
                    </div>

                    {/* Domain dots */}
                    <div className="flex gap-1.5 mt-3">
                      {['d1','d2','d3','d4','d5'].map(d => (
                        <span key={d} className={`w-2 h-2 rounded-full ${
                          d === 'd1' ? 'bg-violet-400' :
                          d === 'd2' ? 'bg-emerald-400' :
                          d === 'd3' ? 'bg-blue-400' :
                          d === 'd4' ? 'bg-amber-400' : 'bg-red-400'
                        }`} title={domainMeta[d].label} />
                      ))}
                      <span className="text-[10px] text-slate-400 ml-1">All 5 domains</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Exam tip */}
          <div className="mt-8 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-violet-600 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-violet-900 mb-1">Exam Tip</h3>
                <p className="text-sm text-violet-700">
                  The real exam randomly selects <strong>4 of 6</strong> scenarios. Each scenario frames questions
                  from all 5 exam domains. Practice all 6 to be fully prepared — you won't know which 4 you'll get!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // EXAM
  // ══════════════════════════════════════════════════════════════
  if (phase === 'exam' && q) {
    const isCorrect = selectedAnswer === q.correct;
    const dm = domainMeta[q.domain];
    const progress = ((currentQ + (showFeedback ? 1 : 0)) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setPhase('hub')} className="text-slate-500 hover:text-slate-700 flex items-center gap-1 text-sm">
              <ArrowLeft className="w-4 h-4" /> All Scenarios
            </button>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{exam?.icon}</span>
              <span className="font-semibold text-slate-700">{exam?.title}</span>
            </div>
            <div className="text-sm text-slate-500">
              {currentQ + 1}/{questions.length}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-slate-200 rounded-full mb-6 overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${ec.gradient} rounded-full transition-all duration-500`} style={{ width: `${progress}%` }} />
          </div>

          {/* Domain badge */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${dm.bg} ${dm.color} ${dm.border} border mb-4`}>
            {q.domainLabel}
          </div>

          {/* Scenario */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5 shadow-sm">
            <div className="flex items-start gap-2 mb-2">
              <Scroll className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Scenario</span>
            </div>
            <p className="text-slate-700 text-sm leading-relaxed">{q.scenario}</p>
          </div>

          {/* Question */}
          <h2 className="text-lg font-bold text-slate-900 mb-5">{q.question}</h2>

          {/* Options */}
          <div className="space-y-3 mb-5">
            {q.options.map((opt, i) => {
              const isSelected = selectedAnswer === i;
              const isCorrectOption = i === q.correct;
              let optClasses = 'bg-white border-slate-200 hover:border-slate-400';
              if (showFeedback) {
                if (isCorrectOption) optClasses = 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200';
                else if (isSelected && !isCorrectOption) optClasses = 'bg-red-50 border-red-400 ring-2 ring-red-200';
                else optClasses = 'bg-slate-50 border-slate-200 opacity-60';
              } else if (isSelected) {
                optClasses = `${ec.light} ${ec.border} ring-2`;
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={showFeedback}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${optClasses} ${showFeedback ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      showFeedback && isCorrectOption ? 'bg-emerald-500 text-white' :
                      showFeedback && isSelected && !isCorrectOption ? 'bg-red-500 text-white' :
                      isSelected ? `${ec.bg} text-white` : 'bg-slate-100 text-slate-600'
                    }`}>
                      {showFeedback && isCorrectOption ? '✓' :
                       showFeedback && isSelected && !isCorrectOption ? '✗' :
                       String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-sm text-slate-700">{opt.replace(/^[A-D]\)\s*/, '')}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className={`rounded-xl border-2 p-5 mb-5 ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className={`font-semibold ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{q.explanation}</p>
            </div>
          )}

          {/* Navigation */}
          {showFeedback && (
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${ec.gradient} text-white font-semibold rounded-xl hover:opacity-90 transition shadow-lg`}
              >
                {currentQ < questions.length - 1 ? (
                  <>Next <ArrowRight className="w-4 h-4" /></>
                ) : (
                  <>See Results <Trophy className="w-4 h-4" /></>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // RESULTS
  // ══════════════════════════════════════════════════════════════
  const pct = Math.round((score / questions.length) * 100);
  const elapsed = Math.round((endTime - startTime) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Score header */}
        <div className="text-center mb-8">
          <span className="text-4xl mb-3 block">{exam?.icon}</span>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">{exam?.title} — Results</h1>
          <div className={`inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-r ${ec.gradient} text-white my-4`}>
            <div>
              <div className="text-3xl font-bold">{pct}%</div>
              <div className="text-xs opacity-80">{score}/{questions.length}</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{minutes}m {seconds}s</span>
            <span className="flex items-center gap-1"><BarChart3 className="w-4 h-4" />{pct >= 80 ? 'Pass' : 'Review needed'}</span>
          </div>
        </div>

        {/* Domain breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
          <h3 className="font-bold text-slate-900 mb-4">Domain Breakdown</h3>
          <div className="space-y-3">
            {domainBreakdown.map(({ domain, total, correct }) => {
              const dm = domainMeta[domain];
              const dpct = total > 0 ? Math.round((correct / total) * 100) : 0;
              return (
                <div key={domain}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-semibold ${dm.color}`}>{dm.label}</span>
                    <span className="text-xs text-slate-500">{correct}/{total} ({dpct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${dpct >= 80 ? 'bg-emerald-500' : dpct >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${dpct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Review questions */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">Review Answers</h3>
            <select
              value={filterDomain}
              onChange={e => setFilterDomain(e.target.value)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white"
            >
              <option value="all">All Domains</option>
              {Object.entries(domainMeta).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            {filteredQuestions.map((q, idx) => {
              const userAnswer = answers[q.id - 1];
              const correct = userAnswer === q.correct;
              const expanded = expandedReview === q.id;

              return (
                <div key={q.id} className={`rounded-lg border ${correct ? 'border-emerald-200 bg-emerald-50/50' : 'border-red-200 bg-red-50/50'}`}>
                  <button
                    onClick={() => setExpandedReview(expanded ? null : q.id)}
                    className="w-full flex items-center gap-3 p-3 text-left"
                  >
                    {correct ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                    )}
                    <span className="text-sm text-slate-700 flex-1">{q.question}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition ${expanded ? 'rotate-180' : ''}`} />
                  </button>
                  {expanded && (
                    <div className="px-3 pb-3 border-t border-slate-200 pt-3">
                      <p className="text-sm text-slate-600 mb-2"><strong>Scenario:</strong> {q.scenario}</p>
                      <p className="text-sm text-slate-600 mb-2"><strong>Your answer:</strong> {userAnswer !== undefined ? q.options[userAnswer] : 'Not answered'}</p>
                      <p className="text-sm text-emerald-700 mb-2"><strong>Correct:</strong> {q.options[q.correct]}</p>
                      <p className="text-sm text-slate-600">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition"
          >
            <RotateCcw className="w-4 h-4" /> Retry
          </button>
          <button
            onClick={() => setPhase('hub')}
            className={`flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r ${ec.gradient} text-white rounded-xl hover:opacity-90 transition shadow-lg`}
          >
            All Scenarios
          </button>
        </div>
      </div>
    </div>
  );
}
