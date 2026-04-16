import { Link } from 'react-router-dom';
import { BookOpen, Target, Award, Clock, FileText, ArrowRight, Layers } from 'lucide-react';
import { useCourse } from '../context/CourseContext';

const examInfo = [
  { label: 'Exam Name', value: 'Claude Certified Architect – Foundations' },
  { label: 'Passing Score', value: '720 / 1000 (scaled)' },
  { label: 'Question Format', value: 'Multiple Choice (1 correct, 3 distractors)' },
  { label: 'Scenarios in Exam', value: '4 randomly selected from 6 total' },
];

const domains = [
  {
    number: 1,
    id: 'domain1',
    title: 'Agentic Architecture & Orchestration',
    weight: '27%',
    color: 'bg-blue-500',
    lessons: 7,
    description:
      'Master the design and implementation of autonomous AI agents, multi-agent orchestration patterns, and sophisticated workflow systems.',
    topics: [
      'Agentic loop lifecycle and stop_reason handling',
      'Coordinator-subagent patterns and task delegation',
      'Context passing and subagent spawning',
      'Multi-step workflow enforcement and handoffs',
      'Agent SDK hooks for tool call interception',
      'Task decomposition strategies',
      'Session state, resumption, and forking',
    ],
  },
  {
    number: 2,
    id: 'domain2',
    title: 'Tool Design & MCP Integration',
    weight: '18%',
    color: 'bg-purple-500',
    lessons: 5,
    description:
      'Learn to design effective tool interfaces, implement structured error responses, and integrate MCP servers for production deployments.',
    topics: [
      'Designing effective tool interfaces with clear descriptions',
      'Implementing structured error responses',
      'Tool distribution and tool_choice configuration',
      'MCP server integration',
      'Built-in tools: Read, Write, Edit, Bash, Grep, Glob',
    ],
  },
  {
    number: 3,
    id: 'domain3',
    title: 'Claude Code Configuration & Workflows',
    weight: '20%',
    color: 'bg-green-500',
    lessons: 6,
    description:
      'Configure Claude Code for team workflows using CLAUDE.md files, custom slash commands, Agent Skills, and CI/CD integration.',
    topics: [
      'CLAUDE.md hierarchy and modular organization',
      'Custom slash commands and skills creation',
      'Path-specific rules with conditional loading',
      'Plan mode vs direct execution decisions',
      'Iterative refinement techniques',
      'CI/CD pipeline integration',
    ],
  },
  {
    number: 4,
    id: 'domain4',
    title: 'Prompt Engineering & Structured Output',
    weight: '20%',
    color: 'bg-orange-500',
    lessons: 6,
    description:
      'Design prompts with explicit criteria, implement few-shot prompting, enforce structured output with JSON schemas, and build validation systems.',
    topics: [
      'Prompts with explicit criteria for precision',
      'Few-shot prompting for consistency',
      'JSON schemas and tool use for structured output',
      'Validation, retry, and feedback loops',
      'Batch processing strategies',
      'Multi-instance review architectures',
    ],
  },
  {
    number: 5,
    id: 'domain5',
    title: 'Context Management & Reliability',
    weight: '15%',
    color: 'bg-red-500',
    lessons: 6,
    description:
      'Master conversation context preservation, escalation patterns, error propagation, and reliability engineering for production systems.',
    topics: [
      'Conversation context management',
      'Escalation and ambiguity resolution',
      'Error propagation strategies',
      'Large codebase exploration',
      'Human review workflows and confidence calibration',
      'Information provenance and uncertainty handling',
    ],
  },
];

const scenarios = [
  { number: 1, title: 'Customer Support Resolution Agent' },
  { number: 2, title: 'Code Generation with Claude Code' },
  { number: 3, title: 'Multi-Agent Research System' },
  { number: 4, title: 'Developer Productivity with Claude' },
  { number: 5, title: 'Claude Code for CI/CD' },
  { number: 6, title: 'Structured Data Extraction' },
];

export default function CourseOverview() {
  const { getDomainProgress } = useCourse();

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
          <BookOpen className="w-4 h-4" />
          <span>Course Guide</span>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Course Overview</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Complete beginner-to-certification curriculum covering 100% of exam objectives
        </p>
      </div>

      {/* Exam Information */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-amber-400" />
            <div>
              <h2 className="text-xl font-bold text-white">Certification Exam</h2>
              <p className="text-slate-300">Claude Certified Architect – Foundations</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {examInfo.map((info, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  {i === 0 && <Target className="w-5 h-5 text-slate-600 dark:text-slate-400" />}
                  {i === 1 && <Award className="w-5 h-5 text-amber-600" />}
                  {i === 2 && <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />}
                  {i === 3 && <Layers className="w-5 h-5 text-slate-600 dark:text-slate-400" />}
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{info.label}</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{info.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exam Domains */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Exam Domains</h2>
        <div className="space-y-4">
          {domains.map((domain) => {
            const progress = getDomainProgress(domain.id);
            return (
              <div
                key={domain.number}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${domain.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <span className="text-xl font-bold text-white">{domain.number}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{domain.title}</h3>
                        <span className="px-2 py-1 bg-slate-100 rounded text-sm font-medium text-slate-600 dark:text-slate-400">
                          {domain.weight}
                        </span>
                        <span className="text-sm text-slate-400">{domain.lessons} lessons</span>
                      </div>
                      <p className="text-slate-600 mb-4">{domain.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {domain.topics.map((topic, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-slate-50 rounded text-xs text-slate-600 dark:text-slate-400"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${domain.color} transition-all duration-500`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-600 w-12">{progress}%</span>
                        <Link
                          to={domain.id === 'domain1' ? '/domain/1' : domain.id === 'domain2' ? '/domain/2' : domain.id === 'domain3' ? '/domain/3' : domain.id === 'domain4' ? '/domain/4' : '/domain/5'}
                          className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium text-sm"
                        >
                          Start
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Exam Scenarios */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Exam Scenarios</h2>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Layers className="w-6 h-6 text-amber-400" />
            <h3 className="text-lg font-semibold text-white">6 Scenarios, 4 Selected Per Exam</h3>
          </div>
          <p className="text-slate-300 mb-6">
            The exam uses scenario-based questions. Each scenario presents a realistic production context
            that frames a set of questions. During the actual exam, 4 scenarios will be picked at random
            from the full set of 6 scenarios below.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {scenarios.map((scenario) => (
              <div
                key={scenario.number}
                className="flex items-center gap-3 p-4 bg-white/5 rounded-xl"
              >
                <span className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-sm font-bold text-white">
                  {scenario.number}
                </span>
                <span className="text-white font-medium">{scenario.title}</span>
              </div>
            ))}
          </div>
          <Link
            to="/scenarios"
            className="inline-flex items-center gap-2 mt-6 text-amber-400 hover:text-amber-300 font-medium"
          >
            View detailed scenario breakdowns
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Preparation Tips */}
      <section className="bg-amber-50 dark:bg-amber-900/10 rounded-2xl p-8 border border-amber-100">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Exam Preparation Strategy</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-amber-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <span className="text-xl font-bold text-white">1</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Learn</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Complete all 5 domains, understanding both concepts and practical skills
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-amber-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <span className="text-xl font-bold text-white">2</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Practice</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Work through hands-on labs and practice with real code examples
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-amber-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <span className="text-xl font-bold text-white">3</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Test</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Take practice exams to identify knowledge gaps and build confidence
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
