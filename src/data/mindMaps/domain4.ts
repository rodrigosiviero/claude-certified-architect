import type { DomainMindMap } from './types';

const domain4MindMap: DomainMindMap = {
  domainId: 'd4',
  title: 'Domain 4 — Testing & Evaluation',
  color: '#d97706',
  root: {
    id: 'd4',
    label: 'Testing & Evaluation',
    color: '#d97706',
    children: [
      {
        id: 'd4-types',
        label: 'Test Types',
        color: '#f59e0b',
        children: [
          { id: 'd4-unit', label: 'Unit Tests', detail: 'Single tool/function in isolation, mocked deps', color: '#fbbf24' },
          { id: 'd4-integ', label: 'Integration', detail: 'Tool chain end-to-end, real API calls', color: '#fbbf24' },
          { id: 'd4-e2e', label: 'E2E Scenarios', detail: 'Full agentic loop with real tasks', color: '#fbbf24' },
        ],
      },
      {
        id: 'd4-eval',
        label: 'Evaluation',
        color: '#f59e0b',
        children: [
          { id: 'd4-golden', label: 'Golden Datasets', detail: 'Curated test cases with expected outputs', color: '#fbbf24' },
          { id: 'd4-judge', label: 'LLM-as-Judge', detail: 'AI evaluates AI output quality', color: '#fbbf24' },
          {
            id: 'd4-metrics',
            label: 'Metrics',
            color: '#fbbf24',
            children: [
              { id: 'd4-acc', label: 'Accuracy', detail: '% of correct outputs', color: '#fde68a' },
              { id: 'd4-lat', label: 'Latency', detail: 'Response time per turn', color: '#fde68a' },
              { id: 'd4-cost', label: 'Cost', detail: 'Token usage per interaction', color: '#fde68a' },
              { id: 'd4-toolrate', label: 'Tool Success Rate', detail: '% of tool calls that succeed', color: '#fde68a' },
            ],
          },
        ],
      },
      {
        id: 'd4-debug',
        label: 'Debugging',
        color: '#f59e0b',
        children: [
          { id: 'd4-trace', label: 'Tracing', detail: 'Log every step: input, output, decision', color: '#fbbf24' },
          { id: 'd4-replay', label: 'Replay', detail: 'Reproduce failures from saved logs', color: '#fbbf24' },
          { id: 'd4-ablat', label: 'Ablation', detail: 'Change one variable at a time', color: '#fbbf24' },
        ],
      },
      {
        id: 'd4-ci',
        label: 'CI/CD',
        color: '#f59e0b',
        children: [
          { id: 'd4-gate', label: 'Quality Gates', detail: 'Block deploy if eval score drops below threshold', color: '#fbbf24' },
          { id: 'd4-regres', label: 'Regression Testing', detail: 'Compare against baseline scores', color: '#fbbf24' },
          { id: 'd4-shadow', label: 'Shadow Deploy', detail: 'Test new version on real traffic, no impact', color: '#fbbf24' },
        ],
      },
    ],
  },
};

export default domain4MindMap;
