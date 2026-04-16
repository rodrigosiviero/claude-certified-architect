/**
 * Build test — runs vite build and checks it succeeds.
 * This is the ultimate smoke test: if build fails, something is broken.
 */
import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

describe('production build', () => {
  it('vite build succeeds', { timeout: 60000 }, () => {
    const result = execSync('npx vite build 2>&1', {
      cwd: process.cwd(),
      encoding: 'utf-8',
      timeout: 60000,
    });
    expect(result).toContain('built in');
    expect(result).not.toContain('Build failed');
  });
});
