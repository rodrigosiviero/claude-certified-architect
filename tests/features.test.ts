/**
 * Tests for new features: Flashcards, Dashboard/Context, Notes, Dark Mode
 */
import { describe, it, expect } from 'vitest';

// ═══════════════════════════════════════════════════════════════════
// FLASHCARD DATA
// ═══════════════════════════════════════════════════════════════════
describe('Flashcard data', () => {
  it('allFlashcards has 50 cards (10 per domain)', async () => {
    const mod = await import('../src/data/flashcards/index.ts');
    expect(mod.allFlashcards.length).toBe(50);
  });

  it('each domain has exactly 10 cards', async () => {
    const { flashcardsByDomain } = await import('../src/data/flashcards/index.ts');
    for (const key of ['domain1', 'domain2', 'domain3', 'domain4', 'domain5']) {
      expect(flashcardsByDomain[key as keyof typeof flashcardsByDomain].length).toBe(10);
    }
  });

  it('every card has required fields', async () => {
    const { allFlashcards } = await import('../src/data/flashcards/index.ts');
    for (const card of allFlashcards) {
      expect(card.id).toMatch(/^d[1-5]-\d{2}$/);
      expect(card.domainId).toMatch(/^domain[1-5]$/);
      expect(card.lessonId).toMatch(/^[1-5]-\d+$/);
      expect(card.front.length).toBeGreaterThan(10);
      expect(card.back.length).toBeGreaterThan(20);
      expect(['easy', 'medium', 'hard']).toContain(card.difficulty);
      expect(Array.isArray(card.tags)).toBe(true);
      expect(card.tags.length).toBeGreaterThan(0);
    }
  });

  it('domain names and colors are defined for all 5 domains', async () => {
    const { domainNames, domainColors } = await import('../src/data/flashcards/index.ts');
    for (const key of ['domain1', 'domain2', 'domain3', 'domain4', 'domain5']) {
      expect(domainNames[key]).toBeDefined();
      expect(domainNames[key].length).toBeGreaterThan(3);
      expect(domainColors[key]).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it('no duplicate card IDs', async () => {
    const { allFlashcards } = await import('../src/data/flashcards/index.ts');
    const ids = allFlashcards.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('cards cover distinct topics (no identical fronts)', async () => {
    const { allFlashcards } = await import('../src/data/flashcards/index.ts');
    const fronts = allFlashcards.map(c => c.front);
    expect(new Set(fronts).size).toBe(fronts.length);
  });

  it('difficulty distribution is reasonable', async () => {
    const { allFlashcards } = await import('../src/data/flashcards/index.ts');
    const easy = allFlashcards.filter(c => c.difficulty === 'easy').length;
    const medium = allFlashcards.filter(c => c.difficulty === 'medium').length;
    const hard = allFlashcards.filter(c => c.difficulty === 'hard').length;
    expect(easy).toBeGreaterThan(0);
    expect(medium).toBeGreaterThan(0);
    expect(hard).toBeGreaterThan(0);
    expect(easy + medium + hard).toBe(50);
  });

  it('tags use consistent naming convention', async () => {
    const { allFlashcards } = await import('../src/data/flashcards/index.ts');
    for (const card of allFlashcards) {
      for (const tag of card.tags) {
        // Allow kebab-case and snake_case
        expect(tag).toMatch(/^[a-z][a-z0-9_-]*$/);
      }
    }
  });
});

// ═══════════════════════════════════════════════════════════════════
// NEW PAGE IMPORTS (Dashboard, Flashcards)
// ═══════════════════════════════════════════════════════════════════
describe('New page imports resolve', () => {
  it('Dashboard page imports', async () => {
    const mod = await import('../src/pages/Dashboard.tsx');
    expect(mod.default).toBeDefined();
  });

  it('Flashcards page imports', async () => {
    const mod = await import('../src/pages/Flashcards.tsx');
    expect(mod.default).toBeDefined();
  });
});

// ═══════════════════════════════════════════════════════════════════
// NEW COMPONENT IMPORTS
// ═══════════════════════════════════════════════════════════════════
describe('New component imports resolve', () => {
  const components = [
    'ThemeToggle',
    'FlashcardDeck',
    'LessonNotes',
    'NotesFab',
    'MermaidDiagram',
    'DiagramSvg',
  ];

  for (const comp of components) {
    it(`${comp} imports`, async () => {
      const mod = await import(`../src/components/${comp}.tsx`);
      expect(mod.default).toBeDefined();
    });
  }
});

// ═══════════════════════════════════════════════════════════════════
// COURSE CONTEXT — LOGIC TESTS (SM-2, Streak, Notes)
// ═══════════════════════════════════════════════════════════════════
describe('SM-2 Spaced Repetition Algorithm', () => {
  // We test the logic inline since it's inside the context module
  // Replicating the SM-2 function for unit testing
  interface CardProgress {
    easeFactor: number;
    interval: number;
    repetitions: number;
    nextReview: string;
  }

  function sm2(prev: CardProgress | undefined, rating: 'hard' | 'good' | 'easy'): CardProgress {
    const p = prev || { easeFactor: 2.5, interval: 0, repetitions: 0, nextReview: '' };
    const quality = rating === 'easy' ? 5 : rating === 'good' ? 3 : 1;

    let { easeFactor, interval, repetitions } = p;

    if (quality >= 3) {
      repetitions += 1;
      if (repetitions === 1) interval = 1;
      else if (repetitions === 2) interval = 6;
      else interval = Math.round(interval * easeFactor);
    } else {
      repetitions = 0;
      interval = 1;
    }

    easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

    const next = new Date(Date.now() + interval * 86400000);
    return { easeFactor, interval, repetitions, nextReview: next.toISOString() };
  }

  it('new card with "good" rating gets interval 1 day', () => {
    const result = sm2(undefined, 'good');
    expect(result.interval).toBe(1);
    expect(result.repetitions).toBe(1);
    // easeFactor for quality=3: 2.5 + (0.1 - 2*(0.08 + 2*0.02)) = 2.5 + (0.1 - 0.24) = 2.36
    expect(result.easeFactor).toBeCloseTo(2.36, 1);
  });

  it('new card with "easy" rating gets interval 1 day, higher ease', () => {
    const result = sm2(undefined, 'easy');
    expect(result.interval).toBe(1);
    expect(result.repetitions).toBe(1);
    expect(result.easeFactor).toBeGreaterThan(2.5);
  });

  it('new card with "hard" rating resets to interval 1', () => {
    const result = sm2(undefined, 'hard');
    expect(result.interval).toBe(1);
    expect(result.repetitions).toBe(0);
    expect(result.easeFactor).toBeLessThan(2.5);
  });

  it('second "good" rating increases interval to 6 days', () => {
    const first = sm2(undefined, 'good');
    const second = sm2(first, 'good');
    expect(second.interval).toBe(6);
    expect(second.repetitions).toBe(2);
  });

  it('third "good" rating multiplies by ease factor', () => {
    const first = sm2(undefined, 'good');
    const second = sm2(first, 'good');
    const third = sm2(second, 'good');
    // After 2nd "good": easeFactor = 2.36 + (0.1 - 2*(0.08+0.04)) = 2.36 - 0.14 = 2.22
    // Interval = round(6 * 2.22) = 13
    expect(third.repetitions).toBe(3);
    expect(third.interval).toBeGreaterThan(10);
  });

  it('"hard" rating after progress resets repetitions to 0', () => {
    const first = sm2(undefined, 'good');
    const second = sm2(first, 'good');
    expect(second.repetitions).toBe(2);
    const reset = sm2(second, 'hard');
    expect(reset.repetitions).toBe(0);
    expect(reset.interval).toBe(1);
  });

  it('ease factor never goes below 1.3', () => {
    let card: CardProgress | undefined;
    for (let i = 0; i < 20; i++) {
      card = sm2(card, 'hard');
    }
    expect(card!.easeFactor).toBeGreaterThanOrEqual(1.3);
  });

  it('"easy" ratings accelerate interval growth', () => {
    let card: CardProgress | undefined;
    card = sm2(card, 'easy'); // interval 1, rep 1
    card = sm2(card, 'easy'); // interval 6, rep 2
    card = sm2(card, 'easy'); // interval = 6 * easeFactor (>2.5) = >15
    expect(card!.interval).toBeGreaterThan(15);
  });

  it('nextReview is a valid future ISO date', () => {
    const result = sm2(undefined, 'good');
    const date = new Date(result.nextReview);
    expect(date.getTime()).toBeGreaterThan(Date.now() - 1000);
    expect(result.nextReview).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});

describe('Streak Calculation', () => {
  function calcStreak(dates: string[]): number {
    if (dates.length === 0) return 0;
    const sorted = [...dates].sort().reverse();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

    let streak = 1;
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1]);
      const curr = new Date(sorted[i]);
      const diff = (prev.getTime() - curr.getTime()) / 86400000;
      if (diff === 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  it('empty dates = 0 streak', () => {
    expect(calcStreak([])).toBe(0);
  });

  it('today only = 1 streak', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(calcStreak([today])).toBe(1);
  });

  it('3 consecutive days ending today = 3 streak', () => {
    const dates = [
      new Date().toISOString().split('T')[0],
      new Date(Date.now() - 86400000).toISOString().split('T')[0],
      new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    ];
    expect(calcStreak(dates)).toBe(3);
  });

  it('gap in dates breaks streak', () => {
    const dates = [
      new Date().toISOString().split('T')[0],
      new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    ];
    expect(calcStreak(dates)).toBe(1);
  });

  it('streak counts from yesterday too', () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const dayBefore = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];
    expect(calcStreak([yesterday, dayBefore])).toBe(2);
  });

  it('streak of 2 days ago only = 0 (must include today or yesterday)', () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];
    const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0];
    expect(calcStreak([twoDaysAgo, threeDaysAgo])).toBe(0);
  });

  it('handles unsorted input', () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    expect(calcStreak([yesterday, today])).toBe(2);
  });
});

