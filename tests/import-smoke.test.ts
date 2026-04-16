/**
 * Import smoke tests for all page components.
 * Catches: missing imports (useState, Link, lucide icons, etc.)
 * 
 * Uses dynamic import() so each module is loaded in isolation.
 * If a module has a missing import, it will throw at parse time.
 */
import { describe, it, expect } from 'vitest';

const PAGES = [
  'Home',
  'CourseOverview',
  'Dashboard',
  'Flashcards',
  'Labs',
  'ExamScenarioLabs',
  'PracticeExam',
  'ScenarioExam',
  'Scenarios',
  'Domain1',
  'Domain2',
  'Domain3',
  'Domain4',
  'Domain5',
] as const;

describe('page imports resolve', () => {
  PAGES.forEach(page => {
    it(`${page}.tsx imports resolve`, async () => {
      // This will throw if any import is missing
      const mod = await import(`../src/pages/${page}.tsx`);
      expect(mod).toBeDefined();
      expect(mod.default).toBeDefined();
    });
  });
});

describe('data file imports resolve', () => {
  it('all 13 labs import', async () => {
    const mod = await import('../src/data/labs/index.ts');
    const labs = mod.default;
    expect(labs.length).toBe(13);
    for (const lab of labs) {
      expect(lab.id).toBeDefined();
      expect(lab.title).toBeDefined();
      expect(lab.codeTemplate).toBeDefined();
    }
  });

  it('all 25 exam scenario labs import', async () => {
    const mod = await import('../src/data/examScenarioLabs/index.ts');
    const labs = mod.default;
    expect(labs.length).toBe(25);
    for (const lab of labs) {
      expect(lab.id).toBeDefined();
      expect(lab.title).toBeDefined();
    }
  });

  it('all 5 quizzes import', async () => {
    const mod = await import('../src/data/quizzes/index.ts');
    const quizzes = mod.quizzes;
    expect(quizzes).toBeDefined();
    expect(Object.keys(quizzes).length).toBe(5);
    for (const key of ['1', '2', '3', '4', '5']) {
      const quiz = quizzes[key];
      expect(quiz).toBeDefined();
      expect(Array.isArray(quiz)).toBe(true);
      expect(quiz.length).toBeGreaterThan(0);
      expect(quiz[0].question).toBeDefined();
    }
  });

  it('all 5 quickRefs import', async () => {
    const mod = await import('../src/data/quickRefs/index.ts');
    const refs = mod.quickRefs;
    expect(refs).toBeDefined();
    expect(Object.keys(refs).length).toBe(5);
    for (const key of ['1', '2', '3', '4', '5']) {
      const ref = refs[key];
      expect(ref).toBeDefined();
      expect(ref.domainLabel).toBeDefined();
      expect(ref.sections).toBeDefined();
      expect(ref.sections.length).toBeGreaterThan(0);
    }
  });

  it('scenarios import', async () => {
    const mod = await import('../src/data/scenarios/index.ts');
    expect(mod.scenarios).toBeDefined();
  });

  it('practice exam questions import', async () => {
    const mod = await import('../src/data/practiceExam/index.ts');
    expect(mod.questions).toBeDefined();
  });

  it('all 5 mind maps import', async () => {
    const mod = await import('../src/data/mindMaps/index.ts');
    const maps = mod.mindMaps;
    expect(maps.length).toBe(5);
    for (const m of maps) {
      expect(m.domainId).toBeDefined();
      expect(m.root).toBeDefined();
      expect(m.root.children.length).toBeGreaterThan(0);
    }
  });

  it('50 flashcards import', async () => {
    const mod = await import('../src/data/flashcards/index.ts');
    expect(mod.allFlashcards.length).toBe(50);
    expect(Object.keys(mod.flashcardsByDomain).length).toBe(5);
  });
});
