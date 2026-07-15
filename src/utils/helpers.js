/**
 * Форматирует значение Challenge Rating для отображения
 * 0.125 → 1/8
 * 0.25 → 1/4
 * 0.5 → 1/2
 * 1 → 1
 * 2 → 2
 * и т.д.
 */
export const formatChallengeRating = (cr) => {
  if (cr === undefined || cr === null) return '—';
  
  const num = Number(cr);
  if (isNaN(num)) return String(cr);

  // Дробные значения
  if (num === 0.125) return '1/8';
  if (num === 0.25) return '1/4';
  if (num === 0.5) return '1/2';

  // Целые числа и остальные
  return String(num);
};
