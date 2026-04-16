import type { DomainMindMap } from './types';

const domain5MindMap: DomainMindMap = {
  domainId: 'd5',
  title: 'Domain 5 — Security, Guardrails & Ethics',
  color: '#dc2626',
  root: {
    id: 'd5',
    label: 'Security & Guardrails',
    color: '#dc2626',
    children: [
      {
        id: 'd5-inject',
        label: 'Prompt Injection',
        color: '#ef4444',
        children: [
          {
            id: 'd5-direct',
            label: 'Direct',
            detail: 'Malicious user input overrides system instructions',
            color: '#f87171',
            children: [
              { id: 'd5-jailbreak', label: 'Jailbreak', detail: '"Ignore previous instructions..."', color: '#fca5a5' },
              { id: 'd5-leak', label: 'System Prompt Leak', detail: 'Trick Claude into revealing instructions', color: '#fca5a5' },
            ],
          },
          {
            id: 'd5-indirect',
            label: 'Indirect',
            detail: 'Poisoned data/tool results inject commands',
            color: '#f87171',
            children: [
              { id: 'd5-toolpoison', label: 'Tool Result Poisoning', detail: 'Malicious content in API response', color: '#fca5a5' },
              { id: 'd5-datapoison', label: 'Data Poisoning', detail: 'Corrupted RAG documents', color: '#fca5a5' },
            ],
          },
          { id: 'd5-defend', label: 'Defenses', detail: 'Input sanitization, output filtering, role separation', color: '#f87171' },
        ],
      },
      {
        id: 'd5-guard',
        label: 'Guardrails',
        color: '#ef4444',
        children: [
          { id: 'd5-input', label: 'Input Guards', detail: 'Validate user input before processing', color: '#f87171' },
          { id: 'd5-output', label: 'Output Guards', detail: 'Filter Claude response before showing user', color: '#f87171' },
          { id: 'd5-toolguard', label: 'Tool Guards', detail: 'Validate params, confirm destructive actions', color: '#f87171' },
        ],
      },
      {
        id: 'd5-data',
        label: 'Data Privacy',
        color: '#ef4444',
        children: [
          { id: 'd5-pii', label: 'PII Handling', detail: 'Detect, redact, never log sensitive data', color: '#f87171' },
          { id: 'd5-cross', label: 'Cross-contamination', detail: 'Prevent context leaking between users', color: '#f87171' },
          { id: 'd5-consent', label: 'User Consent', detail: 'Inform what data is collected and used', color: '#f87171' },
        ],
      },
      {
        id: 'd5-safety',
        label: 'Safety & Ethics',
        color: '#ef4444',
        children: [
          { id: 'd5-red', label: 'Red Teaming', detail: 'Adversarial testing of agent boundaries', color: '#f87171' },
          { id: 'd5-bias', label: 'Bias & Fairness', detail: 'Evaluate biased outputs across demographics', color: '#f87171' },
          { id: 'd5-humanloop', label: 'Human-in-the-loop', detail: 'Critical actions require human approval', color: '#f87171' },
        ],
      },
    ],
  },
};

export default domain5MindMap;
