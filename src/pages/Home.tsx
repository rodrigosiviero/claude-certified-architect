import { Link } from 'react-router-dom';
import { ArrowRight, Award, BookOpen, Briefcase, CheckCircle2, Play, Target, Users, Zap, LayoutDashboard, Brain, Flame } from 'lucide-react';
import { useCourse } from '../context/CourseContext';

const features = [
  { icon: BookOpen, title: 'Comprehensive Coverage', description: '100% of exam objectives covered across 5 domains with hands-on exercises' },
  { icon: Target, title: 'Scenario-Based Learning', description: 'Master the 6 exam scenarios through real-world projects and case studies' },
  { icon: Brain, title: 'Spaced Repetition', description: '50+ flashcards with SM-2 algorithm to retain knowledge long-term' },
  { icon: Award, title: 'Certification Ready', description: 'Built from official exam guide, ensuring you are fully prepared for the test' },
];

const domainPreview = [
  { number: 1, title: 'Agentic Architecture', weight: '27%', color: 'bg-blue-500' },
  { number: 2, title: 'Tool Design & MCP', weight: '18%', color: 'bg-purple-500' },
  { number: 3, title: 'Claude Code Config', weight: '20%', color: 'bg-green-500' },
  { number: 4, title: 'Prompt Engineering', weight: '20%', color: 'bg-orange-500' },
  { number: 5, title: 'Context & Reliability', weight: '15%', color: 'bg-red-500' },
];

export default function Home() {
  const { overallProgress, currentStreak } = useCourse();

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm mb-6">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Official Exam Guide Curriculum</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">
            Claude Certified Architect
            <span className="block text-amber-400">Foundations</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mb-8">
            Master the art of building production-grade applications with Claude. From beginner concepts
            to advanced architectures, this comprehensive course covers 100% of certification objectives.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-xl transition-colors"
            >
              <LayoutDashboard className="w-5 h-5" />
              Study Dashboard
            </Link>
            <Link
              to="/overview"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors"
            >
              <Play className="w-5 h-5" />
              Start Learning
            </Link>
            <Link
              to="/flashcards"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors"
            >
              <Brain className="w-5 h-5" />
              Flashcards
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-t from-amber-500/20 to-transparent rounded-full blur-3xl" />
      </section>

      {/* Progress + Streak */}
      {overallProgress > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Your Progress</h2>
              <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{overallProgress}%</span>
            </div>
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-700" style={{ width: `${overallProgress}%` }} />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {overallProgress < 100 ? 'Continue where you left off or start a new domain' : '🎉 Congratulations! All domains completed'}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center justify-center transition-colors">
            <Flame className={`w-8 h-8 mb-2 ${currentStreak > 0 ? 'text-orange-500' : 'text-slate-300 dark:text-slate-600'}`} />
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{currentStreak}</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">day streak</span>
          </div>
        </section>
      )}

      {/* Features */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">What You Will Learn</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Exam Domains */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Exam Domains</h2>
          <Link to="/overview" className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:text-amber-700 font-medium">
            View All Details <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
          {domainPreview.map((domain) => (
            <Link to={`/domain/${domain.number}`} key={domain.number} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 text-center hover:shadow-md transition-all">
              <div className={`w-10 h-10 ${domain.color} rounded-lg mx-auto mb-3 flex items-center justify-center`}>
                <span className="text-white font-bold">{domain.number}</span>
              </div>
              <h3 className="font-medium text-slate-900 dark:text-white text-sm mb-1">{domain.title}</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">{domain.weight}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Target */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-2xl p-8 border border-amber-100 dark:border-amber-900/20 transition-colors">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Who Is This Course For?</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              The ideal candidate is a solution architect designing and implementing production applications
              with Claude. You should have hands-on experience with building agentic applications using the
              Claude Agent SDK, configuring Claude Code, designing MCP integrations, and managing context windows.
            </p>
            <div className="flex flex-wrap gap-2">
              {['6+ months experience with Claude APIs', 'Agent SDK knowledge', 'Claude Code familiarity', 'MCP understanding'].map((req, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 rounded-full text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> {req}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-8 text-center transition-colors">
        <h2 className="text-2xl font-bold text-white mb-4">Ready to Get Certified?</h2>
        <p className="text-slate-300 mb-6 max-w-xl mx-auto">Passing score is 720/1000. This course covers everything you need.</p>
        <Link to="/domain/1" className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-xl transition-colors">
          Begin with Domain 1 <ArrowRight className="w-5 h-5" />
        </Link>
      </section>
    </div>
  );
}
