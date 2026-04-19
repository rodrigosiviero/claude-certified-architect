import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useCourse } from '../context/CourseContext';
import { BookOpen, Code2, Settings, FileText, Shield, FlaskConical, GraduationCap, Layers, Briefcase, Zap, Trophy, LayoutDashboard, Brain, Target, Menu, X, Home } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const domains = [
  { id: 'domain1', path: '/domain/1', number: 1, title: 'Agentic Architecture', icon: Layers, weight: '27%', color: 'bg-blue-500' },
  { id: 'domain2', path: '/domain/2', number: 2, title: 'Tool Design & MCP', icon: Code2, weight: '18%', color: 'bg-purple-500' },
  { id: 'domain3', path: '/domain/3', number: 3, title: 'Claude Code Config', icon: Settings, weight: '20%', color: 'bg-green-500' },
  { id: 'domain4', path: '/domain/4', number: 4, title: 'Prompt Engineering', icon: FileText, weight: '20%', color: 'bg-orange-500' },
  { id: 'domain5', path: '/domain/5', number: 5, title: 'Context & Reliability', icon: Shield, weight: '15%', color: 'bg-red-500' },
];

// Mobile bottom nav items
const mobileNavItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/flashcards', icon: Brain, label: 'Cards' },
  { to: '/practice-exam', icon: GraduationCap, label: 'Exam' },
  { to: '/scenario-exams', icon: Target, label: 'Scenarios' },
];

function NavLink({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive
          ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </Link>
  );
}

