/**
 * trainer.js — Adaptive Learning Logic for FearMaths
 * Calculates question weights based on user performance history.
 */

/**
 * Calculates weight multiplier for a given question type/key based on history.
 * - Wrong answer history: weight +20% (+0.2)
 * - Correct answer history: weight -10% (-0.1, min 0.5)
 * 
 * @param {string} questionKey e.g. "normal_+"
 * @param {Array} history Array of progress records from IndexedDB
 * @returns {number} Weight multiplier
 */
export function getAdaptiveWeight(questionKey, history) {
  if (!history || history.length === 0) return 1.0;

  const relevantHistory = history.filter(item => `${item.level}_${item.operation}` === questionKey);
  if (relevantHistory.length === 0) return 1.0;

  let weight = 1.0;
  for (const record of relevantHistory) {
    if (record.correct) {
      weight = Math.max(0.5, weight - 0.1);
    } else {
      weight += 0.2;
    }
  }

  return weight;
}

/**
 * Selects an item from an array using weighted random selection.
 * @param {Array} items Array of items to choose from
 * @param {Function} weightFn Function that returns weight for an item
 * @returns {Object} Selected item
 */
export function weightedRandomSelect(items, weightFn) {
  const weights = items.map(weightFn);
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  let random = Math.random() * totalWeight;
  for (let i = 0; i < items.length; i++) {
    if (random < weights[i]) {
      return items[i];
    }
    random -= weights[i];
  }

  return items[0];
}
