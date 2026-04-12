import levenshtein from 'fast-levenshtein';

export function calculateEditRatio(baseline: string, current: string): number {
  if (baseline.length === 0) return 1;
  const distance = levenshtein.get(baseline, current);
  const L = baseline.length;
  if (L === 0) return 0;
  
  const ratio = distance / L;
  return Math.min(ratio, 1.0);
}
