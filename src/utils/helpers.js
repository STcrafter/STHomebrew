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
/**
 * Возвращает бонус мастерства для заданного CR
 */
export const getProficiencyBonusForCR = (cr) => {
  const num = Number(cr);
  if (isNaN(num)) return 2;
  if (num <= 4) return 2;
  if (num <= 8) return 3;
  if (num <= 12) return 4;
  if (num <= 16) return 5;
  if (num <= 20) return 6;
  if (num <= 24) return 7;
  if (num <= 28) return 8;
  if (num <= 30) return 9;
  return 2; // fallback
};

/**
 * Возвращает опыт (XP) для заданного CR
 */
export const getXPForCR = (cr) => {
  const xpTable = {
    0: 10,
    0.125: 25,
    0.25: 50,
    0.5: 100,
    1: 200,
    2: 450,
    3: 700,
    4: 1100,
    5: 1800,
    6: 2300,
    7: 2900,
    8: 3900,
    9: 5000,
    10: 5900,
    11: 7200,
    12: 8400,
    13: 10000,
    14: 11500,
    15: 13000,
    16: 15000,
    17: 18000,
    18: 20000,
    19: 22000,
    20: 25000,
    21: 33000,
    22: 41000,
    23: 50000,
    24: 62000,
    25: 75000,
    26: 90000,
    27: 105000,
    28: 120000,
    29: 135000,
    30: 155000,
  };
  return xpTable[cr] !== undefined ? xpTable[cr] : 0;
};

/**
 * Форматирует строку ОП с бонусом мастерства и опытом
 */
export const formatCRWithDetails = (cr) => {
  if (cr === undefined || cr === null) return '—';
  const display = formatChallengeRating(cr);
  const pb = getProficiencyBonusForCR(cr);
  const xp = getXPForCR(cr);
  return `${display} (+${pb} БМ, ${xp} XP)`;
};