export default function Layout() {
  const location = useLocation();
  const { getDomainProgress, overallProgress } = useCourse();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer on navigation
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row transition-colors duration-200">
      {/* ── Mobile Header ──────────────────────────────────────── */}
      <header className="lg:hidden sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-sm">Claude Architect</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {drawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* ── Mobile Drawer Overlay ──────────────────────────────── */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={closeDrawer} />
          <aside className="relative w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-y-auto animate-slide-in-left">
            {/* Logo */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <Link to="/" onClick={closeDrawer} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-slate-900 dark:text-white">Claude Architect</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Certification Course</p>
                </div>
              </Link>
            </div>

            {/* Progress */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600 dark:text-slate-400">Overall Progress</span>
                <span className="font-medium text-slate-900 dark:text-white">{overallProgress}%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500" style={{ width: `${overallProgress}%` }} />
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto p-4">
              <div className="space-y-1">
                <Link to="/dashboard" onClick={closeDrawer} className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400"><LayoutDashboard className="w-5 h-5" /><span className="font-medium">Dashboard</span></Link>
                <Link to="/overview" onClick={closeDrawer} className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400"><BookOpen className="w-5 h-5" /><span className="font-medium">Course Overview</span></Link>
                <Link to="/flashcards" onClick={closeDrawer} className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400"><Brain className="w-5 h-5" /><span className="font-medium">Flashcards</span></Link>
                <Link to="/scenarios" onClick={closeDrawer} className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400"><Layers className="w-5 h-5" /><span className="font-medium">Exam Scenarios</span></Link>
                <Link to="/achievements" onClick={closeDrawer} className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400"><Trophy className="w-5 h-5" /><span className="font-medium">Achievements</span></Link>
              </div>

              <div className="mt-4">
                <h3 className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Domains</h3>
                <div className="space-y-1">
                  {domains.map(d => (
                    <Link key={d.id} to={d.path} onClick={closeDrawer} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 dark:text-slate-400">
                      <div className={`w-7 h-7 rounded-md ${d.color}`}><d.icon className="w-4 h-4 text-white p-0.5" /></div>
                      <span className="text-sm font-medium truncate">D{d.number} — {d.title}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
                <Link to="/labs" onClick={closeDrawer} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 dark:text-slate-400"><FlaskConical className="w-5 h-5" /><span className="text-sm font-medium">Labs</span></Link>
                <Link to="/exam-scenarios" onClick={closeDrawer} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 dark:text-slate-400"><Zap className="w-5 h-5" /><span className="text-sm font-medium">Scenario Labs</span></Link>
                <Link to="/practice-exam" onClick={closeDrawer} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 dark:text-slate-400"><GraduationCap className="w-5 h-5" /><span className="text-sm font-medium">Trivia Exam</span></Link>
                <Link to="/scenario-exam" onClick={closeDrawer} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 dark:text-slate-400"><Briefcase className="w-5 h-5" /><span className="text-sm font-medium">Scenario Exam (20Q)</span></Link>
                <Link to="/scenario-exams" onClick={closeDrawer} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 dark:text-slate-400"><Target className="w-5 h-5" /><span className="text-sm font-medium">Exam Simulator</span></Link>
              </div>
            </nav>
          </aside>
        </div>
      )}

      {/* ── Desktop Sidebar (unchanged) ────────────────────────── */}
      <aside className="hidden lg:flex w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col fixed h-full transition-colors duration-200">
        {/* Logo */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 dark:text-white">Claude Architect</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Certification Course</p>
            </div>
          </Link>
          <ThemeToggle />
        </div>

        {/* Overall Progress */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-600 dark:text-slate-400">Overall Progress</span>
            <span className="font-medium text-slate-900 dark:text-white">{overallProgress}%</span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500" style={{ width: `${overallProgress}%` }} />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            <NavLink to="/dashboard" icon={LayoutDashboard} label="Study Dashboard" />
            <NavLink to="/overview" icon={BookOpen} label="Course Overview" />
            <NavLink to="/flashcards" icon={Brain} label="Flashcards" />
            <NavLink to="/scenarios" icon={Layers} label="Exam Scenarios" />
            <NavLink to="/achievements" icon={Trophy} label="Achievements" />
          </div>

          {/* Domains */}
          <div className="mt-6">
            <h3 className="px-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Exam Domains
            </h3>
            <div className="space-y-1">
              {domains.map((domain) => {
                const Icon = domain.icon;
                const progress = getDomainProgress(domain.id);
                const isActive = location.pathname === domain.path;

                return (
                  <Link
                    key={domain.id}
                    to={domain.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${
                      isActive
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${isActive ? domain.color : domain.color}`}>
                      <Icon className="w-5 h-5 text-white p-1.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium opacity-60">D{domain.number}</span>
                        <span className="font-medium truncate">{domain.title}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className={`flex-1 h-1 rounded-full ${isActive ? 'bg-white/20 dark:bg-slate-200' : 'bg-slate-100 dark:bg-slate-800'}`}>
                          <div
                            className={`h-full rounded-full transition-all ${isActive ? 'bg-white dark:bg-slate-600' : domain.color}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className={`text-xs ${isActive ? 'opacity-60' : 'text-slate-400 dark:text-slate-500'}`}>
                          {progress}%
                        </span>
                      </div>
                    </div>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-white/20 dark:bg-slate-200 text-slate-700'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                      {domain.weight}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Bottom Links */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
          <NavLink to="/labs" icon={FlaskConical} label="Hands-on Labs" />
          <NavLink to="/exam-scenarios" icon={Zap} label="Exam Scenario Labs" />
          <NavLink to="/practice-exam" icon={GraduationCap} label="Trivia Exam (60Q)" />
          <NavLink to="/scenario-exam" icon={Briefcase} label="Scenario Exam (20Q)" />
          <NavLink to="/scenario-exams" icon={Target} label="Exam Simulator" />
        </div>
      </aside>

      {/* ── Main Content ───────────────────────────────────────── */}
      <main className="flex-1 lg:ml-72 pb-20 lg:pb-0">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* ── Mobile Bottom Nav ──────────────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-around px-2 py-1.5 safe-area-bottom">
        {mobileNavItems.map(item => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg min-w-0 ${
                isActive
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