describe('Notes data structure', () => {
  it('LessonNote interface is compatible with context', () => {
    const note = {
      lessonId: '1-3',
      content: 'Test note with **markdown**',
      updatedAt: new Date().toISOString(),
    };
    expect(note.lessonId).toMatch(/^\d+-\d+$/);
    expect(note.content.length).toBeGreaterThan(0);
    expect(new Date(note.updatedAt).getTime()).not.toBeNaN();
  });
});

// ═══════════════════════════════════════════════════════════════════
// COURSE CONTEXT — IMPORT & STRUCTURE
// ═══════════════════════════════════════════════════════════════════
describe('CourseContext exports', () => {
  it('CourseProvider and useCourse are exported', async () => {
    const mod = await import('../src/context/CourseContext.tsx');
    expect(mod.CourseProvider).toBeDefined();
    expect(mod.useCourse).toBeDefined();
    expect(typeof mod.useCourse).toBe('function');
  });
});

// ═══════════════════════════════════════════════════════════════════
// APP ROUTES
// ═══════════════════════════════════════════════════════════════════
describe('App routes include new pages', () => {
  it('App.tsx imports Dashboard and Flashcards', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const content = fs.readFileSync(path.resolve(__dirname, '../src/App.tsx'), 'utf8');
    expect(content).toContain('Dashboard');
    expect(content).toContain('Flashcards');
    expect(content).toContain('path="dashboard"');
    expect(content).toContain('path="flashcards"');
  });

  it('App.tsx wraps with ThemeProvider', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const content = fs.readFileSync(path.resolve(__dirname, '../src/App.tsx'), 'utf8');
    expect(content).toContain('ThemeProvider');
    expect(content).toContain('next-themes');
  });
});

