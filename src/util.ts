export const resolveDotCenter = (num: number) => ({
  cx: 20 + num % 3 * 40,
  cy: 20 + Math.floor(num / 3) * 40,
});

export const distance = (x1: number, y1: number, x2: number, y2: number) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

export const limitInRange = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

export const arrSequence = (to: number) => Array(to + 1).fill(0).map((v, i) => i);
