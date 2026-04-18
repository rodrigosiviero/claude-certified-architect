/**
 * Deterministic shuffle using Fisher-Yates algorithm with a numeric seed.
 * Same seed + same input = same output. Changes daily.
 */
export function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Generate a daily seed from today's date string.
 * Consistent within a day, changes each day.
 */
export function getDailySeed(): number {
  const today = new Date().toISOString().split('T')[0];
  let seed = 0;
  for (let i = 0; i < today.length; i++) seed = seed * 31 + today.charCodeAt(i);
  return Math.abs(seed);
}

/**
 * Shuffle options for a single question, returning new options and correct index.
 */
export function shuffleQuestionOptions<Q extends { options: string[]; correct: number }>(
  q: Q,
  seed: number,
  questionIndex: number,
): Q & { shuffledOptions: string[]; shuffledCorrect: number } {
  const indices = q.options.map((_, i) => i);
  const shuffledIndices = seededShuffle(indices, seed + questionIndex * 31);
  const shuffledOptions = shuffledIndices.map(i => q.options[i]);
  const shuffledCorrect = shuffledIndices.indexOf(q.correct);
  return { ...q, shuffledOptions, shuffledCorrect };
}

/**
 * Shuffle options for an array of questions.
 */
export function shuffleAllOptions<Q extends { options: string[]; correct: number }>(
  questions: Q[],
  seed?: number,
): (Q & { shuffledOptions: string[]; shuffledCorrect: number })[] {
  const s = seed ?? getDailySeed();
  return questions.map((q, i) => shuffleQuestionOptions(q, s, i));
}
