import type { Flashcard } from './types';
import { domain1Cards } from './domain1';
import { domain2Cards } from './domain2';
import { domain3Cards } from './domain3';
import { domain4Cards } from './domain4';
import { domain5Cards } from './domain5';

export type { Flashcard } from './types';

export const allFlashcards: Flashcard[] = [
  ...domain1Cards,
  ...domain2Cards,
  ...domain3Cards,
  ...domain4Cards,
  ...domain5Cards,
];

export const flashcardsByDomain = {
  domain1: domain1Cards,
  domain2: domain2Cards,
  domain3: domain3Cards,
  domain4: domain4Cards,
  domain5: domain5Cards,
};

export const domainNames: Record<string, string> = {
  domain1: 'Agentic Architecture',
  domain2: 'Tool Design & MCP',
  domain3: 'Claude Code Config',
  domain4: 'Prompt Engineering',
  domain5: 'Context & Reliability',
};

export const domainColors: Record<string, string> = {
  domain1: '#3b82f6',
  domain2: '#8b5cf6',
  domain3: '#10b981',
  domain4: '#f59e0b',
  domain5: '#ef4444',
};
