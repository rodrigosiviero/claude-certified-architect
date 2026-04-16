import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle2, ChevronRight, Code, FlaskConical, Terminal } from 'lucide-react';
import labs from '../data/labs';

export default function Labs() {
  const [expandedLab, setExpandedLab] = useState<string | null>(null);
  const [completedLabs, setCompletedLabs] = useState<Set<string>>(new Set());

  const toggleLab = (id: string) => {
    setExpandedLab(expandedLab === id ? null : id);
  };

  const markComplete = (id: string) => {
    const newCompleted = new Set(completedLabs);
    newCompleted.add(id);
    setCompletedLabs(newCompleted);
  };

  const domainColors: Record<string, string> = {
    'Domain 1': 'from-blue-500 to-cyan-500',
    'Domain 2': 'from-emerald-500 to-teal-500',
    'Domain 3': 'from-amber-500 to-orange-500',
    'Domain 4': 'from-violet-500 to-purple-500',
    'Domain 5': 'from-rose-500 to-pink-500',
  };

  const getDomainColor = (domain: string) => {
    const key = Object.keys(domainColors).find(k => domain.startsWith(k));
    return domainColors[key || 'Domain 1'];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start gap-6">
        <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
          <FlaskConical className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Hands-on Labs</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Apply your knowledge with practical Python exercises. Each lab covers specific exam topics with step-by-step guidance and runnable starter code.
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-900 dark:text-white">Lab Progress</h2>
          <span className="text-lg font-bold text-violet-600">
            {completedLabs.size} / {labs.length} Complete
          </span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-500"
            style={{ width: `${(completedLabs.size / labs.length) * 100}%` }}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {['Domain 1', 'Domain 2', 'Domain 3', 'Domain 4', 'Domain 5'].map(d => {
            const domainLabs = labs.filter(l => l.domain.startsWith(d));
            const done = domainLabs.filter(l => completedLabs.has(l.id)).length;
            return (
              <span key={d} className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded">
                {d}: {done}/{domainLabs.length}
              </span>
            );
          })}
        </div>
      </div>

      {/* Labs List */}
      <div className="space-y-4">
        {labs.map((lab) => {
          const isExpanded = expandedLab === lab.id;
          const isCompleted = completedLabs.has(lab.id);
          const gradient = getDomainColor(lab.domain);

          return (
            <div
              key={lab.id}
              className={`bg-white dark:bg-slate-900 rounded-xl border transition-all ${
                isCompleted
                  ? 'border-green-200 bg-green-50/30'
                  : isExpanded
                  ? 'border-violet-300 shadow-lg'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <button
                onClick={() => toggleLab(lab.id)}
                className="w-full p-6 text-left flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isCompleted ? 'bg-green-500' : `bg-gradient-to-br ${gradient}`
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : (
                    <FlaskConical className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{lab.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      lab.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                      lab.difficulty === 'Intermediate' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {lab.difficulty}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 dark:text-slate-400">
                      Python
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {lab.domain}
                    </span>
                    <span className="flex items-center gap-1">
                      <Terminal className="w-4 h-4" />
                      {lab.duration}
                    </span>
                    {lab.examTopics && (
                      <span className="text-xs text-violet-600 bg-violet-50 px-2 py-0.5 rounded">
                        {lab.examTopics.join(', ')}
                      </span>
                    )}
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronRight className="w-5 h-5 text-slate-400 rotate-90" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {isExpanded && (
                <div className="px-6 pb-6 border-t border-slate-100 pt-6 space-y-6">
                  <p className="text-slate-600 dark:text-slate-400">{lab.description}</p>

                  {lab.examTopics && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2 text-sm">Exam Topics Covered</h4>
                      <div className="flex flex-wrap gap-2">
                        {lab.examTopics.map(topic => (
                          <span key={topic} className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Learning Objectives
                    </h4>
                    <ul className="space-y-2">
                      {lab.objectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-violet-500" />
                      Prerequisites
                    </h4>
                    <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
                      {lab.setup}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <Code className="w-4 h-4 text-amber-500" />
                      Starter Code
                    </h4>
                    <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 text-sm overflow-x-auto max-h-[600px] overflow-y-auto">
                      <code>{lab.codeTemplate}</code>
                    </pre>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button
                      onClick={() => markComplete(lab.id)}
                      className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                        isCompleted
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-violet-500 text-white hover:bg-violet-600'
                      }`}
                    >
                      {isCompleted ? '✓ Lab Completed' : 'Mark as Complete'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-8 border-t border-slate-200 dark:border-slate-800">
        <Link to="/domain/5" className="text-slate-600 hover:text-slate-900 font-medium">
          ← Previous: Context Management
        </Link>
        <Link
          to="/practice-exam"
          className="inline-flex items-center gap-2 px-6 py-3 bg-violet-500 hover:bg-violet-600 text-white font-semibold rounded-xl transition-colors"
        >
          Continue to Practice Exam
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}