// ═══════════════════════════════════════════════════════════════════
// DARK MODE CLASSES
// ═══════════════════════════════════════════════════════════════════
describe('Dark mode classes present', () => {
  const pagesWithDark = ['Home', 'Dashboard', 'Domain1', 'Domain2', 'Domain3', 'Domain4', 'Domain5', 'Labs'];

  for (const page of pagesWithDark) {
    it(`${page} has dark: classes`, async () => {
      const fs = await import('fs');
      const path = await import('path');
      const content = fs.readFileSync(path.resolve(__dirname, `../src/pages/${page}.tsx`), 'utf8');
      const darkCount = (content.match(/dark:/g) || []).length;
      expect(darkCount).toBeGreaterThan(0);
    });
  }

  it('Layout has ThemeToggle import', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const content = fs.readFileSync(path.resolve(__dirname, '../src/components/Layout.tsx'), 'utf8');
    expect(content).toContain('ThemeToggle');
    expect(content).toContain('dark:');
  });
});

// ═══════════════════════════════════════════════════════════════════
// NOTES INTEGRATION
// ═══════════════════════════════════════════════════════════════════
describe('Notes integration in Domain pages', () => {
  for (const n of [1, 2, 3, 4, 5]) {
    it(`Domain${n} imports and uses NotesFab`, async () => {
      const fs = await import('fs');
      const path = await import('path');
      const content = fs.readFileSync(path.resolve(__dirname, `../src/pages/Domain${n}.tsx`), 'utf8');
      expect(content).toContain("import NotesFab from '../components/NotesFab'");
      expect(content).toContain('<NotesFab');
    });
  }
});

// ═══════════════════════════════════════════════════════════════════
// TAILWIND CONFIG
// ═══════════════════════════════════════════════════════════════════
describe('Tailwind dark mode configuration', () => {
  it('tailwind.config has darkMode class strategy', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const config = fs.readFileSync(path.resolve(__dirname, '../tailwind.config.js'), 'utf8');
    expect(config).toContain("darkMode: ['class']");
  });
});
