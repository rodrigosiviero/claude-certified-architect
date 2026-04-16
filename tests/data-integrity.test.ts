/**
 * Data integrity tests for src/data/ files.
 * Catches: odd backtick counts, missing exports, structural issues.
 */
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const SRC = path.resolve(__dirname, '../src');

// ─── Helpers ────────────────────────────────────────────────────
function readDataFile(relativePath: string): string {
  return fs.readFileSync(path.join(SRC, relativePath), 'utf-8');
}

function listFiles(dir: string, suffix = '.ts'): string[] {
  const full = path.join(SRC, dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full).filter(f => f.endsWith(suffix));
}

// ─── Exam Scenario Labs (es-1 to es-25) ────────────────────────
describe('examScenarioLabs data files', () => {
  const files = listFiles('data/examScenarioLabs', '.ts').filter(f => f.startsWith('es-'));

  it('has 25 scenario lab files', () => {
    expect(files.length).toBe(25);
  });

  files.forEach(file => {
    describe(file, () => {
      const content = readDataFile(`data/examScenarioLabs/${file}`);
      const id = file.replace('.ts', '');

      it('has even backtick count', () => {
        const bt = (content.match(/`/g) || []).length;
        expect(bt % 2, `odd backticks: ${bt}`).toBe(0);
      });

      it('has export default', () => {
        expect(content).toMatch(/export default/);
      });

      it('ends with export default on its own line', () => {
        const lines = content.trimEnd().split('\n');
        const last = lines[lines.length - 1];
        expect(last.trim()).toMatch(/^export default/);
      });

      it('has proper object close before export', () => {
        const lines = content.trimEnd().split('\n');
        // Find export default line
        const exportIdx = lines.findIndex(l => l.trim().startsWith('export default'));
        expect(exportIdx, 'no export default found').toBeGreaterThan(0);
        // Line before should be }; or blank (with }; before blank)
        const before = lines[exportIdx - 1].trim();
        if (before === '') {
          const before2 = lines[exportIdx - 2].trim();
          expect(before2).toBe('};');
        } else {
          expect(before).toBe('};');
        }
      });

      it('has codeTemplate field', () => {
        expect(content).toMatch(/codeTemplate:/);
      });

      it('has brokenCode field', () => {
        expect(content).toMatch(/brokenCode:/);
      });

      it('has no stray } between closing backtick and export', () => {
        // Get everything after last backtick pair's closing
        const lastBacktickIdx = content.lastIndexOf('`');
        const afterLast = content.slice(lastBacktickIdx + 1);
        // Should not have double-close: }, followed by };
        expect(afterLast).not.toMatch(/},\s*\n\s*\};/);
      });
    });
  });
});

// ─── Regular Labs (lab-1 to lab-13) ─────────────────────────────
describe('labs data files', () => {
  const files = listFiles('data/labs', '.ts').filter(f => f.startsWith('lab-'));

  it('has 13 lab files', () => {
    expect(files.length).toBe(13);
  });

  files.forEach(file => {
    describe(file, () => {
      const content = readDataFile(`data/labs/${file}`);

      it('has even backtick count', () => {
        const bt = (content.match(/`/g) || []).length;
        expect(bt % 2, `odd backticks: ${bt}`).toBe(0);
      });

      it('has export default', () => {
        expect(content).toMatch(/export default/);
      });

      it('ends with export default on its own line', () => {
        const lines = content.trimEnd().split('\n');
        expect(lines[lines.length - 1].trim()).toMatch(/^export default/);
      });

      it('has required fields', () => {
        for (const field of ['id:', 'title:', 'codeTemplate:']) {
          expect(content, `missing "${field}"`).toMatch(new RegExp(field));
        }
      });
    });
  });
});

// ─── Quizzes (domain1-5) ────────────────────────────────────────
describe('quiz data files', () => {
  const files = listFiles('data/quizzes', '.ts').filter(f => f.startsWith('domain'));

  it('has 5 quiz files', () => {
    expect(files.length).toBe(5);
  });

  files.forEach(file => {
    describe(file, () => {
      const content = readDataFile(`data/quizzes/${file}`);

      it('has export default', () => {
        expect(content).toMatch(/export default/);
      });

      it('has question objects', () => {
        expect(content).toMatch(/question:/);
        expect(content).toMatch(/options:/);
      });
    });
  });
});

// ─── QuickRefs (domain1-5) ──────────────────────────────────────
describe('quickRef data files', () => {
  const files = listFiles('data/quickRefs', '.ts').filter(f => f.startsWith('domain'));

  it('has 5 quickRef files', () => {
    expect(files.length).toBe(5);
  });

  files.forEach(file => {
    describe(file, () => {
      const content = readDataFile(`data/quickRefs/${file}`);

      it('has export default', () => {
        expect(content).toMatch(/export default/);
      });

      it('has title fields', () => {
        // Should have multiple title: entries (one per quickRef item)
        const titles = (content.match(/title:/g) || []).length;
        expect(titles).toBeGreaterThanOrEqual(4);
      });
    });
  });
});

// ─── Scenarios & Practice Exam ──────────────────────────────────
describe('scenarios data', () => {
  it('has scenarios file', () => {
    const content = readDataFile('data/scenarios/scenarios.ts');
    expect(content).toMatch(/export/);
  });

  it('has practice exam questions', () => {
    const content = readDataFile('data/practiceExam/questions.ts');
    expect(content).toMatch(/export/);
    expect(content).toMatch(/question:/);
  });
});
