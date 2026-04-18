import type { DomainMindMap } from './types';

const domain3MindMap: DomainMindMap = {
  domainId: 'd3',
  title: 'Domain 3 — Claude Code Best Practices',
  color: '#059669',
  root: {
    id: 'd3',
    label: 'Claude Code Best Practices',
    color: '#059669',
    children: [
      {
        id: 'd3-claudemd',
        label: 'CLAUDE.md Hierarchy',
        color: '#34d399',
        children: [
          { id: 'd3-user', label: '~/.claude/CLAUDE.md', detail: 'Personal preferences, NOT shared', color: '#6ee7b7' },
          { id: 'd3-project', label: '.claude/CLAUDE.md', detail: 'Team standards, Git-committed', color: '#6ee7b7' },
          { id: 'd3-directory', label: 'dir/CLAUDE.md', detail: 'Scoped to subdirectory only', color: '#6ee7b7' },
          { id: 'd3-merge', label: 'Merge order', detail: 'User → Project → Directory (later wins)', color: '#6ee7b7' },
          { id: 'd3-import', label: '@import', detail: 'Pull external files selectively', color: '#6ee7b7' },
        ],
      },
      {
        id: 'd3-commands',
        label: 'Commands & Skills',
        color: '#34d399',
        children: [
          { id: 'd3-cmd', label: 'Commands', detail: 'In-session, ephemeral, quick tasks', color: '#6ee7b7' },
          { id: 'd3-skill', label: 'Skills', detail: 'Persist across sessions, stored in .claude/skills/', color: '#6ee7b7' },
          { id: 'd3-fork', label: 'context: fork', detail: 'Isolated sub-agent, own context window', color: '#6ee7b7' },
          { id: 'd3-personal', label: 'Personal variants', detail: '~/.claude/skills/ overrides project skills', color: '#6ee7b7' },
        ],
      },
      {
        id: 'd3-rules',
        label: 'Path-Specific Rules',
        color: '#34d399',
        children: [
          { id: 'd3-glob', label: 'Glob patterns', detail: '*.py, src/**/*.ts, tests/**/*', color: '#6ee7b7' },
          { id: 'd3-lazy', label: 'Lazy-loaded', detail: 'Zero cost when not triggered', color: '#6ee7b7' },
          { id: 'd3-additive', label: 'Additive', detail: 'Multiple rules can match, all apply', color: '#6ee7b7' },
          { id: 'd3-location', label: '.claude/rules/', detail: 'Cross-directory conventions', color: '#6ee7b7' },
        ],
      },
      {
        id: 'd3-plan',
        label: 'Plan vs Execute',
        color: '#34d399',
        children: [
          { id: 'd3-planmode', label: 'Plan mode', detail: 'Read-only, NO changes, safe exploration', color: '#6ee7b7' },
          { id: 'd3-execmode', label: 'Execute mode', detail: 'Implement changes immediately', color: '#6ee7b7' },
          { id: 'd3-explore', label: 'Explore sub-agent', detail: 'Verbose discovery, protect main context', color: '#6ee7b7' },
          { id: 'd3-canonical', label: 'Canonical pattern', detail: 'Plan first → then execute', color: '#6ee7b7' },
        ],
      },
      {
        id: 'd3-iterate',
        label: 'Iterative Refinement',
        color: '#34d399',
        children: [
          { id: 'd3-io', label: 'Concrete I/O examples', detail: 'Show actual input → expected → current', color: '#6ee7b7' },
          { id: 'd3-sequential', label: 'Sequential fixes', detail: 'Fix independent bugs one at a time', color: '#6ee7b7' },
          { id: 'd3-interview', label: 'Interview pattern', detail: 'Explain → pitfalls → fix (for unfamiliar domains)', color: '#6ee7b7' },
          { id: 'd3-mantra', label: 'Work → Right → Fast', detail: 'Make it work, make it right, make it fast', color: '#6ee7b7' },
        ],
      },
      {
        id: 'd3-cicd',
        label: 'CI/CD Integration',
        color: '#34d399',
        children: [
          { id: 'd3-pflag', label: '-p flag', detail: 'MANDATORY — no interactive mode in CI', color: '#6ee7b7' },
          { id: 'd3-stateless', label: 'Stateless', detail: 'No memory between runs, inject everything', color: '#6ee7b7' },
          { id: 'd3-separate', label: 'Separate sessions', detail: 'Gen + Review in different sessions', color: '#6ee7b7' },
          { id: 'd3-fixtures', label: 'CLAUDE.md for CI', detail: 'Document test fixtures and setup', color: '#6ee7b7' },
        ],
      },
    ],
  },
};

export default domain3MindMap;
