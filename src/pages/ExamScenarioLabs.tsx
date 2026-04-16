import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FlaskConical, ChevronRight, ChevronDown, CheckCircle2, Code, Zap, Bug, Lightbulb, Eye } from 'lucide-react';
import examScenarioLabs from '../data/examScenarioLabs';
import type { ScenarioLab } from '../data/examScenarioLabs';

const scenarioLabs = examScenarioLabs;

export default function ExamScenarioLabs() {
  const [expandedLab, setExpandedLab] = useState<string | null>(null);
  const [completedLabs, setCompletedLabs] = useState<Set<string>>(new Set());
  const [labPhase, setLabPhase] = useState<Record<string, 'analyze' | 'hints' | 'solution'>>({});

  const toggleLab = (id: string) => {
    if (expandedLab === id) {
      setExpandedLab(null);
    } else {
      setExpandedLab(id);
      if (!labPhase[id]) {
        setLabPhase(prev => ({ ...prev, [id]: 'analyze' }));
      }
    }
  };

  const markComplete = (id: string) => {
    const newCompleted = new Set(completedLabs);
    newCompleted.add(id);
    setCompletedLabs(newCompleted);
  };

  const domainColors: Record<number, string> = {
    1: 'from-blue-500 to-cyan-500',
    2: 'from-emerald-500 to-teal-500',
    3: 'from-amber-500 to-orange-500',
    4: 'from-violet-500 to-purple-500',
    5: 'from-rose-500 to-pink-500',
  };

  const domainBorders: Record<number, string> = {
    1: 'border-blue-200',
    2: 'border-emerald-200',
    3: 'border-amber-200',
    4: 'border-violet-200',
    5: 'border-rose-200',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start gap-6">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center flex-shrink-0">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Exam Scenario Labs</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            25 labs based on exam scenarios. Each shows <strong>broken code</strong> — find the bugs, then reveal the fix. Broken code first, hints second, solution last.
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-900 dark:text-white">Scenario Lab Progress</h2>
          <span className="text-lg font-bold text-orange-600">
            {completedLabs.size} / {scenarioLabs.length} Complete
          </span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
            style={{ width: `${(completedLabs.size / scenarioLabs.length) * 100}%` }}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map(d => {
            const domainLabs = scenarioLabs.filter(l => l.domainNum === d);
            const done = domainLabs.filter(l => completedLabs.has(l.id)).length;
            return (
              <span key={d} className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded">
                Domain {d}: {done}/{domainLabs.length}
              </span>
            );
          })}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-5">
        <h3 className="font-semibold text-orange-900 mb-3">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
            <div>
              <p className="font-medium text-red-900 text-sm">Analyze the Bug</p>
              <p className="text-xs text-red-700">Read the broken code and find what is wrong.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
            <div>
              <p className="font-medium text-amber-900 text-sm">Check Hints</p>
              <p className="text-xs text-amber-700">Stuck? Get guided hints before seeing the answer.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
            <div>
              <p className="font-medium text-green-900 text-sm">See the Fix</p>
              <p className="text-xs text-green-700">Reveal the corrected code with full logging output.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Labs List */}
      <div className="space-y-4">
        {scenarioLabs.map((lab) => {
          const isExpanded = expandedLab === lab.id;
          const isCompleted = completedLabs.has(lab.id);
          const color = domainColors[lab.domainNum];
          const border = domainBorders[lab.domainNum];
          const phase = labPhase[lab.id] || 'analyze';

          return (
            <div key={lab.id} className={`bg-white dark:bg-slate-900 rounded-xl border ${isExpanded ? border : 'border-slate-200'} overflow-hidden transition-colors shadow-sm hover:shadow-md`}>
              {/* Header */}
              <button
                onClick={() => toggleLab(lab.id)}
                className="w-full p-6 text-left flex items-start gap-4"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-bold text-sm">{lab.domainNum}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{lab.examTopic}</span>
                    <span className="text-xs text-slate-400">{lab.difficulty}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{lab.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{lab.scenario}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                  {isExpanded ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-6 pb-6 space-y-4 border-t border-slate-100 pt-4">
                  {/* Scenario */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-orange-500" />
                      Exam Scenario
                    </h4>
                    <p className="text-sm text-orange-800">{lab.scenario}</p>
                  </div>

                  {/* Phase 1: Broken Code (always visible) */}
                  <div>
                    <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                      <Bug className="w-4 h-4 text-red-500" />
                      Broken Code — Find the Bugs!
                    </h4>
                    <pre className="bg-red-950 text-red-100 rounded-lg p-4 text-xs overflow-x-auto max-h-[350px] leading-relaxed border-2 border-red-300">
                      <code>{lab.brokenCode}</code>
                    </pre>
                  </div>

                  {/* Phase buttons */}
                  <div className="flex gap-3">
                    {phase === 'analyze' && (
                      <>
                        <button
                          onClick={() => setLabPhase(prev => ({ ...prev, [lab.id]: 'hints' }))}
                          className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors"
                        >
                          <Lightbulb className="w-4 h-4" />
                          Show Hints
                        </button>
                        <button
                          onClick={() => setLabPhase(prev => ({ ...prev, [lab.id]: 'solution' }))}
                          className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Skip to Solution
                        </button>
                      </>
                    )}
                    {phase === 'hints' && (
                      <button
                        onClick={() => setLabPhase(prev => ({ ...prev, [lab.id]: 'solution' }))}
                        className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Show Solution
                      </button>
                    )}
                  </div>

                  {/* Phase 2: Hints */}
                  {(phase === 'hints' || phase === 'solution') && (
                    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 rounded-lg p-4">
                      <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        Hints
                      </h4>
                      <ul className="space-y-2">
                        {lab.hints.map((hint, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                            <span className="w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center text-xs font-bold text-amber-700 flex-shrink-0 mt-0.5">{i + 1}</span>
                            {hint}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Phase 3: Solution */}
                  {phase === 'solution' && (
                    <>
                      {/* What was wrong */}
                      <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
                        <h4 className="font-semibold text-rose-900 mb-3">What Was Wrong</h4>
                        <ul className="space-y-2">
                          {lab.fixes.map((fix, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-rose-800">
                              <span className="text-rose-500 flex-shrink-0 mt-0.5">{'\u274c'}</span>
                              {fix}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Fixed Code */}
                      <div>
                        <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          Fixed Code (with detailed logging)
                        </h4>
                        <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 text-xs overflow-x-auto max-h-[500px] leading-relaxed border-2 border-green-500">
                          <code>{lab.codeTemplate}</code>
                        </pre>
                      </div>

                      {/* Expected Output */}
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                        <h4 className="font-semibold text-emerald-900 mb-2">Expected Output</h4>
                        <pre className="text-xs text-emerald-800 whitespace-pre-wrap">{lab.expectedOutput}</pre>
                      </div>
                    </>
                  )}

                  {/* Mark Complete */}
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => markComplete(lab.id)}
                      className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                        isCompleted
                          ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          : 'bg-orange-500 text-white hover:bg-orange-600'
                      }`}
                    >
                      {isCompleted ? '\u2713 Completed' : 'Mark Complete'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}