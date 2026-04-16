import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronDown, ChevronRight, Code, Cpu, Database, FileText, Layers, Shield, Users } from 'lucide-react';

const scenarios = [
  {
    id: 1,
    title: 'Customer Support Resolution Agent',
    icon: Users,
    color: 'bg-blue-500',
    domains: ['Domain 1: Agentic Architecture & Orchestration', 'Domain 2: Tool Design & MCP Integration', 'Domain 5: Context Management & Reliability'],
    description: 'Build a customer support resolution agent that handles high-ambiguity requests including returns, billing disputes, and account issues.',
    keyTopics: [
      'Agentic loop implementation with tool use',
      'Multi-step workflow enforcement with prerequisites',
      'Escalation patterns for policy exceptions',
      'Structured error responses for backend failures',
      'Context management for multi-issue sessions',
    ],
    technicalRequirements: [
      'Custom MCP tools: get_customer, lookup_order, process_refund, escalate_to_human',
      'Programmatic prerequisite enforcement (verify before financial ops)',
      'Hook patterns for compliance (refund limits)',
      'Structured handoff protocols for human escalation',
    ],
    successMetrics: '80%+ first-contact resolution rate while maintaining appropriate escalation',
  },
  {
    id: 2,
    title: 'Code Generation with Claude Code',
    icon: Code,
    color: 'bg-green-500',
    domains: ['Domain 3: Claude Code Configuration & Workflows', 'Domain 5: Context Management & Reliability'],
    description: 'Use Claude Code for code generation, refactoring, debugging, and documentation with team-appropriate configurations.',
    keyTopics: [
      'CLAUDE.md hierarchy and modular organization',
      'Custom slash commands for team workflows',
      'Plan mode vs direct execution decisions',
      'Path-specific rules for different code areas',
      'Session state management and resumption',
    ],
    technicalRequirements: [
      'Project-scoped commands in .claude/commands/',
      'Skills with context: fork for isolated execution',
      'CLAUDE.md with team standards and conventions',
      'Proper use of /memory and /compact commands',
    ],
    successMetrics: 'Consistent code generation following team conventions without requiring repetitive instructions',
  },
  {
    id: 3,
    title: 'Multi-Agent Research System',
    icon: Cpu,
    color: 'bg-purple-500',
    domains: ['Domain 1: Agentic Architecture & Orchestration', 'Domain 2: Tool Design & MCP Integration', 'Domain 5: Context Management & Reliability'],
    description: 'Build a coordinator-subagent research pipeline with specialized agents for web search, document analysis, synthesis, and reporting.',
    keyTopics: [
      'Hub-and-spoke coordinator architecture',
      'Subagent task decomposition and delegation',
      'Context passing with structured outputs',
      'Iterative refinement loops',
      'Error propagation and coverage tracking',
    ],
    technicalRequirements: [
      'Task tool for subagent spawning with allowedTools configuration',
      'Structured claim-source mappings for provenance',
      'Coverage annotations in synthesis output',
      'Local error recovery with coordinator fallback',
    ],
    successMetrics: 'Comprehensive cited reports covering all relevant aspects without gaps or duplication',
  },
  {
    id: 4,
    title: 'Developer Productivity with Claude',
    icon: Database,
    color: 'bg-orange-500',
    domains: ['Domain 2: Tool Design & MCP Integration', 'Domain 3: Claude Code Configuration & Workflows', 'Domain 1: Agentic Architecture & Orchestration'],
    description: 'Build developer productivity tools for exploring codebases, understanding legacy systems, and automating repetitive tasks.',
    keyTopics: [
      'Built-in tool selection (Read, Write, Edit, Bash, Grep, Glob)',
      'Incremental codebase exploration strategies',
      'MCP server integration for backend systems',
      'Large codebase session management',
      'Crash recovery with state persistence',
    ],
    technicalRequirements: [
      'Effective Grep for content search patterns',
      'Glob for file discovery',
      'Read + Write fallback for Edit failures',
      'Subagent delegation for verbose exploration',
    ],
    successMetrics: 'Accurate codebase understanding with preserved context across extended exploration sessions',
  },
  {
    id: 5,
    title: 'Claude Code for CI/CD',
    icon: Shield,
    color: 'bg-red-500',
    domains: ['Domain 3: Claude Code Configuration & Workflows', 'Domain 4: Prompt Engineering & Structured Output'],
    description: 'Integrate Claude Code into CI/CD pipelines for automated code reviews, test generation, and pull request feedback.',
    keyTopics: [
      'Non-interactive execution with --print flag',
      'Structured output with --json-schema',
      'Explicit criteria for review precision',
      'Multi-instance review architecture',
      'Incremental review to avoid duplicates',
    ],
    technicalRequirements: [
      '-p flag for non-interactive CI execution',
      '--output-format json --json-schema for machine parsing',
      'Separate review instance from generation context',
      'CLAUDE.md for project review standards',
    ],
    successMetrics: 'Actionable, precise review feedback with minimal false positives',
  },
  {
    id: 6,
    title: 'Structured Data Extraction',
    icon: FileText,
    color: 'bg-cyan-500',
    domains: ['Domain 4: Prompt Engineering & Structured Output', 'Domain 5: Context Management & Reliability'],
    description: 'Build systems that extract structured information from unstructured documents with validation and quality assurance.',
    keyTopics: [
      'JSON schemas for guaranteed output structure',
      'Few-shot examples for consistent extraction',
      'Validation and retry with error feedback',
      'Confidence-based routing to human review',
      'Accuracy measurement by field and document type',
    ],
    technicalRequirements: [
      'Tool use with extraction JSON schemas',
      'Validation for semantic correctness',
      'Retry-with-error-feedback pattern',
      'Stratified sampling for quality monitoring',
    ],
    successMetrics: 'High extraction accuracy with appropriate human review for low-confidence cases',
  },
];

