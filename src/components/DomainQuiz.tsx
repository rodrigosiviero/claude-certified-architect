import { useState, useEffect } from 'react';
import { useCourse } from '../context/CourseContext';
import {
  CheckCircle2, XCircle, ChevronRight, Trophy, RotateCcw,
  Lightbulb, Target, Brain, AlertTriangle, Sparkles,
} from 'lucide-react';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  trap?: string;
}

interface Props {
  questions: QuizQuestion[];
  title?: string;
  domainColor?: string;
  domainId?: string;
}

export default function DomainQuiz({ questions, title = 'Exam Practice Quiz', domainColor = 'blue', domainId }: Props) {
  const { setQuizScore } = useCourse();
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<(boolean | null)[]>(new Array(questions.length).fill(null));

  const q = questions[currentQ];
  const isCorrect = selectedAnswer === q.correctIndex;

  const colorMap: Record<string, { bg: string; border: string; text: string; badge: string; gradient: string }> = {
    blue:    { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700', gradient: 'from-blue-500 to-cyan-500' },
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700', gradient: 'from-emerald-500 to-teal-500' },
    amber:   { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700', gradient: 'from-amber-500 to-orange-500' },
    violet:  { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', badge: 'bg-violet-100 text-violet-700', gradient: 'from-violet-500 to-purple-500' },
    rose:    { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', badge: 'bg-rose-100 text-rose-700', gradient: 'from-rose-500 to-pink-500' },
  };
  const c = colorMap[domainColor] || colorMap.blue;

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelectedAnswer(index);
    setAnswered(true);
    const correct = index === q.correctIndex;
    if (correct) setScore(s => s + 1);
    const newAnswers = [...answers];
    newAnswers[currentQ] = correct;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      setFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentQ(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
    setAnswers(new Array(questions.length).fill(null));
  };

  // Save score to context when quiz finishes
  useEffect(() => {
    if (finished && domainId) {
      const pct = Math.round((score / questions.length) * 100);
      setQuizScore(domainId, pct);
    }
  }, [finished]);

  // ── Final Results Screen ─────────────────────────────────────
  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    const emoji = pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '📚';
    const msg = pct >= 80 ? 'Excellent! You\'re well prepared!' : pct >= 60 ? 'Good effort! Review the ones you missed.' : 'Keep studying! Review the explanations above.';

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white text-center">
          <div className="text-5xl mb-4">{emoji}</div>
          <Trophy className="w-12 h-12 mx-auto mb-3 text-amber-400" />
          <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
          <div className="text-4xl font-bold mb-2">
            {score}/{questions.length}
            <span className="text-lg ml-2 text-slate-300">({pct}%)</span>
          </div>
          <p className="text-slate-300">{msg}</p>
        </div>

        {/* Answer Review */}
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-900 dark:text-white">Review Your Answers</h4>
          {questions.map((q, i) => {
            const wasCorrect = answers[i];
            return (
              <div key={i} className={`rounded-xl border p-4 ${wasCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-start gap-3">
                  {wasCorrect
                    ? <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    : <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  }
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-slate-900 dark:text-white">{q.question}</p>
                    <p className={`text-sm mt-1 ${wasCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      {wasCorrect ? '✓ Correct' : `✗ Correct answer: ${q.options[q.correctIndex]}`}
                    </p>
                    {!wasCorrect && (
                      <p className="text-sm text-slate-600 mt-1">{q.explanation}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  // ── Question Screen ──────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Progress bar */}
      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <span className={`px-2.5 py-1 rounded-full font-medium ${c.badge}`}>
          Question {currentQ + 1} of {questions.length}
        </span>
        <span className="flex items-center gap-1.5">
          <Target className="w-4 h-4" />
          Score: {score}/{currentQ + (answered ? 1 : 0)}
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2">
        <div
          className={`bg-gradient-to-r ${c.gradient} h-2 rounded-full transition-all`}
          style={{ width: `${((currentQ + (answered ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className={`rounded-xl border ${c.border} ${c.bg} p-5`}>
        <div className="flex items-start gap-3">
          <Brain className={`w-5 h-5 ${c.text} mt-0.5 flex-shrink-0`} />
          <p className="font-semibold text-slate-900 dark:text-white">{q.question}</p>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {q.options.map((opt, i) => {
          const letter = String.fromCharCode(65 + i);
          let optClass = 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 cursor-pointer';
          let letterBg = 'bg-slate-100 text-slate-600';

          if (answered) {
            if (i === q.correctIndex) {
              optClass = 'border-green-300 bg-green-50';
              letterBg = 'bg-green-500 text-white';
            } else if (i === selectedAnswer && !isCorrect) {
              optClass = 'border-red-300 bg-red-50';
              letterBg = 'bg-red-500 text-white';
            } else {
              optClass = 'border-slate-100 bg-slate-50 opacity-50';
            }
          } else if (i === selectedAnswer) {
            optClass = `border-slate-400 bg-slate-100`;
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={`w-full text-left rounded-xl border p-4 transition-all flex items-center gap-3 ${optClass}`}
            >
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${letterBg}`}>
                {letter}
              </span>
              <span className="text-sm text-slate-700 dark:text-slate-300">{opt}</span>
              {answered && i === q.correctIndex && (
                <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto flex-shrink-0" />
              )}
              {answered && i === selectedAnswer && !isCorrect && i !== q.correctIndex && (
                <XCircle className="w-5 h-5 text-red-500 ml-auto flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {answered && (
        <div className={`rounded-xl border p-5 ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
          <div className="flex items-start gap-3 mb-3">
            {isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <p className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-amber-800'}`}>
                {isCorrect ? '✓ Correct!' : '✗ Not quite — see why below'}
              </p>
            </div>
          </div>

          {/* Explanation */}
          <div className="ml-8 space-y-3">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-slate-700 dark:text-slate-300">{q.explanation}</p>
            </div>

            {q.trap && (
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">
                  <span className="font-semibold">Why the wrong answers are tempting:</span> {q.trap}
                </p>
              </div>
            )}

            {!isCorrect && (
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-green-700">
                  <span className="font-semibold">Correct answer: </span>
                  {q.options[q.correctIndex]}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Next button */}
      {answered && (
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className={`flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r ${c.gradient} text-white font-semibold rounded-xl hover:opacity-90 transition-opacity`}
          >
            {currentQ < questions.length - 1 ? 'Next Question' : 'See Results'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
