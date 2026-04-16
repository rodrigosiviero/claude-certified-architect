import { useState } from 'react';
import {
  ChevronDown, ChevronRight, Zap, AlertOctagon, Star,
  Target, Eye, Lightbulb, X,
} from 'lucide-react';

export interface RefSection {
  title: string;
  points: string[];
}

export interface AntiPattern {
  pattern: string;
  reason: string;
}

interface Props {
  domainLabel: string;
  examWeight: string;
  sections: RefSection[];
  antiPatterns: AntiPattern[];
  examTips: string[];
  topTested: string[];
  domainColor?: string;
}

export default function QuickRef({
  domainLabel, examWeight, sections, antiPatterns, examTips, topTested, domainColor = 'blue',
}: Props) {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const [showAntiPatterns, setShowAntiPatterns] = useState(false);

  const toggleSection = (i: number) => {
    const next = new Set(expandedSections);
    next.has(i) ? next.delete(i) : next.add(i);
    setExpandedSections(next);
  };

  const colorMap: Record<string, { gradient: string; card: string; cardBorder: string; badge: string; accent: string; icon: string; headerBg: string }> = {
    blue:    { gradient: 'from-blue-600 to-cyan-600', card: 'bg-blue-50', cardBorder: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', accent: 'text-blue-700', icon: 'text-blue-500', headerBg: 'bg-blue-500' },
    emerald: { gradient: 'from-emerald-600 to-teal-600', card: 'bg-emerald-50', cardBorder: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', accent: 'text-emerald-700', icon: 'text-emerald-500', headerBg: 'bg-emerald-500' },
    amber:   { gradient: 'from-amber-600 to-orange-600', card: 'bg-amber-50', cardBorder: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', accent: 'text-amber-700', icon: 'text-amber-500', headerBg: 'bg-amber-500' },
    violet:  { gradient: 'from-violet-600 to-purple-600', card: 'bg-violet-50', cardBorder: 'border-violet-200', badge: 'bg-violet-100 text-violet-700', accent: 'text-violet-700', icon: 'text-violet-500', headerBg: 'bg-violet-500' },
    rose:    { gradient: 'from-rose-600 to-pink-600', card: 'bg-rose-50', cardBorder: 'border-rose-200', badge: 'bg-rose-100 text-rose-700', accent: 'text-rose-700', icon: 'text-rose-500', headerBg: 'bg-rose-500' },
  };
  const c = colorMap[domainColor] || colorMap.blue;

  return (
    <div className="space-y-6">
      {/* ── Header Card ─────────────────────────────────────── */}
      <div className={`bg-gradient-to-r ${c.gradient} rounded-2xl p-6 text-white`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Zap className="w-6 h-6" />
            Quick Reference Card
          </h3>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">{examWeight}</span>
        </div>
        <p className="text-white/80 text-sm mb-4">{domainLabel} — everything you need to remember for the exam.</p>

        {/* Top Tested — quick glance */}
        <div className="bg-white/10 rounded-xl p-4">
          <p className="text-sm font-semibold text-white/90 mb-2 flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-300" />
            Most Tested on the Exam
          </p>
          <div className="flex flex-wrap gap-2">
            {topTested.map((t, i) => (
              <span key={i} className="bg-white/15 px-2.5 py-1 rounded-lg text-xs font-medium text-white">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Subdomain Reference Cards ───────────────────────── */}
      <div className="space-y-2">
        {sections.map((sec, i) => {
          const isOpen = expandedSections.has(i);
          return (
            <div key={i} className={`rounded-xl border ${isOpen ? c.cardBorder : 'border-slate-200'} overflow-hidden transition-colors`}>
              <button
                onClick={() => toggleSection(i)}
                className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${isOpen ? c.card : 'hover:bg-slate-50'}`}
              >
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${c.badge}`}>
                  {i + 1}
                </span>
                <span className="flex-1 font-semibold text-slate-900 text-sm">{sec.title}</span>
                <span className="text-xs text-slate-400 mr-1">{sec.points.length} points</span>
                {isOpen
                  ? <ChevronDown className="w-4 h-4 text-slate-400" />
                  : <ChevronRight className="w-4 h-4 text-slate-400" />
                }
              </button>
              {isOpen && (
                <div className={`px-4 pb-4 pt-1 border-t ${c.cardBorder} ${c.card}`}>
                  <ul className="space-y-2">
                    {sec.points.map((pt, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <Zap className={`w-3.5 h-3.5 mt-1 flex-shrink-0 ${c.icon}`} />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Anti-Patterns ───────────────────────────────────── */}
      <div className="rounded-xl border border-red-200 overflow-hidden">
        <button
          onClick={() => setShowAntiPatterns(!showAntiPatterns)}
          className="w-full flex items-center gap-3 p-4 text-left bg-red-50 hover:bg-red-100 transition-colors"
        >
          <AlertOctagon className="w-5 h-5 text-red-500" />
          <span className="flex-1 font-semibold text-red-800">
            Anti-Patterns to Eliminate ({antiPatterns.length})
          </span>
          {showAntiPatterns
            ? <ChevronDown className="w-4 h-4 text-red-400" />
            : <ChevronRight className="w-4 h-4 text-red-400" />
          }
        </button>
        {showAntiPatterns && (
          <div className="p-4 space-y-2 bg-red-50/50 border-t border-red-200">
            {antiPatterns.map((ap, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-lg border border-red-200 p-3">
                <div className="flex items-start gap-2">
                  <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-red-900 text-sm">{ap.pattern}</p>
                    <p className="text-red-700 text-xs mt-0.5">{ap.reason}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Exam Tips ───────────────────────────────────────── */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          Exam Tips
        </h4>
        <ul className="space-y-2">
          {examTips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-amber-900">
              <Target className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-amber-500" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Quick Scan Mode ─────────────────────────────────── */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <Eye className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          60-Second Scan — Read Before Walking In
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {sections.map((sec, i) => (
            <div key={i} className={`rounded-lg border ${c.cardBorder} ${c.card} p-3`}>
              <p className={`font-semibold text-xs ${c.accent} mb-1`}>{sec.title}</p>
              {sec.points.slice(0, 2).map((pt, j) => (
                <p key={j} className="text-xs text-slate-600 leading-relaxed">→ {pt}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
