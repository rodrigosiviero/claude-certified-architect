/**
 * Unified Question Pool
 *
 * Combines existing scenario exam questions (1-120) with new bank questions (121+).
 * Used by the Scenario Exam Hub to generate random exams.
 */
import type { ScenarioQuestion } from '../scenarioExams/types';
import type { PoolQuestion } from './d1';
import d1New from './d1';
import d2New from './d2';
import d3New from './d3';
import d4New from './d4';
import d5New from './d5';
import { scenarioExams } from '../scenarioExams';

// Combine all new domain questions
const questionBank: PoolQuestion[] = [...d1New, ...d2New, ...d3New, ...d4New, ...d5New];

// ── Normalize a scenario question to pool format ──────────────────────────
interface UnifiedQuestion {
  poolId: number;
  domain: 'd1' | 'd2' | 'd3' | 'd4' | 'd5';
  domainLabel: string;
  examTask: string;
  scenario: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  trap?: string;
}

// Build the full pool from scenario exams + new questions
function buildFullPool(): UnifiedQuestion[] {
  const pool: UnifiedQuestion[] = [];

  // Extract questions from all 6 scenario exams
  for (const exam of scenarioExams) {
    for (const q of exam.questions) {
      pool.push({
        poolId: (exam.id - 1) * 20 + q.id, // 1-20, 21-40, 41-60, 61-80, 81-100, 101-120
        domain: q.domain,
        domainLabel: q.domainLabel,
        examTask: q.examTask || '',
        scenario: q.scenario,
        question: q.question,
        options: [...q.options],
        correct: q.correct,
        explanation: q.explanation,
        trap: q.trap,
      });
    }
  }

  // Add new questions from bank
  for (const q of questionBank) {
    pool.push({
      poolId: q.poolId,
      domain: q.domain,
      domainLabel: q.domainLabel,
      examTask: q.examTask || '',
      scenario: q.scenario,
      question: q.question,
      options: [...q.options],
      correct: q.correct,
      explanation: q.explanation,
      trap: q.trap,
    });
  }

  return pool;
}

const fullPool = buildFullPool();

export type { UnifiedQuestion };

// ── Query functions ────────────────────────────────────────────────────────

export function getFullPool(): UnifiedQuestion[] {
  return fullPool;
}

export function getPoolByDomain(domain: string): UnifiedQuestion[] {
  return fullPool.filter(q => q.domain === domain);
}

export function getPoolStats() {
  const domains = ['d1', 'd2', 'd3', 'd4', 'd5'];
  const stats: Record<string, number> = {};
  for (const d of domains) {
    stats[d] = fullPool.filter(q => q.domain === d).length;
  }
  return { total: fullPool.length, byDomain: stats };
}

// ── Exam generation ────────────────────────────────────────────────────────
// Seeded RNG for deterministic but varied exam generation
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function shuffleArray<T>(arr: T[], rng: () => number): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export interface GeneratedExam {
  id: string;
  title: string;
  description: string;
  icon: string;
  questions: UnifiedQuestion[];
  mode: 'random' | 'domain' | 'full';
  domain?: string;
}

/**
 * Generate a random 20-question exam (4 per domain).
 * Seed is typically derived from date + a counter.
 */
export function generateRandomExam(seed: number): GeneratedExam {
  const rng = seededRandom(seed);
  const domains = ['d1', 'd2', 'd3', 'd4', 'd5'];
  const questions: UnifiedQuestion[] = [];

  for (const d of domains) {
    const domainQs = shuffleArray(getPoolByDomain(d), rng);
    questions.push(...domainQs.slice(0, 4));
  }

  return {
    id: `random-${seed}`,
    title: 'Random Simulated Exam',
    description: '20 random questions — 4 per domain. A fresh mix every time.',
    icon: '🎲',
    questions: shuffleArray(questions, rng),
    mode: 'random',
  };
}

/**
 * Generate a domain-specific exam (all questions from one domain, shuffled).
 */
export function generateDomainExam(domain: string, seed: number, limit?: number): GeneratedExam {
  const rng = seededRandom(seed);
  const domainLabels: Record<string, string> = {
    d1: 'Agentic Architecture',
    d2: 'Tool Design & MCP',
    d3: 'Claude Code Configuration',
    d4: 'Prompt Engineering',
    d5: 'Safety & Evaluation',
  };
  const all = shuffleArray(getPoolByDomain(domain), rng);
  const questions = limit ? all.slice(0, limit) : all;

  return {
    id: `domain-${domain}-${seed}`,
    title: `Domain Focus: ${domainLabels[domain] || domain}`,
    description: `${questions.length} questions focused on ${domainLabels[domain] || domain}.`,
    icon: '🎯',
    questions,
    mode: 'domain',
    domain,
  };
}

/**
 * Generate a full 60-question exam (12 per domain), simulating the real exam.
 */
export function generateFullExam(seed: number): GeneratedExam {
  const rng = seededRandom(seed);
  const domains = ['d1', 'd2', 'd3', 'd4', 'd5'];
  const questions: UnifiedQuestion[] = [];

  for (const d of domains) {
    const domainQs = shuffleArray(getPoolByDomain(d), rng);
    questions.push(...domainQs.slice(0, 12));
  }

  return {
    id: `full-${seed}`,
    title: 'Full Exam Simulation',
    description: '60 questions — 12 per domain. Simulates the real certification exam.',
    icon: '📝',
    questions: shuffleArray(questions, rng),
    mode: 'full',
  };
}