export default function Scenarios() {
  const [expandedScenario, setExpandedScenario] = useState<number | null>(null);

  const toggleScenario = (id: number) => {
    setExpandedScenario(expandedScenario === id ? null : id);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start gap-6">
        <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl flex items-center justify-center flex-shrink-0">
          <Layers className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Exam Scenarios</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            The certification exam uses scenario-based questions. Each scenario presents a realistic production
            context that frames a set of questions. During the exam, 4 scenarios will be selected from these 6.
          </p>
        </div>
      </div>

      {/* Scenario Selection Info */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-bold text-white">4/6</span>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Random Selection</h3>
            <p className="text-slate-600 dark:text-slate-400">
              During your actual exam, exactly 4 of these 6 scenarios will be randomly selected.
              Questions will be drawn from the relevant domains for each selected scenario.
              Study all scenarios to be prepared for any combination.
            </p>
          </div>
        </div>
      </div>

      {/* Scenarios */}
      <div className="space-y-4">
        {scenarios.map((scenario) => {
          const Icon = scenario.icon;
          const isExpanded = expandedScenario === scenario.id;

          return (
            <div
              key={scenario.id}
              className={`bg-white dark:bg-slate-900 rounded-xl border transition-all ${
                isExpanded ? 'border-slate-300 shadow-lg' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <button
                onClick={() => toggleScenario(scenario.id)}
                className="w-full p-6 text-left flex items-center gap-4"
              >
                <div className={`w-12 h-12 ${scenario.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-slate-400">Scenario {scenario.id}</span>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{scenario.title}</h3>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-1">{scenario.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">{scenario.domains.length} domains</span>
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-6 pb-6 border-t border-slate-100 pt-6 space-y-6">
                  {/* Description */}
                  <p className="text-slate-600 dark:text-slate-400">{scenario.description}</p>

                  {/* Domains */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      Relevant Exam Domains
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {scenario.domains.map((domain, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-slate-100 rounded-lg text-sm text-slate-700 dark:text-slate-300"
                        >
                          {domain}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Topics */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Key Topics to Master
                    </h4>
                    <ul className="space-y-2">
                      {scenario.keyTopics.map((topic, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technical Requirements */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <Code className="w-4 h-4 text-amber-500" />
                      Technical Requirements
                    </h4>
                    <ul className="space-y-2">
                      {scenario.technicalRequirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Success Metrics */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-2">Success Metrics</h4>
                    <p className="text-sm text-green-800">{scenario.successMetrics}</p>
                  </div>

                  {/* Related Lessons Link */}
                  <div className="pt-4 border-t border-slate-100">
                    <Link
                      to={`/domain/${scenario.id <= 2 ? scenario.id : scenario.id <= 4 ? 3 : scenario.id <= 5 ? 4 : 5}`}
                      className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
                    >
                      Study related lessons
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Preparation Tips */}
      <div className="bg-slate-900 rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold text-white mb-4">Ready to Study?</h2>
        <p className="text-slate-300 mb-6 max-w-xl mx-auto">
          Each scenario maps to specific domains in the exam. Review all 5 domains to be fully prepared
          for any combination of scenarios you might encounter.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/overview"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-xl transition-colors"
          >
            View Course Overview
          </Link>
          <Link
            to="/practice-exam"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors"
          >
            Take Practice Exam
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-8 border-t border-slate-200 dark:border-slate-800">
        <Link to="/practice-exam" className="text-slate-600 hover:text-slate-900 font-medium">
          ← Previous: Practice Exam
        </Link>
        <Link to="/" className="text-amber-600 hover:text-amber-700 font-medium">
          Back to Course Home
        </Link>
      </div>
    </div>
  );
}
